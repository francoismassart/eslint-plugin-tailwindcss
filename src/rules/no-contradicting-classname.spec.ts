import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import {
  generalSettings,
  withAngularParser,
} from "../utils/parser/test-helpers";
import {
  type MessageIds,
  noContradictingClassname,
  RULE_NAME,
} from "./no-contradicting-classname";

const suggest = (
  keptClassname: string,
  output: string,
  removedClassnames: Array<string>,
): TestCaseError<MessageIds> => {
  return {
    messageId: "issue:contradiction",
    suggestions: [
      {
        messageId: "fix:contradiction:keep",
        data: {
          keepClassname: keptClassname,
          removeClassnames: removedClassnames.map((cn) => `'${cn}'`).join(", "),
        },
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

ruleTester.run(RULE_NAME, noContradictingClassname, {
  valid: [
    `<h1 class="flex no-marker">no-marker uses diplay property but only via ::pseudo selectors</h1>`,
    `<h1 class="absolute">single</h1>`,
    `<h1 class="absolute block">ok</h1>`,
    `<p class="break-words break-all">Some long text content</p>`,
    `<p class="font-sans font-[500]">Issue 209</p>`,
    // `<p class="transition-colors transition-transform">Issue 364</p>`,
  ].map((testedNgCode) => ({
    code: testedNgCode,
    languageOptions: withAngularParser,
  })),
  invalid: [
    {
      code: `<h1 class="w-10 w-20">≠ widths</h1>`,
      errors: [
        suggest("w-10", `<h1 class="w-10">≠ widths</h1>`, ["w-20"]),
        suggest("w-20", `<h1 class="w-20">≠ widths</h1>`, ["w-10"]),
      ],
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 class="block flex">display</h1>`,
      errors: [
        suggest("block", `<h1 class="block">display</h1>`, ["flex"]),
        suggest("flex", `<h1 class="flex">display</h1>`, ["block"]),
      ],
      languageOptions: withAngularParser,
    },
    {
      code: `<p class="font-[500] font-[400]">Issue 209</p>`,
      errors: [
        suggest("font-[500]", `<p class="font-[500]">Issue 209</p>`, [
          "font-[400]",
        ]),
        suggest("font-[400]", `<p class="font-[400]">Issue 209</p>`, [
          "font-[500]",
        ]),
      ],
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 class="block flex md:inline md:w-full md:w-0">display</h1>`,
      errors: [
        suggest(
          "block",
          `<h1 class="block md:inline md:w-full md:w-0">display</h1>`,
          ["flex"],
        ),
        suggest(
          "flex",
          `<h1 class="flex md:inline md:w-full md:w-0">display</h1>`,
          ["block"],
        ),
        suggest(
          "md:w-full",
          `<h1 class="block flex md:inline md:w-full">display</h1>`,
          ["md:w-0"],
        ),
        suggest(
          "md:w-0",
          `<h1 class="block flex md:inline md:w-0">display</h1>`,
          ["md:w-full"],
        ),
      ],
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 class="block w-10 absolute w-20 flex">2 conflicts</h1>`,
      errors: [
        suggest(
          "block",
          `<h1 class="block w-10 absolute w-20">2 conflicts</h1>`,
          ["flex"],
        ),
        suggest(
          "w-10",
          `<h1 class="block w-10 absolute flex">2 conflicts</h1>`,
          ["w-20"],
        ),
        suggest(
          "w-20",
          `<h1 class="block absolute w-20 flex">2 conflicts</h1>`,
          ["w-10"],
        ),
        suggest(
          "flex",
          `<h1 class="w-10 absolute w-20 flex">2 conflicts</h1>`,
          ["block"],
        ),
      ],
      languageOptions: withAngularParser,
    },
  ],
});
