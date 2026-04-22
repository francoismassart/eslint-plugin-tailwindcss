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
      `<h1 class="whitelisted flex">attributeVisitor with TextAttribute (single class gets skipped)</h1>`,
      `<h1 class="  relative ">extra spaces</h1>`,
      `<h1 class=" relative " className=' flex'>Single + double quotes</h1>`,
      `<h1 class="group">group generates no classes</h1>`,
      `<h1 class="dark">dark generates no classes</h1>`,
      `<h1 class="flex md:block">modifiers</h1>`,
      `<h1 class="js-custom">modifiers</h1>`,
    ].map((testedNgCode) => ({
      code: testedNgCode,
      options: [{ whitelist: ["whitelisted", "js-[a-z0-9-]+"] }],
      languageOptions: withAngularParser,
    })),
  invalid: [
    {
      code: `<h1 class="unknown relative">head</h1>`,
      errors: [suggest("unknown", `<h1 class="relative">head</h1>`)],
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 class="relative unknown flex">body</h1>`,
      errors: [suggest("unknown", `<h1 class="relative flex">body</h1>`)],
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 class="relative unknown">tail</h1>`,
      errors: [suggest("unknown", `<h1 class="relative">tail</h1>`)],
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 className={"unknownreact relative"}>head</h1>`,
      errors: [suggest("unknownreact", `<h1 className={"relative"}>head</h1>`)],
    },
    {
      code: "<h1 className={`unknown:flex relative`}>Invalid modifier</h1>",
      errors: [
        suggest(
          "unknown:flex",
          "<h1 className={`relative`}>Invalid modifier</h1>",
        ),
      ],
    },
    {
      code: `ctl(\`unknownreact relative\`)`,
      errors: [suggest("unknownreact", `ctl(\`relative\`)`)],
    },
    {
      code: `
      ctl(\`
        unknownreact
        relative
      \`)`,
      errors: [
        suggest(
          "unknownreact",
          `
      ctl(\`
        relative
      \`)`,
        ),
      ],
    },
    {
      code: `
      ctl(\`
        absolute
        unknown-react
        relative
      \`)`,
      errors: [
        suggest(
          "unknown-react",
          `
      ctl(\`
        absolute
        relative
      \`)`,
        ),
      ],
    },
    {
      code: `<h1 class="relative unknown">tail</h1>`,
      errors: [suggest("unknown", `<h1 class="relative">tail</h1>`)],
    },

    // At this moment, no possibility to read the custom dark variant from the config
    /*/
    {
      code: "<h1 className={`dark`}>Custom dark class in config (.dark-theme)</h1>",
      errors: [
        suggest(
          "dark",
          "<h1 className={``}>Custom dark class in config (.dark-theme)</h1>",
        ),
      ],
    },
    //*/
  ],
});
