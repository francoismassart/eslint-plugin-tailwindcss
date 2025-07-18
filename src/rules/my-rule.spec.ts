import { RuleTester } from "@typescript-eslint/rule-tester";

import { myRule, RULE_NAME } from "./my-rule";

// const ruleTester = new RuleTester({
//   languageOptions: {
//     parser: require("@typescript-eslint/parser"),
//     parserOptions: {
//       ecmaFeatures: {
//         jsx: true,
//       },
//     },
//   },
// });

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, myRule, {
  valid: [
    {
      // a code snippet that should pass the linter
      code: `const x = 5;`,
    },
    {
      code: `let y = 'abc123';`,
    },
  ],
  invalid: [
    {
      code: `var z = 'foo'`,
      errors: [
        {
          messageId: "issue:var",
          suggestions: [
            {
              messageId: "fix:let",
              output: `let z = 'foo'`,
            },
            {
              messageId: "fix:const",
              output: `const z = 'foo'`,
            },
          ],
        },
      ],
    },
  ],
});
