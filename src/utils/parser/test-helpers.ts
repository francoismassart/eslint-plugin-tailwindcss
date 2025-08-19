import * as AngularParser from "@angular-eslint/template-parser";
import * as Parser from "@typescript-eslint/parser";
import { TSESTree } from "@typescript-eslint/utils";
import * as VueParser from "vue-eslint-parser";
import { VStartTag } from "vue-eslint-parser/ast/index";

import { GenericElement, TextAttribute } from "../../types";

// This file exposes utils only used during the tests

const withJSX = {
  ecmaFeatures: { jsx: true },
};

export const getFirstHTMLOpeningElement = (code: string) => {
  const program = AngularParser.parse(code, { filePath: "node.spec.ts" });
  const node = program.templateNodes.at(0);
  if (node === undefined) {
    throw new Error("No TemplateNode found");
  }
  return node;
};

export const getHTMLAttribute = (node: GenericElement): TextAttribute => {
  const htmlAttribute = node.attributes.at(0);
  if (htmlAttribute === undefined) {
    throw new Error("No HTMLAttribute found");
  }
  return htmlAttribute;
};

export const getFirstJSXOpeningElement = (code: string) => {
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

export const getJSXAttribute = (node: TSESTree.JSXOpeningElement) => {
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

export const htmlAttribute = (code: string) => {
  const element = getFirstHTMLOpeningElement(code);
  return getHTMLAttribute(element);
};

export const jsxAttribute = (code: string) => {
  const jsxElement = getFirstJSXOpeningElement(code);
  return getJSXAttribute(jsxElement);
};

export const vAttribute = (code: string) => {
  const vElement = getFirstVOpeningElement(code);
  return getVAttribute(vElement);
};

export const callExpression = (code: string) => {
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
