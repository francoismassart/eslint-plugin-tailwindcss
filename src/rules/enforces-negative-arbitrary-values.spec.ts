import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import { generalSettings } from "../utils/parser/test-helpers";
import {
  enforcesNegativeArbitraryValues,
  type MessageIds,
  RULE_NAME,
} from "./enforces-negative-arbitrary-values";

const generateError = (
  oldClassName: string,
  newClassName: string,
): TestCaseError<MessageIds> => {
  return {
    messageId: "fix:irregular-negative",
    data: { oldClassName: oldClassName, newClassName: newClassName },
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

type SingleErrorTestCase = {
  code: string;
  invalidClass: string;
  patchedClass: string;
  output: string;
};

const singleErrorTestCases: Array<SingleErrorTestCase> = [
  {
    code: `ctl('-m-[-10px]')`,
    invalidClass: "-m-[-10px]",
    patchedClass: "m-[10px]",
    output: `ctl('m-[10px]')`,
  },
  {
    code: `ctl('-m-[10px]')`,
    invalidClass: "-m-[10px]",
    patchedClass: "m-[-10px]",
    output: `ctl('m-[-10px]')`,
  },
  {
    code: `ctl('dark:-m-[-10px]')`,
    invalidClass: "dark:-m-[-10px]",
    patchedClass: "dark:m-[10px]",
    output: `ctl('dark:m-[10px]')`,
  },
];

type MultipleErrorsTestCase = {
  code: string;
  invalidClasses: Array<string>;
  patchedClasses: Array<string>;
  outputs: Array<string>;
};

const multipleErrorsTestCases: Array<MultipleErrorsTestCase> = [
  {
    code: `
        ctl(\`
          lg:pt-[3px]
          dark:-m-[-123px]
          -m-[6px]
        \`)`,
    invalidClasses: ["dark:-m-[-123px]", "-m-[6px]"],
    patchedClasses: ["dark:m-[123px]", "m-[-6px]"],
    outputs: [
      `
        ctl(\`
          lg:pt-[3px]
          dark:m-[123px]
          -m-[6px]
        \`)`,
      `
        ctl(\`
          lg:pt-[3px]
          dark:m-[123px]
          m-[-6px]
        \`)`,
    ],
  },
];

ruleTester.run(RULE_NAME, enforcesNegativeArbitraryValues, {
  valid:
    // JSX
    ["ctl('m-[-10px]')"].map((testedJsxCode) => ({
      code: testedJsxCode,
    })),
  invalid: [
    ...singleErrorTestCases.map(
      ({ code, invalidClass, patchedClass, output }) => ({
        code: code,
        errors: [generateError(invalidClass, patchedClass)],
        output: output,
      }),
    ),
    ...multipleErrorsTestCases.map(
      ({ code, invalidClasses, patchedClasses, outputs }) => ({
        code: code,
        errors: invalidClasses.map((invalidClass, index) =>
          generateError(invalidClass, patchedClasses[index]),
        ),
        output: outputs,
      }),
    ),
  ],
});
