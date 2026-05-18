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
  // inset, inset-x, inset-y, scale, scale-x, scale-y
  "((inset|scale)(?:-(?:x|y))?)",
  // simple properties
  "(m|top|right|bottom|left|z|order|tracking|indent|(backdrop-)?hue-rotate)|(space-(x|y))",
  // scroll-m, scroll-mx, scroll-my, scroll-mt, scroll-mb, scroll-ml, scroll-mr, scroll-ms, scroll-me, scroll-mbs, scroll-mbe
  "(scroll-m(?:x|y|s|e|bs|be|t|r|b|l|))",
  // skew, skew-x, skew-y, translate, translate-x, translate-y, rotate, rotate-x, rotate-y, rotate-z
  "((skew|translate|rotate)(?:-(?:x|y|z))?)",
].join("|");
// Matches classnames that start with '-' and contain arbitrary values (e.g., -m-[10px])
const regexPattern = [
  "^",
  "(?<negative>-)",
  "(?<property>(" + propertiesPattern + "))",
  String.raw`-\[(?<arbitraryValue>.*)\]`,
  "$",
].join("");

const negativeArbitraryRegEx = new RegExp(regexPattern);

const negativeArbitraryClassnames = (
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
    for (const [index, targetClassName] of classNames.entries()) {
      const baseClass = getBaseClassname(targetClassName);
      const modifiers = getModifiersPrefix(targetClassName);
      const match = baseClass.match(negativeArbitraryRegEx);

      if (!match?.groups) continue;

      const patchedLoc = generateLocForClassname(
        node,
        targetClassName,
        originalClassNamesValue,
        genericContext,
      );

      const { property = "", arbitraryValue = "" } = match.groups;
      const arbitraryValuePatched = arbitraryValue.startsWith("-")
        ? arbitraryValue.slice(1)
        : "-" + arbitraryValue;
      const patchedClass = `${modifiers}${property}-[${arbitraryValuePatched}]`;

      // Patch the problematic classname
      classNames[index] = patchedClass;

      // Generates the "cleaned" attribute value
      let patchedValue = joiner({
        classNames,
        whitespaces,
        headSpace,
        tailSpace,
        validator: (candidate) => candidate !== targetClassName,
      });
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
      "fix:irregular-negative": `Replace '{{oldClassName}}' by '{{newClassName}}'`,
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

    return defineVisitors(
      context as unknown as Readonly<GenericRuleContext>,
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
