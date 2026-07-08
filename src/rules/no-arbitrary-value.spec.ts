import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import { generalSettings } from "../utils/parser/test-helpers";
import {
  type MessageIds,
  noArbitraryValue,
  RULE_NAME,
} from "./no-arbitrary-value";

const generateError = (className: string): TestCaseError<MessageIds> => {
  return {
    messageId: "issue:arbitrary-value",
    data: { className },
  };
};

const ruleTester = new RuleTester({
  languageOptions: {
    parser: Parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    tailwindcss: {
      ...generalSettings,
    },
  },
});

ruleTester.run(RULE_NAME, noArbitraryValue, {
  valid:
    // JSX
    ["ctl('m-0')"].map((testedJsxCode) => ({
      code: testedJsxCode,
    })),
  invalid: [
    ...[
      {
        code: `ctl('dark:m-[10px]')`,
        invalidClass: "dark:m-[10px]",
      },
      {
        code: `ctl('dark:!m-[10px]')`,
        invalidClass: "dark:!m-[10px]",
      },
      {
        code: `ctl('dark:m-[10px]!')`,
        invalidClass: "dark:m-[10px]!",
      },
    ].map(({ code, invalidClass }) => ({
      code: code,
      errors: [generateError(invalidClass)],
    })),
    ...[
      {
        code: `
        ctl(\`
          lg:pt-[3px]
          dark:-m-[-123px]
          -m-[6px]
        \`)`,
        invalidClasses: ["lg:pt-[3px]", "dark:-m-[-123px]", "-m-[6px]"],
      },
      {
        code: `
        ctl(\`
          lg:pt-[3px]
          w-[\${width}]
          dark:-m-[-123px]
          h-[\${height}]
          -m-[6px]
        \`)`,
        invalidClasses: ["lg:pt-[3px]", "dark:-m-[-123px]", "-m-[6px]"],
      },
    ].map(({ code, invalidClasses }) => ({
      code: code,
      errors: invalidClasses.map((invalidClass) => generateError(invalidClass)),
    })),
  ],
});
