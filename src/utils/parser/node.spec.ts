import * as AngularParser from "@angular-eslint/template-parser";
import * as Parser from "@typescript-eslint/parser";
import { TSESTree } from "@typescript-eslint/utils";
import { expect, test } from "vitest";

import { GenericElement, TextAttribute } from "../../types";
import { extractValueFromNode, isLiteralAttributeValue } from "./node";

const withJSX = {
  ecmaFeatures: { jsx: true },
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

test("isLiteralAttributeValue", () => {
  // Normal case: "TextAttribute" via AngularParser (HTML)
  const html = getFirstHTMLOpeningElement(`<h1 class="flex">normal</h1>`);
  const textAttribute = getHTMLAttribute(html);
  expect(isLiteralAttributeValue(textAttribute)).toBe(true);
  // No value case via AngularParser (HTML)
  const hidden = getFirstHTMLOpeningElement(`<h1 hidden>no value</h1>`);
  const hiddenAttribute = getHTMLAttribute(hidden);
  expect(isLiteralAttributeValue(hiddenAttribute)).toBe(false);
  // Normal case (JSX)
  const jsx = getFirstJSXOpeningElement(`<h1 className="flex">normal jsx</h1>`);
  const jsxAttribute = getJSXAttribute(jsx);
  expect(isLiteralAttributeValue(jsxAttribute)).toBe(true);
  // No value case (JSX)
  const hiddenJsx = getFirstJSXOpeningElement(`<h1 hidden>hidden jsx</h1>`);
  const jsxHiddenAttribute = getJSXAttribute(hiddenJsx);
  expect(isLiteralAttributeValue(jsxHiddenAttribute)).toBe(false);
  // CallExpression (JSX)
  const callJsx = getFirstJSXOpeningElement(`<h1 class={ctl('flex')}>ctl</h1>`);
  const callAttribute = getJSXAttribute(callJsx);
  expect(isLiteralAttributeValue(callAttribute)).toBe(false);
});

test("extractValueFromNode", () => {
  // Normal case: "TextAttribute" via AngularParser (HTML)
  const html = getFirstHTMLOpeningElement(`<h1 class="flex">html</h1>`);
  const textAttribute = getHTMLAttribute(html);
  expect(extractValueFromNode(textAttribute)).toBe("flex");
  // JSXLiteral
  const jsx = getFirstJSXOpeningElement(`<h1 class="m-0 flex">jsx</h1>`);
  const attribute = getJSXAttribute(jsx);
  expect(extractValueFromNode(attribute)).toBe("m-0 flex");
  // JSXExpressionContainer
  const literal = getFirstJSXOpeningElement(`<h1 className={'block'}>jsx</h1>`);
  const literalExpression = getJSXAttribute(literal);
  expect(extractValueFromNode(literalExpression)).toBe("block");
});
