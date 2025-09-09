import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import {
  generalSettings,
  withAngularParser,
} from "../utils/parser/test-helpers";
import { noCustomClassname, RULE_NAME } from "./no-custom-classname";

const error: TestCaseError<"issue:unknown-classname"> = {
  messageId: "issue:unknown-classname",
};
const errors = [error];

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

ruleTester.run(RULE_NAME, noCustomClassname, {
  valid:
    // Angular / Native HTML + static text
    [
      `<h1 class="flex">attributeVisitor with TextAttribute (single class gets skipped)</h1>`,
      `<h1 class="  relative ">extra spaces</h1>`,
      `<h1 class=" relative " className=' flex'>Single + double quotes</h1>`,
    ].map((testedNgCode) => ({
      code: testedNgCode,
      languageOptions: withAngularParser,
    })),
  invalid: [
    {
      code: `<h1 class="unknown relative">basic</h1>`,
      errors,
      languageOptions: withAngularParser,
    },
  ],
});
