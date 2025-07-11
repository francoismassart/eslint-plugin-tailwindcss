import { RuleTester } from "@typescript-eslint/rule-tester";

import { classnamesOrder } from "./classnames-order";

const ruleTester = new RuleTester();

const sharedOptions = {
  callees: ["c1"],
  // cssConfigPath: require.resolve("../../tests/stubs/css/normal.css"),
  cssConfigPath:
    "/Users/fma/eslint-plugin-tailwindcss/tests/stubs/css/tiny-prefixed.css",
  removeDuplicates: true,
  skipClassAttribute: false,
  tags: ["t1"],
};

const withJSX = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

ruleTester.run("classnames-order", classnamesOrder, {
  valid: [
    {
      code: `<div className="flex">flex</div>`,
      // @ts-expect-error ts(2353)
      languageOptions: withJSX,
      options: [sharedOptions],
    },
    {
      code: `<div className={cn('flex')}>cn flex</div>`,
      // @ts-expect-error ts(2353)
      languageOptions: withJSX,
      options: [sharedOptions],
    },
  ],
  invalid: [
    {
      code: `<div className={ctl('flex')}>cn flex</div>`,
      // @ts-expect-error ts(2353)
      languageOptions: withJSX,
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
