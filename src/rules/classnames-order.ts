import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";

import { PluginSharedSettings } from "../types";
import urlCreator from "../url-creator";

export { ESLintUtils } from "@typescript-eslint/utils";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
type MessageIds = "fix:sort"; // "issue:var" | "fix:let" | "fix:const"

// The options that the rule can take
type Options = [
  {
    callees: Array<string>; // TODO can we use a {Set<string>} instead ?
    cssConfigPath: string;
    removeDuplicates: boolean;
    skipClassAttribute: boolean;
    tags: Array<string>; // TODO can we use a {Set<string>} instead ?
  }
];

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

export const classnamesOrder = createRule<Options, MessageIds>({
  name: "classnames-order",
  meta: {
    docs: {
      description:
        "Enforce a consistent and logical order of the Tailwind CSS classnames",
      recommended: "stylistic",
    },
    hasSuggestions: true,
    messages: {
      "fix:sort": "Invalid Tailwind CSS classnames order",
    },
    fixable: "code",
    // TODO replace with centralized options (export)
    schema: [
      {
        type: "object",
        properties: {
          callees: {
            description: "List of function names to validate classnames",
            type: "array",
            items: { type: "string", minLength: 0 },
            uniqueItems: true,
            default: ["dm"],
          },
          cssConfigPath: {
            description: "Path to the Tailwind CSS configuration file (*.css)",
            type: "string",
            default:
              "/Users/fma/eslint-plugin-tailwindcss/tests/stubs/css/tiny-prefixed.css",
          },
          removeDuplicates: {
            description: "Remove duplicated classnames",
            type: "boolean",
            default: true,
          },
          tags: {
            description: "List of tags to be detected in template literals",
            type: "array",
            items: { type: "string", minLength: 0 },
            uniqueItems: true,
            default: ["dt"],
          },
        },
        //additionalProperties: false, // TODO understand why this is breaking the tests
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
  // TODO replace with centralized options (export)
  defaultOptions: [
    {
      callees: ["d1"],
      cssConfigPath:
        "/Users/fma/eslint-plugin-tailwindcss/tests/stubs/css/tiny-prefixed.css",
      removeDuplicates: true,
      skipClassAttribute: false,
      tags: ["d2"],
    },
  ],
  create: (context, options) => {
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
          const range: readonly [number, number] = [
            rangeStart,
            rangeStart + 3 /* 'var'.length */,
          ];
          context.report({
            node,
            messageId: "fix:sort", // Prints the message with this ID when a problem is found
            fix: (fixer) => fixer.replaceTextRange(range, "TLC"), // TODO use the correct value
          });
        }
      },
      VariableDeclaration: (node) => {
        if (node.kind === "var") {
          // Reading inline configuration
          console.log("\n", "Options:", "\n", options[0]);

          // Shared settings
          const sharedSettings = (context.settings?.tailwindcss || {
            stylesheet: "",
            functions: [],
          }) as PluginSharedSettings;
          console.log("\n", "sharedSettings:", "\n", sharedSettings);

          const rangeStart = node.range[0];
          const range: readonly [number, number] = [
            rangeStart,
            rangeStart + 3 /* 'var'.length */,
          ];
          context.report({
            node,
            messageId: "fix:sort", // Prints the message with this ID when a problem is found
            fix: (fixer) =>
              fixer.replaceTextRange(range, "validatedClassNamesValue"), // TODO use the correct value
          });
        }
      },
    };
  },
});
