import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import {
  generalSettings,
  withAngularParser,
} from "../utils/parser/test-helpers";
import { enforcesShorthand, MessageIds, RULE_NAME } from "./enforces-shorthand";

const generateError = (
  obsoleteClassnames: Array<string>,
  shorthand: string,
): TestCaseError<MessageIds> => {
  return {
    messageId: "fix:use-shorthand",
    data: {
      classnames: obsoleteClassnames.map((cls) => `'${cls}'`).join(", "),
      shorthand: shorthand,
    },
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

ruleTester.run(RULE_NAME, enforcesShorthand, {
  valid: [
    // Angular / Native HTML + static text
    `<h1 class="-mt- h-100 md:h-full">valid</h1>`,
    `<h1 class="w-full md:h-full">modifiers</h1>`,
  ].map((testedNgCode) => ({
    code: testedNgCode,
    languageOptions: withAngularParser,
  })),
  invalid: [
    {
      code: `ctl("overflow-x-hidden overflow-y-hidden")`,
      errors: [
        generateError(
          ["overflow-x-hidden", "overflow-y-hidden"],
          "overflow-hidden",
        ),
      ],
      output: `ctl("overflow-hidden")`,
    },
    {
      code: `ctl("overscroll-x-none overscroll-y-none")`,
      errors: [
        generateError(
          ["overscroll-x-none", "overscroll-y-none"],
          "overscroll-none",
        ),
      ],
      output: `ctl("overscroll-none")`,
    },
    {
      code: `ctl("top-0 right-0 bottom-0")`,
      errors: [generateError(["top-0", "bottom-0"], "inset-y-0")],
      output: `ctl("right-0 inset-y-0")`,
    },
    {
      code: `ctl("top-0 right-0 bottom-0 left-0")`,
      errors: [
        generateError(["right-0", "left-0"], "inset-x-0"),
        generateError(["top-0", "bottom-0"], "inset-y-0"),
      ],
      output: [
        `ctl("top-0 bottom-0 inset-x-0")`,
        `ctl("inset-x-0 inset-y-0")`,
        `ctl("inset-0")`,
      ],
    },
    {
      code: `ctl("inset-y-0 right-0 left-0")`,
      errors: [generateError(["right-0", "left-0"], "inset-x-0")],
      output: [`ctl("inset-y-0 inset-x-0")`, `ctl("inset-0")`],
    },
    {
      code: `ctl("-inset-y-10 -inset-x-10")`,
      errors: [generateError(["-inset-x-10", "-inset-y-10"], "-inset-10")],
      output: [`ctl("-inset-10")`],
    },
    {
      code: `ctl("-my-10 -mx-10")`,
      errors: [generateError(["-mx-10", "-my-10"], "-m-10")],
      output: [`ctl("-m-10")`],
    },
    {
      code: `ctl("dark:-my-10 dark:-mx-10")`,
      errors: [generateError(["dark:-mx-10", "dark:-my-10"], "dark:-m-10")],
      output: [`ctl("dark:-m-10")`],
    },
    {
      code: `ctl("gap-x-10 gap-y-10")`,
      errors: [generateError(["gap-x-10", "gap-y-10"], "gap-10")],
      output: [`ctl("gap-10")`],
    },
    {
      code: `<h1 class="block md:-mx-10 md:-my-10">margin</h1>`,
      errors: [generateError(["md:-mx-10", "md:-my-10"], "md:-m-10")],
      output: `<h1 class="block md:-m-10">margin</h1>`,
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 class="md:pl-10 md:pr-10">padding</h1>`,
      errors: [generateError(["md:pl-10", "md:pr-10"], "md:px-10")],
      output: `<h1 class="md:px-10">padding</h1>`,
      languageOptions: withAngularParser,
    },
    {
      code: `ctl("w-1/2 h-1/2")`,
      errors: [generateError(["w-1/2", "h-1/2"], "size-1/2")],
      output: [`ctl("size-1/2")`],
    },
    {
      code: `ctl("debug overflow-hidden text-ellipsis whitespace-nowrap")`,
      errors: [
        generateError(
          ["overflow-hidden", "text-ellipsis", "whitespace-nowrap"],
          "truncate",
        ),
      ],
      output: [`ctl("debug truncate")`],
    },
    {
      code: `ctl("rounded-bl-2xl rounded-br-2xl")`,
      errors: [
        generateError(["rounded-bl-2xl", "rounded-br-2xl"], "rounded-b-2xl"),
      ],
      output: [`ctl("rounded-b-2xl")`],
    },
    {
      code: `ctl("rounded-ee-2xl rounded-es-2xl")`,
      errors: [
        generateError(["rounded-ee-2xl", "rounded-es-2xl"], "rounded-b-2xl"),
      ],
      output: [`ctl("rounded-b-2xl")`],
    },
    {
      code: `ctl("border-t-1 border-b-1")`,
      errors: [generateError(["border-t-1", "border-b-1"], "border-y-1")],
      output: [`ctl("border-y-1")`],
    },
    {
      code: `ctl("border-t border-b")`,
      errors: [generateError(["border-t", "border-b"], "border-y")],
      output: [`ctl("border-y")`],
    },
    {
      code: `ctl("border-t border-b border-x")`,
      errors: [generateError(["border-t", "border-b"], "border-y")],
      output: [`ctl("border-x border-y")`, `ctl("border")`],
    },
    {
      code: `ctl("border-spacing-x-20 border-spacing-y-20")`,
      errors: [
        generateError(
          ["border-spacing-x-20", "border-spacing-y-20"],
          "border-spacing-20",
        ),
      ],
      output: [`ctl("border-spacing-20")`],
    },
    {
      code: `ctl("scale-x-150 scale-y-150")`,
      errors: [generateError(["scale-x-150", "scale-y-150"], "scale-150")],
      output: [`ctl("scale-150")`],
    },
    {
      code: `ctl("skew-x-150 dark:-skew-x-100 dark:skew-y-100 skew-y-150")`,
      errors: [generateError(["skew-x-150", "skew-y-150"], "skew-150")],
      output: [`ctl("dark:-skew-x-100 dark:skew-y-100 skew-150")`],
    },
    {
      code: `ctl("-translate-y-10 -translate-x-10")`,
      errors: [
        generateError(["-translate-x-10", "-translate-y-10"], "-translate-10"),
      ],
      output: [`ctl("-translate-10")`],
    },
  ],
});
