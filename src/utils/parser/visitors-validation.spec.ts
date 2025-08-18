import { TSESTree } from "@typescript-eslint/utils";
import { expect, test } from "vitest";

import { parsePluginSettings, PluginSettings } from "../parse-plugin-settings";
import {
  callExpression,
  htmlAttribute,
  jsxAttribute,
  vAttribute,
} from "./test-helpers";
import {
  isLiteralAttributeValue,
  isValidCallExpression,
  isValidExpressionAttributeValue,
  isValidJSXAttribute,
  isValidTextAttribute,
  isValidVAttribute,
} from "./visitors-validation";

const defaultSettings = parsePluginSettings({});
const customAttributeSettings = parsePluginSettings({
  tailwindcss: { attributes: ["custom"] },
});
const customFunctionSettings = parsePluginSettings({
  tailwindcss: { functions: ["custom"] },
});
const noAttributeSettings = parsePluginSettings({
  tailwindcss: { attributes: [] },
});
const noFunctionSettings = parsePluginSettings({
  tailwindcss: { functions: [] },
});

test("isValidJSXAttribute", () => {
  type TestConfig = [string, PluginSettings];
  // Valid expressions
  const valid: Array<TestConfig> = [
    // Defaults
    [`<p class={'value'}>p</p>`, defaultSettings],
    [`<p className={'value'}>p</p>`, defaultSettings],
    [`<p ngClass={'value'}>p</p>`, defaultSettings],
    // Custom
    [`<p custom={'value'}>p</p>`, customAttributeSettings],
  ];
  valid.map(([input, settings]) => {
    const node = jsxAttribute(input);
    expect(isValidJSXAttribute(node, settings)).toBe(true);
  });
});

test("isValidTextAttribute", () => {
  type TestConfig = [string, PluginSettings];
  // Valid expressions
  const valid: Array<TestConfig> = [
    // Defaults
    [`<p class="value">p</p>`, defaultSettings],
    [`<p className="value">p</p>`, defaultSettings],
    [`<p ngClass="value">p</p>`, defaultSettings],
    // Custom
    [`<p custom="value">p</p>`, customAttributeSettings],
  ];
  valid.map(([input, settings]) => {
    const node = htmlAttribute(input);
    expect(isValidTextAttribute(node, settings)).toBe(true);
  });
  // Invalid expressions
  const invalid: Array<TestConfig> = [
    // Defaults
    [`<p nope="value">p</p>`, defaultSettings],
    // Custom
    [`<p class="value">p</p>`, customAttributeSettings],
    // No attribute
    [`<p class="value">p</p>`, noAttributeSettings],
    [`<p className="value">p</p>`, noAttributeSettings],
  ];
  invalid.map(([input, settings]) => {
    const node = htmlAttribute(input);
    expect(isValidTextAttribute(node, settings)).toBe(false);
  });
});

test("isValidVAttribute", () => {
  type TestConfig = [string, PluginSettings];
  // Valid expressions
  const valid: Array<TestConfig> = [
    // Defaults
    [`<p :class="value">p</p>`, defaultSettings],
    [`<p :ngClass="value">p</p>`, defaultSettings],
    // Custom
    [`<p :custom="value">p</p>`, customAttributeSettings],
  ];
  valid.map(([input, settings]) => {
    const node = vAttribute(`<template>${input}</template>`);
    // @ts-expect-error Argument of type 'VAttribute | VDirective' is not assignable to parameter of type 'VAttribute'.
    expect(isValidVAttribute(node, settings)).toBe(true);
  });
  // Invalid expressions
  const invalid: Array<TestConfig> = [
    // Defaults
    [`<p nope="value">p</p>`, defaultSettings],
    [`<p :nope="['flex]">p</p>`, defaultSettings],
    // Custom
    [`<p :class="value">p</p>`, customAttributeSettings],
    // No attribute
    [`<p :class="value">p</p>`, noAttributeSettings],
    [`<p className="value">p</p>`, noAttributeSettings],
  ];
  invalid.map(([input, settings]) => {
    const node = vAttribute(`<template>${input}</template>`);
    // @ts-expect-error Argument of type 'VAttribute | VDirective' is not assignable to parameter of type 'VAttribute'.
    expect(isValidVAttribute(node, settings)).toBe(false);
  });
});

test("isValidCallExpression", () => {
  type TestConfig = [TSESTree.CallExpression, PluginSettings];
  // Valid expressions
  const valid: Array<TestConfig> = [
    // Defaults
    [callExpression(`ctl('flex')`), defaultSettings],
    [callExpression(`obj.ctl('flex')`), defaultSettings],
    // Custom
    [callExpression(`custom('flex')`), customFunctionSettings],
  ];
  valid.map(([input, settings]) => {
    expect(isValidCallExpression(input, settings)).toBe(true);
  });
  // Invalid expressions
  const invalid: Array<TestConfig> = [
    // Defaults
    [callExpression(`nope('flex')`), defaultSettings],
    [callExpression(`ctl.member('flex')`), defaultSettings],
    // Custom
    [callExpression(`ctl('flex')`), customFunctionSettings],
    // No function
    [callExpression(`ctl('flex')`), noFunctionSettings],
  ];
  invalid.map(([input, settings]) => {
    expect(isValidCallExpression(input, settings)).toBe(false);
  });
});

test("isLiteralAttributeValue", () => {
  // Valid expressions
  [
    // Normal case: "TextAttribute" via AngularParser (HTML)
    htmlAttribute(`<h1 class="flex">normal</h1>`),
    // Normal case (JSX)
    jsxAttribute(`<h1 className="flex">normal jsx</h1>`),
  ].map((input) => {
    expect(isLiteralAttributeValue(input)).toBe(true);
  });
  // Invalid expressions
  [
    // No value case via AngularParser (HTML)
    htmlAttribute(`<h1 hidden>no value</h1>`),
    // No value case (JSX)
    jsxAttribute(`<h1 hidden>hidden jsx</h1>`),
    // CallExpression (JSX)
    jsxAttribute(`<h1 class={ctl('flex')}>ctl</h1>`),
  ].map((input) => {
    expect(isLiteralAttributeValue(input)).toBe(false);
  });
});

test("isValidExpressionAttributeValue", () => {
  // Valid expressions
  [
    `<p class={'flex'}>p</p>`,
    "<p class={`flex`}>p</p>",
    "<p class={tw`flex`}>p</p>",
    "<p class={ctl('flex')}>p</p>",
  ].map((input) => {
    const validExpression = jsxAttribute(input);
    expect(isValidExpressionAttributeValue(validExpression)).toBe(true);
  });
  // Invalid expressions
  [
    // No value
    `<p className>p</p>`,
    // Unsupported type
    `<p class="static">p</p>`,
    // Empty expression
    `<p class={}>p</p>`,
  ].map((input) => {
    const invalidExpression = jsxAttribute(input);
    expect(isValidExpressionAttributeValue(invalidExpression)).toBe(false);
  });
});
