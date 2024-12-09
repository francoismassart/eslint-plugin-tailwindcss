import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
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

interface SharedConfigurationSettings {
  demoTypescript?: {
    sharedSetting: string;
  };
}

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(
  (name) => `https://my-website.io/eslint/${name}`
);

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
  defaultOptions: [{ someBool: false, someEnum: "always" }],
  create: (context, options) => {
    return {
      VariableDeclaration: (node) => {
        if (node.kind === "var") {
          // Reading inline configuration
          console.log(options[0]);

          // Shared settings
          const demoTypeScriptSharedSettings = (context.settings
            ?.demoTypeScriptSettings || {
            sharedSetting: "default",
          }) as SharedConfigurationSettings;
          console.log(demoTypeScriptSharedSettings);

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
