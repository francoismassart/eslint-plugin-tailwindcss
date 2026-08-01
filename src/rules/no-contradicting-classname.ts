/**
 * @fileoverview Avoid contradicting Tailwind CSS classnames.
 * @example `w-3 w-5` // 2 widths are conflicting
 * @author François Massart
 */

import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext as TSESLintRuleContext } from "@typescript-eslint/utils/ts-eslint";

import urlCreator from "../url-creator";
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
import {
  appendProgramExitVisitor,
  defineVisitors,
  GenericRuleContext,
} from "../utils/parser/visitors";
import {
  AtomicNode,
  createScriptVisitors,
  createTemplateVisitors,
} from "../utils/rule";
import { getClassPropertiesWorker } from "../utils/tailwindcss-api";

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
  propertiesByClassName: Map<string, Set<string> | undefined>,
) => {
  const groupMembers = new Map<string, Set<string>>();

  for (const baseClass of baseClasses) {
    const fullClassName = `${modifiers}${baseClass}`;
    const properties = propertiesByClassName.get(fullClassName);
    if (properties) groupMembers.set(fullClassName, properties);
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

  const preparedNodes = literals.map((node) => {
    const dissected = dissectAtomicNode(node, genericContext);
    const parsed = getClassnamesFromValue(dissected.originalClassNamesValue);
    const groups = groupByModifiersPrefix(parsed.classNames);
    return { node, ...dissected, ...parsed, groups };
  });

  const classNamesToCompile = [
    ...new Set(
      preparedNodes.flatMap(({ groups }) =>
        [...groups.entries()].flatMap(([modifiers, baseClasses]) =>
          baseClasses.length <= 1
            ? []
            : baseClasses.map((baseClass) => `${modifiers}${baseClass}`),
        ),
      ),
    ),
  ];
  const compiledProperties = getClassPropertiesWorker(
    settings.cssConfigPath,
    context.filename,
    classNamesToCompile,
    settings,
  );
  const propertiesByClassName = new Map<
    string,
    Set<string> | undefined
  >();
  for (const [index, className] of classNamesToCompile.entries()) {
    propertiesByClassName.set(
      className,
      compiledProperties[index],
    );
  }

  for (const preparedNode of preparedNodes) {
    const {
      node,
      originalClassNamesValue,
      start,
      end,
      prefix,
      suffix,
      classNames,
      whitespaces,
      headSpace,
      tailSpace,
      groups,
    } = preparedNode;

    // Skip empty/Single className
    if (classNames.length <= 1) continue;

    const conflictingsClassNames: Array<Array<string>> = [];

    // Generate all rules and save the affected CSS properties for each rule
    for (const [modifiers, baseCls] of groups.entries()) {
      // Single rule = no contradiction possible
      if (baseCls.length <= 1) continue;

      const groupMembers = getCompiledGroup(
        modifiers,
        baseCls,
        propertiesByClassName,
      );

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

    const literals: Array<AtomicNode> = [];
    const collectLiterals = (
      _context: RuleContext,
      _settings: PluginSettings,
      _options: RuleOptions,
      foundLiterals: Array<AtomicNode>,
    ) => literals.push(...foundLiterals);

    const visitors = defineVisitors(
      context as unknown as Readonly<GenericRuleContext>,
      // Template visitor is only used within Vue SFC files (inside <template> section).
      createTemplateVisitors(context, settings, options[0], collectLiterals),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(context, settings, options[0], collectLiterals),
    );

    return appendProgramExitVisitor(visitors, () =>
      getContradictions(context, settings, options[0], literals),
    );
  },
});
