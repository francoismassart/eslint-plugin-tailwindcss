import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import {
  generalSettings,
  withAngularParser,
} from "../utils/parser/test-helpers";
import {
  MessageIds,
  noCustomClassname,
  RULE_NAME,
} from "./no-custom-classname";

const suggest = (
  classname: string,
  output: string,
): TestCaseError<MessageIds> => {
  return {
    messageId: "issue:unknown-classname",
    suggestions: [
      {
        messageId: "fix:unknown-classname:remove",
        data: { classname: classname },
        output: output,
      },
    ],
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
      code: `<h1 class="unknown relative">head</h1>`,
      errors: [suggest("unknown", `<h1 class=" relative">head</h1>`)],
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 class="relative unknown flex">body</h1>`,
      errors: [suggest("unknown", `<h1 class="relative  flex">body</h1>`)],
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 class="relative unknown">tail</h1>`,
      errors: [suggest("unknown", `<h1 class="relative ">tail</h1>`)],
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 className={"unknownreact relative"}>head</h1>`,
      errors: [
        suggest("unknownreact", `<h1 className={" relative"}>head</h1>`),
      ],
    },
    {
      code: "<h1 className={`unknown-template-element relative`}>head</h1>",
      errors: [
        suggest(
          "unknown-template-element",
          "<h1 className={` relative`}>head</h1>",
        ),
      ],
    },
  ],
});
