/**
 * @fileoverview Warns about `-` prefixed classnames using arbitrary values.
 * @author François Massart
 */

import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext as TSESLintRuleContext } from "@typescript-eslint/utils/ts-eslint";

import urlCreator from "../url-creator";
import { joiner } from "../utils/joiner";
import {
  parsePluginSettings,
  PluginSettings,
} from "../utils/parse-plugin-settings";
import {
  getBaseClassname,
  getModifiersPrefix,
} from "../utils/parser/classname";
import {
  dissectAtomicNode,
  generateLocForClassname,
  getClassnamesFromValue,
} from "../utils/parser/node";
import { defineVisitors, GenericRuleContext } from "../utils/parser/visitors";
import {
  AtomicNode,
  createScriptVisitors,
  createTemplateVisitors,
} from "../utils/rule";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "enforces-negative-arbitrary-values";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds = "fix:irregular-negative";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

const propertiesPattern = [
  "(?:inset|scale)(?:-[xy])?",
  "m",
  "top",
  "right",
  "bottom",
  "left",
  "z",
  "order",
  "tracking",
  "indent",
  "(?:backdrop-)?hue-rotate",
  "space-[xy]",
  "scroll-m(?:[xyse]|bs|be|t|r|b|l)?",
  "(?:skew|translate|rotate)(?:-[xyz])?",
].join("|");

const NEGATIVE_ARBITRARY_REGEX = new RegExp(
  `^!?-(?<property>${propertiesPattern})-\\[(?<arbitraryValue>[^\\]]+)\\]!?$`,
);

const negativeArbitraryClassnames = (
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

    const classNamesCount = classNames.length;

    for (let index = 0; index < classNamesCount; index++) {
      const targetClassName = classNames[index];
      const baseClass = getBaseClassname(targetClassName);
      const match = baseClass.match(NEGATIVE_ARBITRARY_REGEX);
      const bang =
        baseClass.startsWith("!") || baseClass.endsWith("!") ? "!" : "";

      if (!match?.groups) continue;

      const { property = "", arbitraryValue = "" } = match.groups;
      const modifiers = getModifiersPrefix(targetClassName);

      // Invert the arbitrary value (-10px -> 10px or 10px -> -10px)
      const arbitraryValuePatched = arbitraryValue.startsWith("-")
        ? arbitraryValue.slice(1)
        : "-" + arbitraryValue;

      const patchedClass = `${modifiers}${property}-[${arbitraryValuePatched}]${bang}`;

      const patchedLoc = generateLocForClassname(
        node,
        targetClassName,
        originalClassNamesValue,
        genericContext,
      );

      // Temporary mutation instead of cloning [...classNames] at each iteration for memory optimization
      classNames[index] = patchedClass;

      let patchedValue = joiner({
        classNames,
        whitespaces,
        headSpace,
        tailSpace,
        validator: (candidate) => candidate !== targetClassName,
      });

      // Restore the original array immediately for the next iteration
      classNames[index] = targetClassName;

      patchedValue = prefix + patchedValue + suffix;

      context.report({
        loc: patchedLoc,
        messageId: "fix:irregular-negative",
        data: {
          oldClassName: targetClassName,
          newClassName: patchedClass,
        },
        fix: (fixer) => fixer.replaceTextRange([start, end], patchedValue),
      });
    }
  }
};

export const enforcesNegativeArbitraryValues = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Warns about `-` prefixed classnames using arbitrary values.",
    },
    hasSuggestions: false,
    messages: {
      "fix:irregular-negative":
        "Replace '{{oldClassName}}' by '{{newClassName}}'",
    },
    fixable: "code",
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
    const genericContext = context as unknown as Readonly<GenericRuleContext>;

    return defineVisitors(
      genericContext,
      // Template visitor is only used within Vue SFC files (inside <template> section).
      createTemplateVisitors(
        context,
        settings,
        options,
        negativeArbitraryClassnames,
      ),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(
        context,
        settings,
        options,
        negativeArbitraryClassnames,
      ),
    );
  },
});
