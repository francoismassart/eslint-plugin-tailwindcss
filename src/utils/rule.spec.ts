import { parse } from "@typescript-eslint/parser";
import { TSESTree } from "@typescript-eslint/utils";
import { describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS, type PluginSettings } from "./parse-plugin-settings";
import { getLiteralsFromNode } from "./rule";

const mockSettings: PluginSettings = { ...DEFAULT_SETTINGS };
const mockContext = {};

const astParserOptions = {
  comment: false,
  loc: false,
  range: false,
  tokens: false,
};

const astWithJSXOptions = {
  ...astParserOptions,
  jsx: true,
};

/**
 * @example `<h1 className={`rounded w-[${width}] flex`}>Issue 277</h1>`
 */
const getClassNameJSXAttributeNode = (ast: TSESTree.Program) => {
  return (
    (ast.body[0] as TSESTree.ExpressionStatement)
      .expression as TSESTree.JSXElement
  ).openingElement.attributes.find(
    (attribute) =>
      attribute.type === "JSXAttribute" &&
      attribute.name.type === "JSXIdentifier" &&
      attribute.name.name === "className",
  ) as TSESTree.JSXAttribute;
};

/**
 * @example `clsx('foo')`
 */
const getCallExpressionNode = (ast: TSESTree.Program) => {
  return (ast.body[0] as TSESTree.ExpressionStatement)
    .expression as TSESTree.CallExpression;
};

/**
 * @example `"Hello"`
 */
const getExpressionNode = (ast: TSESTree.Program) => {
  return (ast.body[0] as TSESTree.ExpressionStatement).expression;
};

/**
 * @example `const a = { key1: 'value1' };`
 */
const getObjectExpressionNode = (ast: TSESTree.Program) => {
  return (ast.body[0] as TSESTree.VariableDeclaration).declarations[0]
    .init as TSESTree.ObjectExpression;
};

