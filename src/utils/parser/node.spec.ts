import { TSESTree } from "@typescript-eslint/utils";
import { expect, test } from "vitest";

import {
  getClassnamesFromValue,
  getJSXAttributeName,
  getRangeFromNode,
  getTagNameFromTaggedTemplateExpression,
  getTemplateElementAffixes,
  getValueFromNodeAtom,
  getVAttributeName,
} from "./node";
import {
  getFirstHTMLOpeningElement,
  getFirstJSXOpeningElement,
  getHTMLAttribute,
  getJSXAttribute,
  htmlAttribute,
  jsxAttribute,
  vAttribute,
} from "./test-helpers";

test("getValueFromNodeAtom", () => {
  [
    // No value
    [htmlAttribute(`<h1 class>html</h1>`), ""],
    // Normal case: "TextAttribute" via AngularParser (HTML)
    [htmlAttribute(`<h1 class="flex">html</h1>`), "flex"],
    // JSXLiteral
    [jsxAttribute(`<h1 class="m-0 flex">jsx</h1>`), "m-0 flex"],
    // JSXExpressionContainer
    [jsxAttribute(`<h1 className={'block'}>jsx</h1>`), "block"],
  ].map(([input, expected]) => {
    // @ts-expect-error Argument of type 'string | TextAttribute' is not assignable to parameter of type 'ValueSupportedNode'.
    expect(getValueFromNodeAtom(input)).toBe(expected);
  });
});

test("getClassnamesFromValue", () => {
  expect(getClassnamesFromValue(`flex grow`)).toStrictEqual({
    classNames: ["flex", "grow"],
    whitespaces: [" "],
    headSpace: false,
    tailSpace: false,
  });
  expect(getClassnamesFromValue(` flex  grow`)).toStrictEqual({
    classNames: ["flex", "grow"],
    whitespaces: [" ", "  "],
    headSpace: true,
    tailSpace: false,
  });
  expect(getClassnamesFromValue(` flex  grow   `)).toStrictEqual({
    classNames: ["flex", "grow"],
    whitespaces: [" ", "  ", "   "],
    headSpace: true,
    tailSpace: true,
  });
  expect(getClassnamesFromValue(`flex  grow   `)).toStrictEqual({
    classNames: ["flex", "grow"],
    whitespaces: ["  ", "   "],
    headSpace: false,
    tailSpace: true,
  });
});

test("getRangeFromNode", () => {
  // No value
  const emptyHtml = getFirstHTMLOpeningElement(`<h1 hidden>html</h1>`);
  const emptyAttribute = getHTMLAttribute(emptyHtml);
  expect(getRangeFromNode(emptyAttribute)).toStrictEqual([0, 0]);
  // Normal case: "TextAttribute" via AngularParser (HTML)
  const simpleHtml = getFirstHTMLOpeningElement(`<h1 class="flex">html</h1>`);
  const textAttribute = getHTMLAttribute(simpleHtml);
  expect(getRangeFromNode(textAttribute)).toStrictEqual([
    `<h1 class="`.length,
    `<h1 class="flex`.length,
  ]);
  // JSX attribute
  const jsx = getFirstJSXOpeningElement(`<h1 class={'flex'}>html</h1>`);
  const jsxAttribute = getJSXAttribute(jsx);
  expect(getRangeFromNode(jsxAttribute)).toStrictEqual([
    `<h1 class={`.length,
    `<h1 class={'flex'`.length,
  ]);
  // default
  const defaultJsx = getFirstJSXOpeningElement(`<h1 class="flex">html</h1>`);
  const defaultJsxAttribute = getJSXAttribute(defaultJsx);
  expect(getRangeFromNode(defaultJsxAttribute)).toStrictEqual([
    `<h1 class=`.length,
    `<h1 class="flex'`.length,
  ]);
});

test("getTemplateElementAffixes", () => {
  expect(
    getTemplateElementAffixes("`relative grid`", "relative grid")
  ).toStrictEqual(["`", "`"]);
  expect(getTemplateElementAffixes("`absolute ${", "absolute ")).toStrictEqual([
    "`",
    "${",
  ]);
  expect(getTemplateElementAffixes("`} ${", " ")).toStrictEqual(["`}", "${"]);
});

test("getTagNameFromTaggedTemplateExpression", () => {
  const attribute = jsxAttribute("<h1 className={tw`flex`}>html</h1>");
  if (
    attribute.value?.type === TSESTree.AST_NODE_TYPES.JSXExpressionContainer &&
    attribute.value.expression.type ===
      TSESTree.AST_NODE_TYPES.TaggedTemplateExpression
  ) {
    expect(
      getTagNameFromTaggedTemplateExpression(attribute.value.expression)
    ).toStrictEqual("tw");
  } else {
    throw new Error(
      "Invalid attribute value for `getTagNameFromTaggedTemplateExpression`"
    );
  }
});

test("getJSXAttributeName", () => {
  [
    // JSXLiteral
    [jsxAttribute(`<h1 class="m-0 flex">jsx</h1>`), "class"],
    // JSXExpressionContainer
    [jsxAttribute(`<h1 className={'block'}>jsx</h1>`), "className"],
    // JSXNamespacedName
    [jsxAttribute(`<h1 ns:className={'block'}>jsx</h1>`), "ns:className"],
  ].map(([input, expected]) => {
    // @ts-expect-error Argument of type 'string | JSXAttribute' is not assignable to parameter of type 'JSXAttribute'.
    expect(getJSXAttributeName(input)).toBe(expected);
  });
});

test("getVAttributeName", () => {
  [
    // VIdentifier
    [`<h1 class="m-0 flex">jsx</h1>`, "class"],
    // VDirectiveKey
    [`<h1 v-bind:attr="{'block': true}">jsx</h1>`, "attr"],
    // VDirectiveKey
    [`<h1 :short="{'block': true}">jsx</h1>`, "short"],
  ].map(([templateCode, expected]) => {
    const input = vAttribute(`<template>${templateCode}</template>`);
    // @ts-expect-error Argument of type 'string | VAttribute' is not assignable to parameter of type 'VAttribute'.
    expect(getVAttributeName(input)).toBe(expected);
  });
});
