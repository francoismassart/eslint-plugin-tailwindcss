import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";
import { expect, test } from "vitest";

import {
  generalSettings,
  prefixedSettings,
  withVueParser,
} from "../utils/parser/test-helpers";
import {
  enforcesCssVariableShorthand,
  type MessageIds,
  RULE_NAME,
  toCssVariableShorthand,
} from "./enforces-css-variable-shorthand";

const generateError = (
  className: string,
  patchedClassName: string,
): TestCaseError<MessageIds> => {
  return {
    messageId: "issue:css-variable-shorthand",
    data: { className, patchedClassName },
  };
};

test(`toCssVariableShorthand`, () => {
  const cases: Array<[string, string | undefined]> = [
    ["border-[--pattern-fg]", "border-(--pattern-fg)"],
    ["hover:border-[--a]!", "hover:border-(--a)!"],
    ["!border-[--a]", "!border-(--a)"],
    ["-mt-[--gap]", "-mt-(--gap)"],
    ["bg-[--x,red]", "bg-(--x,red)"],
    ["bg-[--x,var(--y)]", "bg-(--x,var(--y))"],
    ["text-[length:--size]", "text-(length:--size)"],
    ["bg-[--x]/50", "bg-(--x)/50"],
    ["tw:md:w-[--w]", "tw:md:w-(--w)"],
    ["border-(--pattern-fg)", undefined],
    ["bg-[var(--x)]", undefined],
    ["[--x:1px]", undefined],
    ["max-[--bp]:flex", undefined],
    ["w-[10px]", undefined],
    ["bg-[#fff]", undefined],
    ["flex", undefined],
  ];

  expect(cases.map(([className]) => toCssVariableShorthand(className))).toEqual(
    cases.map(([, expected]) => expected),
  );
});

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

ruleTester.run(RULE_NAME, enforcesCssVariableShorthand, {
  valid: [
    "ctl('border-(--pattern-fg)')",
    // Left to `enforces-canonical-classname`
    "ctl('bg-[var(--x)]')",
    "ctl('[--x:1px]')",
    "ctl('max-[--bp]:flex')",
    "ctl('w-[10px] bg-[#fff]')",
    // The edges of a template literal may be fragments of a "dynamic" classname
    "ctl(`border-[--${x}] flex`)",
    "ctl('')",
  ].map((code) => ({ code })),
  invalid: [
    ...[
      {
        // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/304
        code: `<div className="border-[--pattern-fg]" />`,
        className: "border-[--pattern-fg]",
        patchedClassName: "border-(--pattern-fg)",
        output: `<div className="border-(--pattern-fg)" />`,
      },
      {
        code: `ctl('hover:border-[--a]!')`,
        className: "hover:border-[--a]!",
        patchedClassName: "hover:border-(--a)!",
        output: `ctl('hover:border-(--a)!')`,
      },
      {
        code: `ctl('!border-[--a]')`,
        className: "!border-[--a]",
        patchedClassName: "!border-(--a)",
        output: `ctl('!border-(--a)')`,
      },
      {
        code: `ctl('-mt-[--gap]')`,
        className: "-mt-[--gap]",
        patchedClassName: "-mt-(--gap)",
        output: `ctl('-mt-(--gap)')`,
      },
      {
        code: `ctl('bg-[--x,red]')`,
        className: "bg-[--x,red]",
        patchedClassName: "bg-(--x,red)",
        output: `ctl('bg-(--x,red)')`,
      },
      {
        code: `ctl('text-[length:--size]')`,
        className: "text-[length:--size]",
        patchedClassName: "text-(length:--size)",
        output: `ctl('text-(length:--size)')`,
      },
      {
        code: `ctl('bg-[--x]/50')`,
        className: "bg-[--x]/50",
        patchedClassName: "bg-(--x)/50",
        output: `ctl('bg-(--x)/50')`,
      },
    ].map(({ code, className, patchedClassName, output }) => ({
      code,
      output,
      errors: [generateError(className, patchedClassName)],
    })),
    {
      // One report per classname, the others are untouched
      code: `ctl('flex border-[--a] p-4 bg-[--b]')`,
      output: [
        `ctl('flex border-(--a) p-4 bg-[--b]')`,
        `ctl('flex border-(--a) p-4 bg-(--b)')`,
      ],
      errors: [
        generateError("border-[--a]", "border-(--a)"),
        generateError("bg-[--b]", "bg-(--b)"),
      ],
    },
    {
      // Whitespaces of a multiline template literal survive the fix
      code: `
      ctl(\`
        border-[--pattern-fg]
        dark:bg-white
      \`)`,
      output: `
      ctl(\`
        border-(--pattern-fg)
        dark:bg-white
      \`)`,
      errors: [generateError("border-[--pattern-fg]", "border-(--pattern-fg)")],
    },
    {
      code: `ctl('tw:border-[--a]')`,
      output: `ctl('tw:border-(--a)')`,
      errors: [generateError("tw:border-[--a]", "tw:border-(--a)")],
      settings: { tailwindcss: { ...prefixedSettings } },
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

vueRuleTester.run(`${RULE_NAME} (Vue SFC)`, enforcesCssVariableShorthand, {
  valid: [
    {
      filename: "test.vue",
      code: `<template><div class="border-(--a)" /></template>`,
    },
  ],
  invalid: [
    {
      filename: "test.vue",
      code: `<template><div class="border-[--a]" /></template>`,
      output: `<template><div class="border-(--a)" /></template>`,
      errors: [generateError("border-[--a]", "border-(--a)")],
    },
  ],
});
