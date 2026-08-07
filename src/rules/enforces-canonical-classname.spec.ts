import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import { generalSettings, withVueParser } from "../utils/parser/test-helpers";
import {
  enforcesCanonicalClassname,
  type MessageIds,
  RULE_NAME,
} from "./enforces-canonical-classname";

const generateError = (
  className: string,
  patchedClassName: string,
): TestCaseError<MessageIds> => {
  return {
    messageId: "issue:non-canonical-classname",
    data: { className, patchedClassName },
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

ruleTester.run(RULE_NAME, enforcesCanonicalClassname, {
  valid: [
    "ctl('flex')",
    "ctl('*:flex-1 **:stroke-2')",
    "ctl('nth-[n+3]:hidden')",
    "ctl('bg-linear-to-r wrap-break-word')",
    "ctl('text-primary')",
    // Custom utility declared by "normal.css"
    "ctl('no-marker')",
    // Left to `no-custom-classname`
    "ctl('not-tailwind')",
    "ctl('')",
  ].map((code) => ({ code })),
  invalid: [
    ...[
      {
        code: `ctl('[&>*]:flex-1')`,
        className: "[&>*]:flex-1",
        patchedClassName: "*:flex-1",
        output: `ctl('*:flex-1')`,
      },
      {
        code: `ctl('[&:nth-child(n+3)]:hidden')`,
        className: "[&:nth-child(n+3)]:hidden",
        patchedClassName: "nth-[n+3]:hidden",
        output: `ctl('nth-[n+3]:hidden')`,
      },
      {
        code: `ctl('[transform:rotateY(180deg)]')`,
        className: "[transform:rotateY(180deg)]",
        patchedClassName: "transform-[rotateY(180deg)]",
        output: `ctl('transform-[rotateY(180deg)]')`,
      },
      {
        code: `ctl('bg-gradient-to-r')`,
        className: "bg-gradient-to-r",
        patchedClassName: "bg-linear-to-r",
        output: `ctl('bg-linear-to-r')`,
      },
      {
        // `--color-primary` is declared by "normal.css"
        code: `ctl('text-[#123456]')`,
        className: "text-[#123456]",
        patchedClassName: "text-primary",
        output: `ctl('text-primary')`,
      },
      {
        // Modifiers are preserved
        code: `ctl('lg:hover:-mt-[0.25em]')`,
        className: "lg:hover:-mt-[0.25em]",
        patchedClassName: "lg:hover:mt-[-0.25em]",
        output: `ctl('lg:hover:mt-[-0.25em]')`,
      },
    ].map(({ code, className, patchedClassName, output }) => ({
      code,
      output,
      errors: [generateError(className, patchedClassName)],
    })),
    {
      // One report per classname, the others are untouched
      code: `ctl('flex [&>*]:flex-1 p-4 break-words')`,
      output: [
        `ctl('flex *:flex-1 p-4 break-words')`,
        `ctl('flex *:flex-1 p-4 wrap-break-word')`,
      ],
      errors: [
        generateError("[&>*]:flex-1", "*:flex-1"),
        generateError("break-words", "wrap-break-word"),
      ],
    },
    {
      // Whitespaces of a multiline template literal survive the fix
      code: `
      ctl(\`
        [&_*]:stroke-2
        dark:bg-white
      \`)`,
      output: `
      ctl(\`
        **:stroke-2
        dark:bg-white
      \`)`,
      errors: [generateError("[&_*]:stroke-2", "**:stroke-2")],
    },
  ],
});

const vueRuleTester = new RuleTester({
  languageOptions: withVueParser,
  settings: {
    tailwindcss: {
      ...generalSettings,
    },
  },
});

vueRuleTester.run(`${RULE_NAME} (Vue SFC)`, enforcesCanonicalClassname, {
  valid: [{ filename: "test.vue", code: `<template><div class="*:flex-1" /></template>` }],
  invalid: [
    {
      filename: "test.vue",
      code: `<template><div class="[&>*]:flex-1" /></template>`,
      output: `<template><div class="*:flex-1" /></template>`,
      errors: [generateError("[&>*]:flex-1", "*:flex-1")],
    },
  ],
});
