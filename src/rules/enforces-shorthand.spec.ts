import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import {
  generalSettings,
  prefixedSettings,
  withAngularParser,
} from "../utils/parser/test-helpers";
import { enforcesShorthand, MessageIds, RULE_NAME } from "./enforces-shorthand";

const generateError = (
  targetLonghand: string,
  otherLonghands: Array<string>,
  shorthand: string,
): TestCaseError<MessageIds> => {
  const formattedOtherLonghands = otherLonghands
    .map((cls) => `'${cls}'`)
    .join(", ");
  return {
    messageId: "fix:use-shorthand",
    data: {
      targetLonghand,
      otherLonghands: formattedOtherLonghands,
      shorthand: shorthand,
    },
  };
};

const mapErrors = (many: Array<string>, single: string) =>
  many.map((value) =>
    generateError(
      value,
      many.filter((v) => v !== value),
      single,
    ),
  );

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
    `<h1 class="w-screen h-screen">There is no size-screen</h1>`,
    `<h1 class="rounded-b-xl rounded-tr-xl">Issue 327</h1>`,
    `<h1 class="w-full w-full">Issue 349</h1>`,
    `<h1 class="mt-2 !mb-2">Important</h1>`,
    `<h1 class="mt-2 mb-2!">Important</h1>`,
  ].map((testedNgCode) => ({
    code: testedNgCode,
    languageOptions: withAngularParser,
  })),
  invalid: [
    {
      code: `ctl("overflow-x-hidden overflow-y-hidden")`,
      errors: mapErrors(
        ["overflow-x-hidden", "overflow-y-hidden"],
        "overflow-hidden",
      ),
      output: `ctl("overflow-hidden")`,
    },
    {
      code: `ctl("overscroll-x-none overscroll-y-none")`,
      errors: mapErrors(
        ["overscroll-x-none", "overscroll-y-none"],
        "overscroll-none",
      ),
      output: `ctl("overscroll-none")`,
    },
    {
      code: `ctl("top-0 right-0 bottom-0")`,
      errors: mapErrors(["top-0", "bottom-0"], "inset-y-0"),
      output: `ctl("right-0 inset-y-0")`,
    },
    {
      code: `ctl("top-0 right-0 bottom-0 left-0")`,
      errors: [
        generateError("top-0", ["bottom-0"], "inset-y-0"),
        generateError("right-0", ["left-0"], "inset-x-0"),
        generateError("bottom-0", ["top-0"], "inset-y-0"),
        generateError("left-0", ["right-0"], "inset-x-0"),
      ],
      output: ['ctl("inset-x-0 inset-y-0")', 'ctl("inset-0")'],
    },
    {
      code: `ctl("inset-y-0 right-0 left-0")`,
      errors: mapErrors(["right-0", "left-0"], "inset-x-0"),
      output: [`ctl("inset-y-0 inset-x-0")`, `ctl("inset-0")`],
    },
    {
      code: `ctl("-inset-y-10 -inset-x-10")`,
      errors: mapErrors(["-inset-y-10", "-inset-x-10"], "-inset-10"),
      output: [`ctl("-inset-10")`],
    },
    {
      code: `ctl("-my-10 -mx-10")`,
      errors: mapErrors(["-my-10", "-mx-10"], "-m-10"),
      output: [`ctl("-m-10")`],
    },
    {
      code: `ctl("dark:-my-10 dark:-mx-10")`,
      errors: mapErrors(["dark:-my-10", "dark:-mx-10"], "dark:-m-10"),
      output: [`ctl("dark:-m-10")`],
    },
    {
      code: `ctl("gap-x-10 gap-y-10")`,
      errors: mapErrors(["gap-x-10", "gap-y-10"], "gap-10"),
      output: [`ctl("gap-10")`],
    },
    {
      code: `<h1 class="block md:-mx-10 md:-my-10">margin</h1>`,
      errors: mapErrors(["md:-mx-10", "md:-my-10"], "md:-m-10"),
      output: `<h1 class="block md:-m-10">margin</h1>`,
      languageOptions: withAngularParser,
    },
    {
      code: `<h1 class="md:pl-10 md:pr-10">padding</h1>`,
      errors: mapErrors(["md:pl-10", "md:pr-10"], "md:px-10"),
      output: `<h1 class="md:px-10">padding</h1>`,
      languageOptions: withAngularParser,
    },
    {
      code: `ctl("w-1/2 h-1/2")`,
      errors: mapErrors(["w-1/2", "h-1/2"], "size-1/2"),
      output: [`ctl("size-1/2")`],
    },
    {
      code: `ctl("debug overflow-hidden text-ellipsis whitespace-nowrap")`,
      errors: mapErrors(
        ["overflow-hidden", "text-ellipsis", "whitespace-nowrap"],
        "truncate",
      ),
      output: [`ctl("debug truncate")`],
    },
    {
      code: `ctl("rounded-bl-2xl rounded-br-2xl")`,
      errors: mapErrors(["rounded-bl-2xl", "rounded-br-2xl"], "rounded-b-2xl"),
      output: [`ctl("rounded-b-2xl")`],
    },
    {
      code: `ctl("rounded-ee-2xl rounded-es-2xl")`,
      errors: mapErrors(["rounded-ee-2xl", "rounded-es-2xl"], "rounded-b-2xl"),
      output: [`ctl("rounded-b-2xl")`],
    },
    {
      code: `ctl("border-t-1 border-b-1")`,
      errors: mapErrors(["border-t-1", "border-b-1"], "border-y-1"),
      output: [`ctl("border-y-1")`],
    },
    {
      code: `ctl("border-t border-b")`,
      errors: mapErrors(["border-t", "border-b"], "border-y"),
      output: [`ctl("border-y")`],
    },
    {
      code: `ctl("border-t border-b border-x")`,
      errors: mapErrors(["border-t", "border-b"], "border-y"),
      output: [`ctl("border-x border-y")`, `ctl("border")`],
    },
    {
      code: `ctl("border-spacing-x-20 border-spacing-y-20")`,
      errors: mapErrors(
        ["border-spacing-x-20", "border-spacing-y-20"],
        "border-spacing-20",
      ),
      output: [`ctl("border-spacing-20")`],
    },
    {
      code: `ctl("scale-x-150 scale-y-150")`,
      errors: mapErrors(["scale-x-150", "scale-y-150"], "scale-150"),
      output: [`ctl("scale-150")`],
    },
    {
      code: `ctl("skew-x-150 dark:-skew-x-100 dark:skew-y-100 skew-y-150")`,
      errors: mapErrors(["skew-x-150", "skew-y-150"], "skew-150"),
      output: [`ctl("dark:-skew-x-100 dark:skew-y-100 skew-150")`],
    },
    {
      code: `ctl("-translate-y-10 -translate-x-10")`,
      errors: mapErrors(
        ["-translate-y-10", "-translate-x-10"],
        "-translate-10",
      ),
      output: [`ctl("-translate-10")`],
    },
    {
      code: `ctl("scroll-pl-3 scroll-pr-3")`,
      errors: mapErrors(["scroll-pl-3", "scroll-pr-3"], "scroll-px-3"),
      output: [`ctl("scroll-px-3")`],
    },
    {
      code: `ctl(\`scroll-pr-3 scroll-pl-3 w-[\${width}]\`)`,
      errors: mapErrors(["scroll-pr-3", "scroll-pl-3"], "scroll-px-3"),
      output: [`ctl(\`scroll-px-3 w-[\${width}]\`)`],
    },
    {
      code: `ctl(\`tw:mt-2! tw:!mb-2\`)`,
      settings: { tailwindcss: { ...prefixedSettings } },
      errors: mapErrors(["tw:mt-2!", "tw:!mb-2"], "tw:my-2!"),
      output: [`ctl(\`tw:my-2!\`)`],
    },
    {
      code: `ctl(\`tw:!-mt-2 tw:!-mb-2\`)`,
      settings: { tailwindcss: { ...prefixedSettings } },
      errors: mapErrors(["tw:!-mt-2", "tw:!-mb-2"], "tw:-my-2!"),
      output: [`ctl(\`tw:-my-2!\`)`],
    },
    {
      code: `ctl(\`!w-7 !h-7\`)`,
      errors: mapErrors(["!w-7", "!h-7"], "size-7!"),
      output: [`ctl(\`size-7!\`)`],
    },
    {
      // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/476
      code: `ctl(\`w-7! h-7!\`)`,
      errors: mapErrors(["w-7!", "h-7!"], "size-7!"),
      output: [`ctl(\`size-7!\`)`],
    },
    {
      // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/476
      code: `ctl(\`!w-7 h-7!\`)`,
      errors: mapErrors(["!w-7", "h-7!"], "size-7!"),
      output: [`ctl(\`size-7!\`)`],
    },
  ],
});
