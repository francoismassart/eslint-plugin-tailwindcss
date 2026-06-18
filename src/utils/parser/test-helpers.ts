import * as AngularParser from "@angular-eslint/template-parser";
import * as Parser from "@typescript-eslint/parser";
import { TestLanguageOptions } from "@typescript-eslint/rule-tester";
import { TSESTree } from "@typescript-eslint/utils";
import * as VueParser from "vue-eslint-parser";
import { VStartTag } from "vue-eslint-parser/ast/index";

import { GenericElement, TextAttribute } from "../../types";
import { PluginSettings } from "../parse-plugin-settings";

// This file exposes utils only used during the tests

export const withJSX = {
  ecmaFeatures: { jsx: true },
};

export const withAngularParser: TestLanguageOptions = {
  parser: AngularParser,
};

export const withVueParser: TestLanguageOptions = {
  parser: VueParser,
};

export const generalSettings: PluginSettings = {
  cssConfigPath:
    // @ts-expect-error The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.ts(1470)
    `${import.meta.dirname}/../../../tests/stubs/css/normal.css`,
};

export const prefixedSettings: PluginSettings = {
  cssConfigPath:
    // @ts-expect-error The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.ts(1470)
    `${import.meta.dirname}/../../../tests/stubs/css/tiny-prefixed.css`,
};

export const daisySettings: PluginSettings = {
  cssConfigPath:
    // @ts-expect-error The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.ts(1470)
    `${import.meta.dirname}/../../../tests/stubs/css/daisy.css`,
};

export const xsBreakpointSettings: PluginSettings = {
  cssConfigPath:
    // @ts-expect-error The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.ts(1470)
    `${import.meta.dirname}/../../../tests/stubs/css/xs-breakpoint.css`,
};

export const withTypographySettings: PluginSettings = {
  cssConfigPath:
    // @ts-expect-error The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.ts(1470)
    `${import.meta.dirname}/../../../tests/stubs/css/with-typography.css`,
};

export const withAllPresetsSettings: PluginSettings = {
  cssConfigPath:
    // @ts-expect-error The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.ts(1470)
    `${import.meta.dirname}/../../../tests/stubs/css/all-presets.css`,
};

const getFirstHTMLOpeningElement = (code: string) => {
  const program = AngularParser.parse(code, { filePath: "node.spec.ts" });
  const node = program.templateNodes.at(0);
  if (node === undefined) {
    throw new Error("No TemplateNode found");
  }
  return node;
};

const getHTMLAttribute = (node: GenericElement): TextAttribute => {
  const htmlAttribute = node.attributes.at(0);
  if (htmlAttribute === undefined) {
    throw new Error("No HTMLAttribute found");
  }
  return htmlAttribute;
};

const getFirstJSXOpeningElement = (code: string) => {
  const program = Parser.parse(code, withJSX);
  const body = program.body.at(0);
  if (body === undefined) {
    throw new Error("No ProgramStatement found");
  }
  if (body.type !== TSESTree.AST_NODE_TYPES.ExpressionStatement) {
    throw new Error("No ExpressionStatement found");
  }
  if (body.expression.type !== TSESTree.AST_NODE_TYPES.JSXElement) {
    throw new Error("No JSXElement found");
  }
  return body.expression.openingElement;
};

const getJSXAttribute = (node: TSESTree.JSXOpeningElement) => {
  const jsxAttribute = node.attributes.at(0);
  if (jsxAttribute === undefined) throw new Error("No JSXAttribute found");
  if (jsxAttribute.type === TSESTree.AST_NODE_TYPES.JSXSpreadAttribute)
    throw new Error("Unsupported JSXSpreadAttribute found");
  return jsxAttribute;
};

const getFirstVOpeningElement = (code: string) => {
  const program = VueParser.parse(code, {});

  const body = program.templateBody?.children.at(0);
  if (body === undefined) {
    throw new Error("No ProgramStatement found");
  }
  if (body.type !== "VElement") {
    throw new Error("No VElement found");
  }
  return body.startTag;
};

const getVAttribute = (node: VStartTag) => {
  const vAttribute = node.attributes.at(0);
  if (vAttribute === undefined) throw new Error("No VAttribute found");
  return vAttribute;
};

export const _htmlAttribute = (code: string) => {
  const element = getFirstHTMLOpeningElement(code);
  return getHTMLAttribute(element);
};

export const _jsxAttribute = (code: string) => {
  const jsxElement = getFirstJSXOpeningElement(code);
  return getJSXAttribute(jsxElement);
};

export const _vAttribute = (code: string) => {
  const vElement = getFirstVOpeningElement(code);
  return getVAttribute(vElement);
};

export const _callExpression = (code: string) => {
  const program = Parser.parse(code, withJSX);
  const body = program.body.at(0);
  if (body === undefined) {
    throw new Error("No body found");
  }
  if (body.type !== TSESTree.AST_NODE_TYPES.ExpressionStatement) {
    throw new Error("No ExpressionStatement found");
  }
  if (body.expression.type !== TSESTree.AST_NODE_TYPES.CallExpression) {
    throw new Error("No CallExpression found");
  }
  return body.expression;
};
