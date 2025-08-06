import * as Parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

import { classnamesOrder, RULE_NAME } from "./classnames-order";

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

ruleTester.run(RULE_NAME, classnamesOrder, {
  valid: [
    {
      code: `<div className="flex">flex</div>`,
    },
  ],
  invalid: [
    {
      code: `<div className={ctl('flex')}>cn flex</div>`,
      options: [
        {
          callees: ["ctl"],
        },
      ],
      errors: [
        {
          messageId: "fix:sort",
        },
      ],
      output: `<div className={TLC('flex')}>cn flex</div>`,
    },
  ],
});
