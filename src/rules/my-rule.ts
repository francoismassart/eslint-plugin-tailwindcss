import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { createSyncFn } from "synckit";

import { PluginSharedSettings } from "../types";
import urlCreator from "../url-creator";

export { ESLintUtils } from "@typescript-eslint/utils";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
type MessageIds = "issue:var" | "fix:let" | "fix:const";

// The options that the rule can take
type Options = [
  {
    someBool: boolean;
    someEnum: string;
  }
];

const syncFunction = createSyncFn(require.resolve("../worker.mjs"));

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

export const myRule = createRule<Options, MessageIds>({
  name: "my-rule",
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
    schema: [
      {
        type: "object",
        properties: {
          someBool: {
            description: "someBool description.",
            type: "boolean",
            default: true,
          },
          someEnum: {
            description: "someEnum description.",
            type: "string",
            enum: ["always", "never"],
            default: "always",
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
  defaultOptions: [{ someBool: false, someEnum: "always" }],
  create: (context, options) => {
    return {
      VariableDeclaration: (node) => {
        if (node.kind === "var") {
          console.log("!!VAR!!!");
          console.log("!!VAR!!!");
          const asyncResult = syncFunction();
          console.log(asyncResult);
          // Reading inline configuration
          console.log(options[0]);

          // Shared settings
          const sharedSettings = (context.settings?.tailwindcss || {
            stylesheet: "",
            functions: [],
          }) as PluginSharedSettings;
          console.log(sharedSettings);

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
