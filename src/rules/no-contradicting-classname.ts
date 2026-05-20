/**
 * @fileoverview Avoid contradicting Tailwind CSS classnames.
 * @example `w-3 w-5` // 2 widths are conflicting
 * @author François Massart
 */

import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext as TSESLintRuleContext } from "@typescript-eslint/utils/ts-eslint";

import urlCreator from "../url-creator";
import { getPropertiesFromCssRule } from "../utils/get-properties-from-css-rule";
import { joiner } from "../utils/joiner";
import { mapGetKeyFromSetValues } from "../utils/map";
import {
  parsePluginSettings,
  PluginSettings,
} from "../utils/parse-plugin-settings";
import { groupByModifiersPrefix } from "../utils/parser/groups";
import {
  dissectAtomicNode,
  generateLocForClassname,
  getClassnamesFromValue,
  getRange,
} from "../utils/parser/node";
import { defineVisitors, GenericRuleContext } from "../utils/parser/visitors";
import {
  AtomicNode,
  createScriptVisitors,
  createTemplateVisitors,
} from "../utils/rule";
import { candidatesToCssWorker } from "../utils/tailwindcss-api";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "no-contradicting-classname";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds = "issue:contradiction" | "fix:contradiction:keep";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

const getCompiledGroup = (
  modifiers: string,
  baseClasses: Array<string>,
  settings: PluginSettings,
) => {
  const groupMembers = new Map<string, Set<string>>();
  for (const baseClass of baseClasses) {
    const fullClassName = `${modifiers}${baseClass}`;
    // console.log("  class:", fullClassName);
    const cssRules = candidatesToCssWorker(
      settings.cssConfigPath,
      fullClassName,
    );
    const cssRule = cssRules[0];
    if (!cssRule) continue;
    const cssProperties = getPropertiesFromCssRule(cssRule);
    // console.log("  " + fullClassName, cssProperties);
    groupMembers.set(fullClassName, cssProperties);
  }
  return groupMembers;
};

const getCommonProperties = (groupMembers: Map<string, Set<string>>) => {
  const commonProperties = new Map<Set<string>, Array<string>>();
  for (const [className, properties] of groupMembers.entries()) {
    // find if the key (Set) already exists in commonProps
    const existingKey = mapGetKeyFromSetValues(commonProperties, properties);
    const listOfClassNames: Array<string> = existingKey
      ? commonProperties.get(existingKey)!
      : [];
    listOfClassNames.push(className);
    commonProperties.set(existingKey ?? properties, listOfClassNames);
  }
  return commonProperties;
};

const getContradictions = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  // console.log(options);
  const genericContext = context as unknown as GenericRuleContext;
  for (const node of literals) {
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, genericContext);
    // Process the extracted classnames and report
    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);
    // Skip empty/Single className
    if (classNames.length <= 1) continue;

    // Group by modifier
    const groups = groupByModifiersPrefix(classNames);
    // console.log(groups.size, "group(s) found");

    const conflictingsClassNames: Array<Array<string>> = [];

    // Generate all rules and save the affected CSS properties for each rule
    for (const [modifiers, baseCls] of groups.entries()) {
      // console.log("group:", `"${modifiers}"`);

      // Within each group (e.g. "hover:")
      const groupMembers = getCompiledGroup(modifiers, baseCls, settings);

      // Find conflicts within the group
      const commonProperties = getCommonProperties(groupMembers);
      // console.log(commonProperties);

      // Filter out the entries in commonProps that have more than 1 className (these are the conflicting classNames)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [properties, classNames] of commonProperties.entries()) {
        if (classNames.length > 1) {
          conflictingsClassNames.push(classNames);
        }
      }
    }

    if (conflictingsClassNames.length === 0) continue;

    // console.log("conflicting classnames:", conflictingsClassNames);

    // Report
    for (const conflict of conflictingsClassNames) {
      for (let index_ = 0; index_ < conflict.length; index_++) {
        const targetClassname = conflict[index_];
        const otherClassnames = conflict.filter((_, index) => index !== index_);
        const otherClassnamesFormatted = otherClassnames
          .map((cn) => `'${cn}'`)
          .join(", ");
        let patchedValue = joiner({
          classNames,
          whitespaces,
          headSpace,
          tailSpace,
          validator: (cls) => !otherClassnames.includes(cls),
        });
        patchedValue = prefix + patchedValue + suffix;
        const patchedLoc = generateLocForClassname(
          node,
          targetClassname,
          originalClassNamesValue,
          genericContext,
        );
        const targetRange = getRange(
          node,
          targetClassname,
          originalClassNamesValue,
        );
        context.report({
          loc: patchedLoc,
          messageId: "issue:contradiction",
          data: {
            classname: targetClassname,
            otherClassnames: otherClassnamesFormatted,
          },
          suggest:
            targetRange[0] && targetRange[1]
              ? [
                  {
                    messageId: "fix:contradiction:keep",
                    data: {
                      keepClassname: targetClassname,
                      removeClassnames: otherClassnamesFormatted,
                    },
                    fix: (fixer) =>
                      fixer.replaceTextRange([start, end], patchedValue),
                  },
                ]
              : [],
        });
      }
    }
  }
};

export const noContradictingClassname = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Avoid contradicting Tailwind CSS classnames.",
    },
    hasSuggestions: true,
    messages: {
      "issue:contradiction": `'{{classname}}' conflicts with {{otherClassnames}}`,
      "fix:contradiction:keep": `Keep '{{keepClassname}}' (remove {{removeClassnames}})`,
    },
    // Schema is also parsed by `eslint-doc-generator`
    schema: [
      {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    ],
    defaultOptions: [{}],
    type: "problem",
  },
  /**
   * About `defaultOptions`:
   * - `defaultOptions` is not parsed to generate the documentation
   * - `defaultOptions` is used when options are NOT provided in the rules configuration
   * - If some configuration is provided as the second argument, `defaultOptions` is ignored completely (not merged)
   * - In other words, the `defaultOptions` is only used when the rule is used WITHOUT any configuration
   */
  defaultOptions: [{}],
  create: (context, options) => {
    // Merged settings
    const settings = parsePluginSettings(context.settings);

    return defineVisitors(
      context as unknown as Readonly<GenericRuleContext>,
      // Template visitor is only used within Vue SFC files (inside <template> section).
      createTemplateVisitors(context, settings, options, getContradictions),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(context, settings, options, getContradictions),
    );
  },
});
