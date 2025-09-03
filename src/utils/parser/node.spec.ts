import { TSESTree } from "@typescript-eslint/utils";
import { expect, test } from "vitest";

import {
  getClassnamesFromValue,
  getJSXAttributeName,
  getTagNameFromTaggedTemplateExpression,
  getTemplateElementAffixes,
  getVAttributeName,
} from "./node.js";
import { _jsxAttribute, _vAttribute } from "./test-helpers.js";

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
  const attribute = _jsxAttribute("<h1 className={tw`flex`}>html</h1>");
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
    [_jsxAttribute(`<h1 class="m-0 flex">jsx</h1>`), "class"],
    // JSXExpressionContainer
    [_jsxAttribute(`<h1 className={'block'}>jsx</h1>`), "className"],
    // JSXNamespacedName
    [_jsxAttribute(`<h1 ns:className={'block'}>jsx</h1>`), "ns:className"],
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
    const input = _vAttribute(`<template>${templateCode}</template>`);
    // @ts-expect-error Argument of type 'string | VAttribute' is not assignable to parameter of type 'VAttribute'.
    expect(getVAttributeName(input)).toBe(expected);
  });
});
