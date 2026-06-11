import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import {
  generalSettings,
  prefixedSettings,
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
  valid: [
    ...[
      // Angular / Native HTML + static text
      `<h1 class="whitelisted flex">attributeVisitor with TextAttribute (single class gets skipped)</h1>`,
      `<h1 class="  relative ">extra spaces</h1>`,
      `<h1 class=" relative " className=' flex'>Single + double quotes</h1>`,
      `<h1 class="group">group generates no classes</h1>`,
      `<h1 class="group/name">group/name</h1>`,
      `<h1 class="dark">dark generates no classes</h1>`,
      `<h1 class="flex md:block">modifiers</h1>`,
      `<h1 class="js-custom">js-</h1>`,
      `<h1 class="i-heroicons:chevron-up-solid">Issue 284</h1>`,
      `<p><span class="text-[min(theme(fontSize.9xl),_var(--font-size))]/none">Issue 239</span><span class="text-7xl/10">Issue 239</span></p>`,
    ].map((testedNgCode) => ({
      code: testedNgCode,
      options: [
        {
          whitelist: [
            "whitelisted",
            "js-[a-z0-9-]+",
            "i-heroicons:chevron-up-solid",
          ],
        },
      ],
      languageOptions: withAngularParser,
    })),
    ...[
      // React
      `<h1 className={\`max-w-full \${isDone ? 'opacity-80 grayscale' : null}\`}>null</h1>`,
      // Issue 252
      `twJoin('h-full', selectedPickupPoint === pickupPoint && 'absolute')`,
      // Issue 291
      `ctl('first:absolute')`,
    ].map((jsx) => ({
      code: jsx,
    })),
    ...[
      // Issue 313
      `ctl('tw:flex tw:@container tw:@lg:hidden')`,
    ].map((jsx) => ({
      code: jsx,
      settings: { tailwindcss: { ...prefixedSettings } },
    })),
  ],
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
      code: `<h1 className={"last-child:mb-0"}>invalid modifier, Issue 305</h1>`,
      errors: [
        suggest(
          "last-child:mb-0",
          `<h1 className={""}>invalid modifier, Issue 305</h1>`,
        ),
      ],
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
    /*/
    {
      code: `<h1 className={\`rounded w-[\${width}] flex\`}>Issue 277</h1>`,
      errors: [suggest("unknown", `<h1 class="relative">Issue 277</h1>`)],
    },
    //*/
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
