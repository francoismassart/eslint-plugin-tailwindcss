import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import { withAllPresetsSettings } from "../utils/parser/test-helpers";
import {
  type MessageIds,
  noUnnecessaryArbitraryValue,
  RULE_NAME,
} from "./no-unnecessary-arbitrary-value";

const generateError = (
  oldClassName: string,
  newClassName: string,
): TestCaseError<MessageIds> => {
  return {
    messageId: "fix:unnecessary-arbitrary",
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
      ...withAllPresetsSettings,
    },
  },
});

ruleTester.run(RULE_NAME, noUnnecessaryArbitraryValue, {
  valid:
    // JSX
    ["ctl('m-[1.5px]')"].map((testedJsxCode) => ({
      code: testedJsxCode,
      settings: { tailwindcss: withAllPresetsSettings },
    })),
  invalid: [
    ...[
      {
        code: `ctl('aspect-[4/3]')`,
        invalidClass: "aspect-[4/3]",
        replacementClass: "aspect-retro",
      },
    ].map(({ code, invalidClass, replacementClass }) => ({
      code: code,
      settings: { tailwindcss: withAllPresetsSettings },
      errors: [generateError(invalidClass, replacementClass)],
    })),
    ...[
      {
        code: `
        ctl(\`
          lg:columns-side-menu
          aspect-auto
          -top-[3.14px]
        \`)`,
        invalidClasses: ["lg:columns-[16rem]", "-top-[3.14px]"],
        replacementClasses: ["lg:columns-side-menu", "-top-pi"],
      },
    ].map(({ code, invalidClasses, replacementClasses }) => ({
      code: code,
      settings: { tailwindcss: withAllPresetsSettings },
      errors: invalidClasses.map((invalidClass, index) =>
        generateError(invalidClass, replacementClasses[index]),
      ),
    })),
  ],
});
