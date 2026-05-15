/**
 * @fileoverview Enforces a consistent order for the Tailwind CSS classnames, based on the compiler.
 * @author François Massart
 */

import { TSESTree } from "@typescript-eslint/utils";
import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext as TSESLintRuleContext } from "@typescript-eslint/utils/ts-eslint";

import urlCreator from "../url-creator";
import { joiner } from "../utils/joiner";
import {
  parsePluginSettings,
  PluginSettings,
} from "../utils/parse-plugin-settings";
import {
  dissectAtomicNode,
  getClassnamesFromValue,
} from "../utils/parser/node";
import { defineVisitors, GenericRuleContext } from "../utils/parser/visitors";
import {
  AtomicNode,
  createScriptVisitors,
  createTemplateVisitors,
} from "../utils/rule";
import { getSortedClassNamesWorker } from "../utils/tailwindcss-api/index";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "classnames-order";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds = "fix:sort";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

const sortClassnames = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  // console.log(options);
  for (const node of literals) {
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, context as unknown as GenericRuleContext);
    // Process the extracted classnames and report
    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);
    // Skip empty/Single className
    if (classNames.length <= 1) continue;
    const orderedClassNames = getSortedClassNamesWorker(
      settings.cssConfigPath,
      classNames,
    );

    // Generates the validated/sorted attribute value
    let validatedClassNamesValue = joiner({
      classNames: orderedClassNames,
      whitespaces,
      headSpace,
      tailSpace,
    });

    if (originalClassNamesValue !== validatedClassNamesValue) {
      validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;
      context.report({
        node: node as TSESTree.Node,
        messageId: "fix:sort",
        fix: function (fixer) {
          return fixer.replaceTextRange([start, end], validatedClassNamesValue);
        },
      });
    }
  }
};

export const classnamesOrder = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Enforces a consistent order for the Tailwind CSS classnames, based on the compiler.",
    },
    hasSuggestions: false,
    messages: {
      "fix:sort": "Invalid Tailwind CSS classnames order",
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
    type: "suggestion",
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
      createTemplateVisitors(context, settings, options, sortClassnames),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(context, settings, options, sortClassnames),
    );
  },
});
