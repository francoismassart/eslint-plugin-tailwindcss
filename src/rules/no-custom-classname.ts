/**
 * @fileoverview Detects classnames which do not belong to Tailwind CSS.
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
import { passRegexTest } from "../utils/parser/classname";
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
import { isValidClassNameWorker } from "../utils/tailwindcss-api";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "no-custom-classname";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds =
  | "issue:unknown-classname"
  | "fix:unknown-classname:remove";

export type RuleOptions = {
  whitelist: Array<string>;
};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

const isWhitelisted = (className: string, whitelist: Set<string>): boolean => {
  if (whitelist.has(className)) return true;
  return [...whitelist].some((pattern) => passRegexTest(pattern, className));
};

const detectCustomClassnames = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  const internalWhitelist = ["group", "dark"];
  const parsedOptions: RuleOptions = options || { whitelist: [] };
  const mergedWhitelist = new Set([
    ...parsedOptions.whitelist,
    ...internalWhitelist,
  ]);
  // console.log(parsedOptions);
  const genericContext = context as unknown as GenericRuleContext;
  for (const node of literals) {
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, genericContext);
    // Process the extracted classnames and report
    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);
    for (const customClass of classNames) {
      if (isWhitelisted(customClass, mergedWhitelist)) continue;
      if (isValidClassNameWorker(settings.cssConfigPath, customClass)) continue;

      // Generates the "cleaned" attribute value
      let patchedValue = joiner({
        classNames,
        whitespaces,
        headSpace,
        tailSpace,
        validator: (candidate) => candidate !== customClass,
      });
      const patchedLoc = generateLocForClassname(
        node,
        customClass,
        originalClassNamesValue,
        genericContext,
      );
      const range = getRange(node, customClass, originalClassNamesValue);
      patchedValue = prefix + patchedValue + suffix;

      if (originalClassNamesValue === patchedValue) {
        continue;
      }
      context.report({
        loc: patchedLoc,
        messageId: "issue:unknown-classname",
        data: {
          classname: customClass,
        },
        suggest:
          range[0] && range[1]
            ? [
                {
                  messageId: "fix:unknown-classname:remove",
                  data: {
                    classname: customClass,
                  },
                  fix: (fixer) =>
                    fixer.replaceTextRange([start, end], patchedValue),
                },
              ]
            : [],
      });
    }
  }
};

export const noCustomClassname = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Detects classnames which do not belong to Tailwind CSS.",
    },
    hasSuggestions: true,
    messages: {
      "issue:unknown-classname": `Classname '{{classname}}' is not a Tailwind CSS class!`,
      "fix:unknown-classname:remove":
        "Remove unknown classname '{{classname}}'",
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
    defaultOptions: [{ whitelist: [] }],
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

    return defineVisitors(
      context as unknown as Readonly<GenericRuleContext>,
      // Template visitor is only used within Vue SFC files (inside <template> section).
      createTemplateVisitors(
        context,
        settings,
        options[0],
        detectCustomClassnames,
      ),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(
        context,
        settings,
        options[0],
        detectCustomClassnames,
      ),
    );
  },
});
