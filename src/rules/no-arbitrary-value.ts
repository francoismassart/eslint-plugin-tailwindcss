/**
 * @fileoverview Forbid using arbitrary values in classnames.
 * @author François Massart
 */

import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext as TSESLintRuleContext } from "@typescript-eslint/utils/ts-eslint";

import urlCreator from "../url-creator";
import {
  parsePluginSettings,
  PluginSettings,
} from "../utils/parse-plugin-settings";
import { getBaseClassname } from "../utils/parser/classname";
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

export const RULE_NAME = "no-arbitrary-value";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds = "issue:arbitrary-value";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

// Matches classnames that contain arbitrary values (e.g., m-[5px])
const regexPattern = /^[-a-z]+-\[.*\]$/;

const arbitraryClassnames = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  // console.log(options);
  const genericContext = context as unknown as GenericRuleContext;
  for (const node of literals) {
    const { originalClassNamesValue } = dissectAtomicNode(node, genericContext);
    // Process the extracted classnames and report
    const { classNames } = getClassnamesFromValue(originalClassNamesValue);
    for (const targetClassName of classNames) {
      const baseClass = getBaseClassname(targetClassName);
      const match = regexPattern.test(baseClass);

      if (!match) continue;

      const patchedLoc = generateLocForClassname(
        node,
        targetClassName,
        originalClassNamesValue,
        genericContext,
      );

      context.report({
        loc: patchedLoc,
        messageId: "issue:arbitrary-value",
        data: {
          className: targetClassName,
        },
      });
    }
  }
};

export const noArbitraryValue = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Forbid using arbitrary values in classnames.",
    },
    hasSuggestions: false,
    messages: {
      "issue:arbitrary-value": "Arbitrary value detected in '{{className}}'",
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
      createTemplateVisitors(context, settings, options, arbitraryClassnames),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(context, settings, options, arbitraryClassnames),
    );
  },
});

// TODO: option or new rule to disallow number values like `border-1` in favor of `border-preset1`
