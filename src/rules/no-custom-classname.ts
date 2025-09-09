/**
 * @fileoverview Detects classnames which do not belong to Tailwind CSS.
 * @author François Massart
 */

import { TSESTree } from "@typescript-eslint/utils";
import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext as TSESLintRuleContext } from "@typescript-eslint/utils/ts-eslint";

import urlCreator from "../url-creator";
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
import { isValidClassNameWorker } from "../utils/tailwindcss-api";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "no-custom-classname";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
type MessageIds = "issue:unknown-classname";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

const detectCustomClassnames = (
  context: RuleContext,
  settings: PluginSettings,
  literals: Array<AtomicNode>,
) => {
  for (const node of literals) {
    const { originalClassNamesValue } = dissectAtomicNode(
      node,
      context as unknown as GenericRuleContext,
    );
    // Process the extracted classnames and report
    const { classNames } = getClassnamesFromValue(originalClassNamesValue);
    for (const className of classNames) {
      if (!isValidClassNameWorker(settings.cssConfigPath, className)) {
        context.report({
          node: node as TSESTree.Node,
          // TODO see if useful
          // context.sourceCode.getLocFromIndex(0)
          // loc: { column: 1, line: 1 },
          // loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } },
          messageId: "issue:unknown-classname",
          data: {
            classname: className,
          },
        });
      }
    }
  }
};

export const noCustomClassname = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Detects classnames which do not belong to Tailwind CSS.",
    },
    hasSuggestions: false,
    messages: {
      "issue:unknown-classname": `Classname '{{classname}}' is not a Tailwind CSS class!`,
    },
    // Schema is also parsed by `eslint-doc-generator`
    schema: [
      {
        type: "object",
        properties: {
          whitelist: {
            description:
              "List of classnames to ignore (whitelist). Exact match or regular expression.",
            type: "array",
            items: { type: "string", minLength: 0 },
            uniqueItems: true,
          },
        },
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
  defaultOptions: [{ whitelist: [] }],
  create: (context, options) => {
    // Merged settings
    const settings = parsePluginSettings(context.settings);

    console.log(options);

    return defineVisitors(
      context as unknown as Readonly<GenericRuleContext>,
      // Template visitor is only used within Vue SFC files (inside <template> section).
      createTemplateVisitors(
        context,
        settings,
        options,
        detectCustomClassnames,
      ),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(context, settings, options, detectCustomClassnames),
    );
  },
});
