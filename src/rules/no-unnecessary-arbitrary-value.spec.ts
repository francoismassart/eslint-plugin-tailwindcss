import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import { joinListElements } from "../utils/list-formatter";
import { withAllPresetsSettings } from "../utils/parser/test-helpers";
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
      "ctl('m-0')",
      // Not an existing preset
      "ctl('m-[calc(123456789px)]')",
    ].map((testedJsxCode) => ({
      code: testedJsxCode,
      settings: { tailwindcss: withAllPresetsSettings },
    })),
  invalid: [
    // Single errors
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
      /*/
      {
        code: `<div class="mt-[1px] mr-[0.25rem] mb-1">Issue #366</div>`,
        invalidClass: "mt-[1px]",
        replacementClass: ["mt-1"],
        output: [`<div class="mt-1 mr-[0.25rem] mb-1">Issue #366</div>`],
      },
      //*/
    ].map(({ code, invalidClass, replacementClass, output }) => ({
      code: code,
      settings: { tailwindcss: withAllPresetsSettings },
      errors: [suggest(invalidClass, replacementClass, output)],
    })),
    // Multiple unnecessary arbitrary values in the same className attribute
    ...[
      {
        code: `
        ctl(\`
          lg:columns-[16rem]
          aspect-auto
          -top-[3.14px]
        \`)`,
        invalidClasses: ["lg:columns-[16rem]", "-top-[3.14px]"],
        replacementClasses: [["lg:columns-side-menu"], ["-top-pi"]],
        output: [
          [
            `
        ctl(\`
          lg:columns-side-menu
          aspect-auto
          -top-[3.14px]
        \`)`,
          ],
          [
            `
        ctl(\`
          lg:columns-[16rem]
          aspect-auto
          -top-pi
        \`)`,
          ],
        ],
      },
    ].map(({ code, invalidClasses, replacementClasses, output }) => {
      return {
        code: code,
        settings: { tailwindcss: withAllPresetsSettings },
        errors: invalidClasses.map((invalidClass, index) =>
          suggest(invalidClass, replacementClasses[index], output[index]),
        ),
      };
    }),
  ],
});
