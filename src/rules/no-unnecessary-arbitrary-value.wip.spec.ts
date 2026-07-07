import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import { joinListElements } from "../utils/list-formatter";
import {
  emptySettings,
  generalSettings,
  withAllPresetsSettings,
} from "../utils/parser/test-helpers";
import {
  type MessageIds,
  noUnnecessaryArbitraryValue,
  RULE_NAME,
} from "./no-unnecessary-arbitrary-value";

/**
 * @param arbitraryClass The class name with the arbitrary value that we want to replace
 * @param presetClasses The list of preset class names that can replace the arbitrary class
 * @param output The list of output strings corresponding to each preset class
 * @returns A TestCaseError object for the ESLint rule tester
 */
const suggest = (
  arbitraryClass: string, // e.g. "aspect-[4/3]"
  presetClasses: Array<string>, // e.g. ["aspect-square", "aspect-one-to-one"]
  output: Array<string>,
): TestCaseError<MessageIds> => {
  const quoted = presetClasses.map((cls) => `'${cls}'`);
  return {
    messageId: "issue:unnecessary-arbitrary",
    data: {
      arbitraryClass,
      presetClasses: joinListElements(quoted),
    },
    // e.g. "No need for arbitrary 'aspect-[1/1]', use 'aspect-square' or 'aspect-one-to-one' instead"
    suggestions: presetClasses.map((cls, index) => {
      return {
        messageId: "fix:unnecessary-arbitrary",
        data: {
          arbitraryClass,
          presetClass: cls,
        },
        output: output[index],
      };
    }),
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
    // tailwindcss: withAllPresetsSettings,
    tailwindcss: generalSettings,
  },
});

ruleTester.run(RULE_NAME, noUnnecessaryArbitraryValue, {
  valid: [
    {
      code: `<div class="my-[2px] ml-1 mr-px">Issue #366</div>`,
    },
  ],
  invalid: [
    {
      code: `<div class="z-[0]">Issue #366 Unitless value positive (w/o config)</div>`,
      settings: {
        tailwindcss: emptySettings,
      },
      invalidClass: "z-[0]",
      replacementClass: ["z-0"],
      output: [
        `<div class="z-0">Issue #366 Unitless value positive (w/o config)</div>`,
      ],
    },
    {
      code: `<div class="mr-[8rem]">Issue #366 Existing preset (exact match)</div>`,
      invalidClass: "mr-[8rem]",
      replacementClass: ["mr-huge"],
      output: [
        `<div class="mr-huge">Issue #366 Existing preset (exact match)</div>`,
      ],
    },
    {
      code: `<div class="sm:z-[1]">Issue #366 Unitless value positive</div>`,
      invalidClass: "sm:z-[1]",
      replacementClass: ["sm:z-1"],
      output: [`<div class="sm:z-1">Issue #366 Unitless value positive</div>`],
    },
    {
      code: `<div class="md:z-[-2]">Issue #366 Unitless negative value</div>`,
      invalidClass: "md:z-[-2]",
      replacementClass: ["md:-z-2"],
      output: [`<div class="md:-z-2">Issue #366 Unitless negative value</div>`],
    },
    {
      code: `<div class="lg:dark:-z-[-2]">Issue #366 Unitless double negative</div>`,
      invalidClass: "lg:dark:-z-[-2]",
      replacementClass: ["lg:dark:z-2"],
      output: [
        `<div class="lg:dark:z-2">Issue #366 Unitless double negative</div>`,
      ],
    },
    {
      code: `<div class="my-[1px]">Issue #366 px native preset</div>`,
      invalidClass: "my-[1px]",
      replacementClass: ["my-px"],
      output: [`<div class="my-px">Issue #366 px native preset</div>`],
    },
    {
      code: `<div class="dark:my-[1px]">Issue #366 px native preset</div>`,
      invalidClass: "dark:my-[1px]",
      replacementClass: ["dark:my-px"],
      output: [`<div class="dark:my-px">Issue #366 px native preset</div>`],
    },
    {
      code: `<div class="dark:my-[-1px]">Issue #366 negative px native preset</div>`,
      invalidClass: "dark:my-[-1px]",
      replacementClass: ["dark:-my-px"],
      output: [
        `<div class="dark:-my-px">Issue #366 negative px native preset</div>`,
      ],
    },
    {
      code: `<div class="-my-[-1px]">Issue #366 double negative px native preset</div>`,
      invalidClass: "-my-[-1px]",
      replacementClass: ["my-px"],
      output: [
        `<div class="my-px">Issue #366 double negative px native preset</div>`,
      ],
    },
    {
      // Spacing is 1px
      code: `<div class="my-[2px]">Issue #366 spacing based value</div>`,
      invalidClass: "my-[2px]",
      replacementClass: ["my-2"],
      output: [`<div class="my-2">Issue #366 spacing based value</div>`],
    },
  ].map(({ code, invalidClass, replacementClass, output }) => ({
    code: code,
    settings: { tailwindcss: withAllPresetsSettings },
    errors: [suggest(invalidClass, replacementClass, output)],
  })),
});
