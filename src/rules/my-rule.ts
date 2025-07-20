import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";

import { PluginSharedSettings } from "../types";
import urlCreator from "../url-creator";
import {
  DEFAULTS,
  parsePluginSettings,
  type PluginSettings,
  sharedSettingsSchema,
} from "../utils/parse-plugin-settings";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "my-rule";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
type MessageIds = "issue:var" | "fix:let" | "fix:const";

/**
 * The extra options that the rule can accept.
 * These options get merged with the shared settings.
 * The typing is not used by `eslint-doc-generator` which uses the `schema` property in the rule's metadata.
 * Yet, it is useful for the IDE to provide autocompletion and type checking.
 */
type RuleOptions = {
  someBool: boolean;
  someEnum: string;
};

export type MergedOptions = RuleOptions & PluginSettings;

const RULE_DEFAULT: RuleOptions = {
  someBool: false,
  someEnum: "always",
};

// TODO which one ?
// - type Options = [RuleOptions];
// - type Options = [MergedOptions];
type Options = [MergedOptions];

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

export const myRule = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "An example ESLint rule",
    },
    hasSuggestions: true,
    messages: {
      "issue:var": "Prefer using `let` or `const`",
      "fix:let": "Replace this `var` declaration with `let`",
      "fix:const": "Replace this `var` declaration with `const`",
    },
    // Schema is also parsed by `eslint-doc-generator`
    schema: [
      {
        type: "object",
        properties: {
          ...sharedSettingsSchema,
          someBool: {
            description: "someBool description.",
            type: "boolean",
            default: RULE_DEFAULT.someBool,
          },
          someEnum: {
            description: "someEnum description.",
            type: "string",
            enum: ["always", "never"],
            default: RULE_DEFAULT.someEnum,
          },
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
      someBool: false,
      someEnum: "always",
    },
  ],
  create: (context, options) => {
    // Reading inline configuration
    console.log("\n", new Date(), "\n", "Options (rule):", "\n", options[0]);

    // Shared settings
    const sharedSettings = (context.settings?.tailwindcss ||
      DEFAULTS) as PluginSharedSettings;
    console.log("\n", "sharedSettings (rule):", "\n", sharedSettings);

    // Merged settings
    // const merged = parsePluginSettings(options[0]) as RuleOptions;
    const merged = parsePluginSettings<RuleOptions>({
      tailwindcss: options[0],
    }) as RuleOptions;
    console.log("\n", "merged (rule):", "\n", merged);

    return {
      VariableDeclaration: (node) => {
        console.log("\n", "merged.someBool:", "\n", merged.someBool);
        if (merged.someBool === true) {
          console.log("someBool is true, processing VariableDeclaration");
          return;
        }
        if (node.kind === "var") {
          const rangeStart = node.range[0];
          const range: readonly [number, number] = [
            rangeStart,
            rangeStart + 3 /* 'var'.length */,
          ];
          context.report({
            node,
            messageId: "issue:var", // Prints the message with this ID when a problem is found
            suggest: [
              {
                messageId: "fix:let",
                fix: (fixer) => fixer.replaceTextRange(range, "let"),
              },
              {
                messageId: "fix:const",
                fix: (fixer) => fixer.replaceTextRange(range, "const"),
              },
            ],
          });
        }
      },
    };
  },
});
