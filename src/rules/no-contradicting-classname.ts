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
  getRangeFromAtomicNode,
} from "../utils/parser/node";
import { defineVisitors, GenericRuleContext } from "../utils/parser/visitors";
import {
  AtomicNode,
  createScriptVisitors,
  createTemplateVisitors,
} from "../utils/rule";
import {
  candidatesToCssWorker,
  flattenNestingWorker,
} from "../utils/tailwindcss-api";

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

const cssPropertiesCache = new Map<string, Set<string> | undefined>();

const getCompiledGroup = (
  modifiers: string,
  baseClasses: Array<string>,
  settings: PluginSettings,
) => {
  const groupMembers = new Map<string, Set<string>>();

  for (const baseClass of baseClasses) {
    const fullClassName = `${modifiers}${baseClass}`;

    if (cssPropertiesCache.has(fullClassName)) {
      const cachedProperties = cssPropertiesCache.get(fullClassName);
      if (cachedProperties) {
        groupMembers.set(fullClassName, cachedProperties);
      }
      continue;
    }

    const cssRules = candidatesToCssWorker(
      settings.cssConfigPath,
      fullClassName,
    );
    const cssRule = cssRules[0];

    if (!cssRule) {
      cssPropertiesCache.set(fullClassName, undefined);
      continue;
    }

    const flattenedSelectors = flattenNestingWorker(cssRule);
    const hasValidSelector = flattenedSelectors.some(
      // Ignore rules that only have pseudo selectors (e.g. `::before`, `::after`)
      (selector) => !selector.includes("::"),
    );

    if (!hasValidSelector) {
      cssPropertiesCache.set(fullClassName, undefined);
      continue;
    }

    const cssProperties = getPropertiesFromCssRule(cssRule);
    cssPropertiesCache.set(fullClassName, cssProperties);
    groupMembers.set(fullClassName, cssProperties);
  }
  return groupMembers;
};

const getCommonProperties = (groupMembers: Map<string, Set<string>>) => {
  const commonProperties = new Map<Set<string>, Array<string>>();
  for (const [className, properties] of groupMembers.entries()) {
    // Find if the key (Set) already exists in commonProps
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
  const genericContext = context as unknown as GenericRuleContext;

  for (const node of literals) {
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, genericContext);

    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);

    // Skip empty/Single className
    if (classNames.length <= 1) continue;

    // Group by modifier
    const groups = groupByModifiersPrefix(classNames);
    const conflictingsClassNames: Array<Array<string>> = [];

    // Generate all rules and save the affected CSS properties for each rule
    for (const [modifiers, baseCls] of groups.entries()) {
      // Single rule = no contradiction possible
      if (baseCls.length <= 1) continue;

      const groupMembers = getCompiledGroup(modifiers, baseCls, settings);

      // If the resolved group doesn't have at least 2 valid members, no conflict is possible
      if (groupMembers.size <= 1) continue;

      const commonProperties = getCommonProperties(groupMembers);

      // Filter out the entries in commonProps that have more than 1 className (these are the conflicting classNames)
      for (const [, classNames] of commonProperties.entries()) {
        if (classNames.length > 1) {
          conflictingsClassNames.push(classNames);
        }
      }
    }

    if (conflictingsClassNames.length === 0) continue;

    const targetRange = getRangeFromAtomicNode(node);
    const isRangeValid = !!(targetRange[0] && targetRange[1]);

    // Report
    for (const conflict of conflictingsClassNames) {
      const totalConflicts = conflict.length;

      for (let index = 0; index < totalConflicts; index++) {
        const targetClassname = conflict[index];

        const otherClassnames = conflict.filter(
          (_, index_) => index_ !== index,
        );

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

        context.report({
          loc: patchedLoc,
          messageId: "issue:contradiction",
          data: {
            classname: targetClassname,
            otherClassnames: otherClassnamesFormatted,
          },
          suggest: isRangeValid
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