describe("getLiteralsFromNode", () => {
  describe("Without any library", () => {
    it("should extract a simple single Literal node", () => {
      const ast = parse(`"hello"`, astParserOptions);
      const node = getExpressionNode(ast);
      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);

      expect(result).toMatchObject([{ type: "Literal", value: "hello" }]);
    });
    it("should extract the literal from both the consequent and the alternate", () => {
      const ast = parse(`true ? 'truthy' : 'falsy'`, astParserOptions);
      const node = getCallExpressionNode(ast);

      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);
      expect(result).toMatchObject([{ value: "truthy" }, { value: "falsy" }]);
    });
    it("should extract the values from a standard object", () => {
      const ast = parse(`const a = { key1: 'value1' };`, astParserOptions);
      const node = getObjectExpressionNode(ast);

      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);
      expect(result.length).toBe(1);
    });
  });

  describe("Using `classNames`", () => {
    it("Strings (variadic): `classNames('foo', true && 'bar');`", () => {
      const ast = parse(`classnames('foo', true && 'bar');`, astParserOptions);
      const node = getCallExpressionNode(ast);

      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);
      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({
        type: "Literal",
        value: "foo",
      });
      expect(result[1]).toMatchObject({
        type: "Literal",
        value: "bar",
      });
    });
    it("Objects: `classNames({'unknown-class':true});`", () => {
      const ast = parse(
        `classnames({'unknown-class':true});`,
        astParserOptions,
      );
      const node = getCallExpressionNode(ast);

      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);
      expect(result.length).toBe(1);
      expect(result[0]).toMatchObject({
        type: "Literal",
        value: "unknown-class",
      });
    });
    it("Multiple objects: `classNames({ 'foo': true }, { bar: true });`", () => {
      const ast = parse(
        `classnames({ 'foo': true }, { bar: true });`,
        astParserOptions,
      );
      const node = getCallExpressionNode(ast);

      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);
      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({
        type: "Literal",
        value: "foo",
      });
      expect(result[1]).toMatchObject({
        type: "Identifier",
        name: "bar",
      });
    });
    it("Multiple properties: `classNames({ foo: true, bar: true });`", () => {
      const ast = parse(
        `classNames({ foo: true, bar: true });`,
        astParserOptions,
      );
      const node = getCallExpressionNode(ast);

      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);
      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({
        type: "Identifier",
        name: "foo",
      });
      expect(result[1]).toMatchObject({
        type: "Identifier",
        name: "bar",
      });
    });
    it("Kitchenshink: `classNames('foo', { bar: true, duck: false }, 'baz', { quux: true });`", () => {
      const ast = parse(
        `classNames('foo', { bar: true, duck: false }, 'baz', { quux: true });`,
        astParserOptions,
      );
      const node = getCallExpressionNode(ast);

      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);
      expect(result.length).toBe(5);
      expect(result[0]).toMatchObject({
        type: "Literal",
        value: "foo",
      });
      expect(result[1]).toMatchObject({
        type: "Identifier",
        name: "bar",
      });
      expect(result[2]).toMatchObject({
        type: "Identifier",
        name: "duck",
      });
      expect(result[3]).toMatchObject({
        type: "Literal",
        value: "baz",
      });
      expect(result[4]).toMatchObject({
        type: "Identifier",
        name: "quux",
      });
    });
    it("TemplateLiteral: ignore Identifier in expression", () => {
      const ast = parse(
        `<h1 className={\`rounded w-[\${width}] flex\`}>See issue 277</h1>`,
        astWithJSXOptions,
      );

      const node = getClassNameJSXAttributeNode(ast);

      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);
      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({
        type: "TemplateElement",
        tail: false,
        value: {
          cooked: "rounded w-[",
          raw: "rounded w-[",
        },
      });
      expect(result[1]).toMatchObject({
        type: "TemplateElement",
        tail: true,
        value: {
          cooked: "] flex",
          raw: "] flex",
        },
      });
    });
  });

  describe("Using `clsx`", () => {
    it("Strings (variadic): `clsx('foo', true && 'bar', 'baz');`", () => {
      const code = `clsx('foo', true && 'bar', 'baz');`;
      const ast = parse(code, astParserOptions);
      const node = getCallExpressionNode(ast);
      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);

      expect(result.length).toBe(3);
      expect(result[0]).toMatchObject({ type: "Literal", value: "foo" });
      expect(result[1]).toMatchObject({ type: "Literal", value: "bar" });
      expect(result[2]).toMatchObject({ type: "Literal", value: "baz" });
    });
    it("Objects: `clsx({ foo:true, bar:false, baz:isTrue() });`", () => {
      const code = `clsx({ foo:true, bar:false, baz:isTrue() });`;
      const ast = parse(code, astParserOptions);
      const node = getCallExpressionNode(ast);
      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);

      expect(result.length).toBe(3);
      expect(result[0]).toMatchObject({ type: "Identifier", name: "foo" });
      expect(result[1]).toMatchObject({ type: "Identifier", name: "bar" });
      expect(result[2]).toMatchObject({ type: "Identifier", name: "baz" });
    });
    it("Objects (variadic): `clsx({ foo:true }, { bar:false }, null, { '--foobar':'hello' });`", () => {
      const code = `clsx({ foo:true }, { bar:false }, null, { '--foobar':'hello' });`;
      const ast = parse(code, astParserOptions);
      const node = getCallExpressionNode(ast);
      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);

      expect(result.length).toBe(3);
      expect(result[0]).toMatchObject({ type: "Identifier", name: "foo" });
      expect(result[1]).toMatchObject({ type: "Identifier", name: "bar" });
      expect(result[2]).toMatchObject({ type: "Literal", value: "--foobar" });
    });
    it("Arrays: `clsx(['foo', 0, false, 'bar']);`", () => {
      const code = `clsx(['foo', 0, false, 'bar']);`;
      const ast = parse(code, astParserOptions);
      const node = getCallExpressionNode(ast);
      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);

      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({ type: "Literal", value: "foo" });
      expect(result[1]).toMatchObject({ type: "Literal", value: "bar" });
    });
    it("Arrays (variadic): `clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]]);`", () => {
      const code = `clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]]);`;
      const ast = parse(code, astParserOptions);
      const node = getCallExpressionNode(ast);
      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);

      expect(result.length).toBe(5);
      expect(result[0]).toMatchObject({ type: "Literal", value: "foo" });
      expect(result[1]).toMatchObject({ type: "Literal", value: "bar" });
      expect(result[2]).toMatchObject({ type: "Literal", value: "baz" });
      expect(result[3]).toMatchObject({ type: "Literal", value: "hello" });
      expect(result[4]).toMatchObject({ type: "Literal", value: "there" });
    });
    it("Kitchen sink (with nesting): `clsx('foo', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya');`", () => {
      const code = `clsx('foo', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya');`;
      const ast = parse(code, astParserOptions);
      const node = getCallExpressionNode(ast);
      const result = getLiteralsFromNode(mockSettings, mockContext, node, node);

      expect(result.length).toBe(7);
      expect(result[0]).toMatchObject({ type: "Literal", value: "foo" });
      expect(result[1]).toMatchObject({ type: "Literal", value: "bar" });
      expect(result[2]).toMatchObject({ type: "Identifier", name: "baz" });
      expect(result[3]).toMatchObject({ type: "Identifier", name: "bat" });
      expect(result[4]).toMatchObject({ type: "Literal", value: "hello" });
      expect(result[5]).toMatchObject({ type: "Literal", value: "world" });
      expect(result[6]).toMatchObject({ type: "Literal", value: "cya" });
    });
  });

  // it("should filter object properties if `targetKeys` is provided", () => {});
  /*/
  const result = getLiteralsFromNode(
    mockSettings,
    mockContext,
    node,
    node,
    0,
    ["targetKey"],
  );
  expect(result).toMatchObject([{ value: "targetValue" }]);
  //*/
});
