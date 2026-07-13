import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import { generalSettings } from "../utils/parser/test-helpers";
import {
  importantModifierSuffix,
  type MessageIds,
  RULE_NAME,
} from "./important-modifier-suffix";

const generateError = (
  className: string,
  patchedClassName: string,
): TestCaseError<MessageIds> => {
  return {
    messageId: "issue:important-modifier-prefix",
    data: { className, patchedClassName },
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

ruleTester.run(RULE_NAME, importantModifierSuffix, {
  valid:
    // JSX
    ["ctl('m-0')", "ctl('m-0! lg:p-5!')"].map((testedJsxCode) => ({
      code: testedJsxCode,
    })),
  invalid: [
    ...[
      {
        code: `ctl('dark:!m-[10px]')`,
        importantPrefixedClass: "dark:!m-[10px]",
        importantSuffixedClass: "dark:m-[10px]!",
      },
    ].map(({ code, importantPrefixedClass, importantSuffixedClass }) => ({
      code: code,
      errors: [generateError(importantPrefixedClass, importantSuffixedClass)],
    })),
    ...[
      {
        code: `
        ctl(\`
          lg:!block
          dark:bg-white
          !-m-2
        \`)`,
        invalidClasses: ["lg:!block", "!-m-2"],
        suffixedClasses: ["lg:block!", "-m-2!"],
      },
    ].map(({ code, invalidClasses, suffixedClasses }) => ({
      code: code,
      errors: invalidClasses.map((importantPrefixedClass, index) =>
        generateError(importantPrefixedClass, suffixedClasses[index]),
      ),
    })),
  ],
});
