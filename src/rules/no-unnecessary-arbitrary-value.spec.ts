import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import { joinListElements } from "../utils/list-formatter";
import {
  emptySettings,
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
    suggestions: presetClasses.slice(1).map((cls, index) => {
      return {
        messageId: "fix:unnecessary-arbitrary",
        data: {
          arbitraryClass,
          presetClass: cls,
        },
        output: output[index + 1],
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
    tailwindcss: {
      ...withAllPresetsSettings,
    },
  },
});

ruleTester.run(RULE_NAME, noUnnecessaryArbitraryValue, {
  valid:
    // JSX
    [
      // Not an arbitrary value
      {
        code: "ctl('m-0')",
        settings: { tailwindcss: withAllPresetsSettings },
      },
      // Not an existing preset
      {
        code: "ctl('m-[calc(123456789px)]')",
        settings: { tailwindcss: withAllPresetsSettings },
      },
      {
        code: `<div class="my-[3.14px] ml-1 mr-px">Issue #366</div>`,
        settings: { tailwindcss: withAllPresetsSettings },
      },
      // `leading-1.125` is not a valid Tailwind CSS v4 class (Issue #469).
      {
        code: `<div class="leading-[1.125]">Issue #469</div>`,
        settings: { tailwindcss: emptySettings },
      },
    ],
  invalid: [
    // Single errors + withAllPresetsSettings
    ...[
      {
        code: `ctl('aspect-[4/3]')`,
        invalidClass: "aspect-[4/3]",
        replacementClass: ["aspect-retro"],
        output: [`ctl('aspect-retro')`],
      },
      {
        code: `ctl(\`w-[\${width}] aspect-[4/3]\`)`,
        invalidClass: "aspect-[4/3]",
        replacementClass: ["aspect-retro"],
        output: [`ctl(\`w-[\${width}] aspect-retro\`)`],
      },
      {
        code: `ctl('aspect-[1/1]')`,
        invalidClass: "aspect-[1/1]",
        replacementClass: ["aspect-square", "aspect-one-to-one"],
        output: [`ctl('aspect-square')`, `ctl('aspect-one-to-one')`],
      },
      {
        code: `ctl('aspect-[1/1] w-[\${width}]')`,
        invalidClass: "aspect-[1/1]",
        replacementClass: ["aspect-square", "aspect-one-to-one"],
        output: [
          `ctl('aspect-square w-[\${width}]')`,
          `ctl('aspect-one-to-one w-[\${width}]')`,
        ],
      },
      {
        code: `<div class="mt-[1px] mb-1">Issue #366</div>`,
        invalidClass: "mt-[1px]",
        replacementClass: ["mt-px", "mt-1px-margin", "mt-1"],
        output: [
          `<div class="mt-px mb-1">Issue #366</div>`,
          `<div class="mt-1px-margin mb-1">Issue #366</div>`,
          `<div class="mt-1 mb-1">Issue #366</div>`,
        ],
      },

      {
        // Issue #366 Existing preset (exact match)
        code: "ctl('mr-[8rem]')",
        invalidClass: "mr-[8rem]",
        replacementClass: [
          // "mr-[8rem]",
          "mr-huge",
          "mr-128",
        ],
        output: [`ctl('mr-huge')`, `ctl('mr-128')`],
      },
      {
        // Issue #366 Unitless value positive
        code: "ctl('sm:z-[1]')",
        invalidClass: "sm:z-[1]",
        replacementClass: ["sm:z-1"],
        output: ["ctl('sm:z-1')"],
      },
      {
        // Issue #366 Unitless negative value
        code: "ctl('md:z-[-2]')",
        invalidClass: "md:z-[-2]",
        replacementClass: ["md:-z-2"],
        output: ["ctl('md:-z-2')"],
      },
      {
        // Issue #366 Unitless double negative
        code: "ctl('lg:dark:-z-[-2]')",
        invalidClass: "lg:dark:-z-[-2]",
        replacementClass: ["lg:dark:z-2"],
        output: ["ctl('lg:dark:z-2')"],
      },
      {
        // Issue #366 px native preset
        code: "ctl('my-[1px]')",
        invalidClass: "my-[1px]",
        // From weakest to strongest
        // my-px, (my-[1px]), my-1px-margin, my-1
        replacementClass: [
          "my-px",
          // "my-[1px]",
          "my-1px-margin",
          "my-1",
        ],
        output: ["ctl('my-px')", "ctl('my-1px-margin')", "ctl('my-1')"],
      },
      {
        // Issue #366 px native preset
        code: "ctl('dark:my-[1px]')",
        invalidClass: "dark:my-[1px]",
        replacementClass: [
          "dark:my-px",
          // "dark:my-[1px]",
          "dark:my-1px-margin",
          "dark:my-1",
        ],
        output: [
          "ctl('dark:my-px')",
          "ctl('dark:my-1px-margin')",
          "ctl('dark:my-1')",
        ],
      },
      {
        // Issue #366 negative px native preset
        code: "ctl('dark:my-[-1px]')",
        invalidClass: "dark:my-[-1px]",
        replacementClass: [
          "dark:-my-px",
          // "dark:my-[-1px]",
          "dark:-my-1px-margin",
          "dark:-my-1",
        ],
        output: [
          "ctl('dark:-my-px')",
          "ctl('dark:-my-1px-margin')",
          "ctl('dark:-my-1')",
        ],
      },
      {
        // Issue #366 double negative px native preset
        code: "ctl('-my-[-1px]')",
        invalidClass: "-my-[-1px]",
        replacementClass: ["my-px", "my-1px-margin", "my-1"],
        output: ["ctl('my-px')", "ctl('my-1px-margin')", "ctl('my-1')"],
      },
      {
        // Issue #366 spacing based value
        code: "ctl('my-[2px]')",
        invalidClass: "my-[2px]",
        replacementClass: ["my-2"],
        output: ["ctl('my-2')"],
      },
      {
        // Issue #366 important! spacing based value
        code: "ctl('my-[2px]!')",
        invalidClass: "my-[2px]!",
        replacementClass: ["my-2!"],
        output: ["ctl('my-2!')"],
      },
      {
        // Issue #366 !important spacing based value
        code: "ctl('!my-[2px]')",
        invalidClass: "!my-[2px]",
        replacementClass: ["my-2!"],
        output: ["ctl('my-2!')"],
      },
      {
        // Issue #366 Unitless value positive (w/o config)
        code: "ctl('z-[0]')",
        invalidClass: "z-[0]",
        replacementClass: ["z-0"],
        output: ["ctl('z-0')"],
      },
    ].map(({ code, invalidClass, replacementClass, output }) => ({
      code: code,
      settings: { tailwindcss: withAllPresetsSettings },
      output: output[0],
      errors: [suggest(invalidClass, replacementClass, output)],
    })),

    // Multiple unnecessary arbitrary values in the same className attribute
    {
      code: `
      ctl(\`
        lg:columns-[16rem]
        aspect-auto
        -top-[3.14px]
      \`)`,
      settings: { tailwindcss: withAllPresetsSettings },
      output: [
        `
      ctl(\`
        lg:columns-side-menu
        aspect-auto
        -top-[3.14px]
      \`)`,
        `
      ctl(\`
        lg:columns-side-menu
        aspect-auto
        -top-pi
      \`)`,
      ],
      errors: [
        suggest("lg:columns-[16rem]", ["lg:columns-side-menu"], [""]),
        suggest("-top-[3.14px]", ["-top-pi"], [""]),
      ],
    },
  ],
});
