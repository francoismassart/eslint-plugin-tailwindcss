import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";

import urlCreator from "../url-creator";
import {
  DEFAULTS,
  parsePluginSettings,
  type PluginSettings,
  sharedSettingsSchema,
} from "../utils/parse-plugin-settings";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "classnames-order";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
type MessageIds = "fix:sort";

export type MergedOptions = PluginSettings;

// TODO which one ?
// - type Options = [RuleOptions];
// - type Options = [MergedOptions];
type Options = [MergedOptions];

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

export const classnamesOrder = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Enforce a consistent and logical order of the Tailwind CSS classnames",
    },
    hasSuggestions: true,
    messages: {
      "fix:sort": "Invalid Tailwind CSS classnames order",
    },
    fixable: "code",
    // Schema is also parsed by `eslint-doc-generator`
    schema: [
      {
        type: "object",
        properties: {
          ...sharedSettingsSchema,
        },
        additionalProperties: false,
      },
    ],
    type: "suggestion",
  },
  /**
   * About `defaultOptions`:
   * - `defaultOptions` is not used in the generated documentation
   * - `defaultOptions` is used when options are not provided in the rules configuration
   * - If some configuration is provided as the second argument, it is ignored, not merged
   * - In other words, the `defaultOptions` is only used when the rule is used without configuration
   */
  defaultOptions: [
    {
      ...DEFAULTS,
    },
  ],
  create: (context, options) => {
    // Merged settings
    // const merged = parsePluginSettings(options[0]) as RuleOptions;
    const merged = parsePluginSettings<MergedOptions>({
      tailwindcss: options[0],
    }) as MergedOptions;
    console.log("\n", "merged (rule):", "\n", merged);

    return {
      CallExpression(node) {
        if (
          node.callee &&
          ((node.callee.type === "Identifier" && node.callee.name === "ctl") ||
            (node.callee.type === "MemberExpression" &&
              node.callee.property.type === "Identifier" &&
              node.callee.property.name === "ctl"))
        ) {
          // Add your logic here for when the callee is "ctl"
          const rangeStart = node.range[0];
          const range: readonly [number, number] = [rangeStart, rangeStart + 3];
          context.report({
            node,
            messageId: "fix:sort", // Prints the message with this ID when a problem is found
            fix: (fixer) => fixer.replaceTextRange(range, "TLC"), // TODO use the correct value
          });
        }
      },
    };
  },
});
