import * as Parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

import { myRule, RULE_NAME } from "./my-rule";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: Parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run(RULE_NAME, myRule, {
  valid: [
    {
      // a code snippet that should pass the linter
      code: `const x = 5;`,
      options: [
        {
          callees: ["ctl2"],
          someBool: true,
          someEnum: "always",
        },
      ],
    },
    {
      code: `let y = 'abc123';`,
    },
    {
      code: `<button onClick={() => { const name = 'John'; alert(name); }}>JSX</button>`,
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
    {
      code: `<button onClick={() => { var name = 'John'; alert(name); }}>JSX</button>`,
      errors: [
        {
          messageId: "issue:var",
          suggestions: [
            {
              messageId: "fix:let",
              output: `<button onClick={() => { let name = 'John'; alert(name); }}>JSX</button>`,
            },
            {
              messageId: "fix:const",
              output: `<button onClick={() => { const name = 'John'; alert(name); }}>JSX</button>`,
            },
          ],
        },
      ],
    },
  ],
});
