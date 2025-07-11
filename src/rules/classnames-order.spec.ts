import { RuleTester } from "@typescript-eslint/rule-tester";

import { classnamesOrder } from "./classnames-order";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const sharedOptions = {
  callees: ["c1"],
  // cssConfigPath: require.resolve("../../tests/stubs/css/normal.css"),
  cssConfigPath:
    "/Users/fma/eslint-plugin-tailwindcss/tests/stubs/css/tiny-prefixed.css",
  removeDuplicates: true,
  skipClassAttribute: false,
  tags: ["t1"],
};
ruleTester.run("eslint-plugin-tailwindcss/classnames-order", classnamesOrder, {
  valid: [
    {
      code: `<div className="flex">flex</div>`,
      options: [sharedOptions],
    },
    {
      code: `<div className={cn('flex')}>cn flex</div>`,
      options: [sharedOptions],
    },
  ],
  invalid: [
    {
      code: `<div className={ctl('flex')}>cn flex</div>`,
      options: [sharedOptions],
      errors: [
        {
          messageId: "fix:sort",
        },
      ],
      output: `<div className={TLC('flex')}>cn flex</div>`,
    },
  ],
});
