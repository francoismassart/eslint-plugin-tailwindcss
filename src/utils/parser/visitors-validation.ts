import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { AST as VueAST } from "vue-eslint-parser";

import { TextAttribute } from "../../types";
import { SupportedAttribute } from "../../types";
import { type PluginSettings } from "../parse-plugin-settings";
import { getJSXAttributeName, getVAttributeName } from "./node";

/**
 * Validates a `JSXAttribute` for `eslint-plugin-tailwindcss`
 * Returns `false` if the `JSXAttribute` can be skipped.
 */
export const isValidJSXAttribute = (
  node: TSESTree.JSXAttribute,
  settings: PluginSettings
): boolean => {
  const attributes = (settings && settings.attributes) || [];
  // Ignored JSXAttribute
  if (!attributes.includes(getJSXAttributeName(node))) return false;
  // No value
  if (!node.value) return false;
  // Ignored JSXExpressionContainer expressions
  if (node.value.type === AST_NODE_TYPES.JSXExpressionContainer) {
    switch (node.value.expression.type) {
      case AST_NODE_TYPES.CallExpression: // Handled by the CallExpression visitor
      case AST_NODE_TYPES.Identifier: // We don't parse Identifier's
      case AST_NODE_TYPES.TaggedTemplateExpression: {
        // Handled by the TaggedTemplateExpression visitor
        return false;
      }
    }
  }
  // Valid JSXAttribute
  return true;
};

export const isValidTextAttribute = (
  node: TextAttribute,
  settings: PluginSettings
): boolean => {
  const attributes = (settings && settings.attributes) || [];
  // Ignored TextAttribute
  if (!attributes.includes(node.name)) return false;
  // No value
  if (!node.value) return false;
  // Ignored JSXExpressionContainer expressions
  return true;
};

/**
 * Validates a `VAttribute` for `eslint-plugin-tailwindcss`
 * `VAttribute` only contains `VLiteral` or `null` value
 * Returns `false` if the `VAttribute` can be skipped.
 */
export const isValidVAttribute = (
  node: VueAST.VAttribute,
  settings: PluginSettings
): boolean => {
  const attributes = (settings && settings.attributes) || [];
  // Ignored VAttribute
  const keyName = getVAttributeName(node);
  // if (!node.directive && !attributes.includes(keyName)) return false;
  if (!attributes.includes(keyName)) return false;
  // No value
  if (!node.value) return false;
  // Valid VLiteral
  if (node.value.type === "VLiteral") return true;
  // VExpressionContainer
  if (node.value.type === "VExpressionContainer") return true;
  return false;
};

/**
 * Validates a `CallExpression` for `eslint-plugin-tailwindcss`
 * Returns `false` if the `CallExpression` can be skipped.
 */
export const isValidCallExpression = (
  node: TSESTree.CallExpression,
  settings: PluginSettings
): boolean => {
  if (!settings.functions || settings.functions.length === 0) {
    return false;
  }
  switch (node.callee.type) {
    case AST_NODE_TYPES.Identifier: {
      return settings.functions.includes(node.callee.name);
    }
    case AST_NODE_TYPES.MemberExpression: {
      return (
        node.callee.property.type === AST_NODE_TYPES.Identifier &&
        settings.functions.includes(node.callee.property.name)
      );
    }
  }
  return false;
};

export const isLiteralAttributeValue = (node: SupportedAttribute) => {
  // No value
  if (!node.value) return false;
  // TextAttribute via AngularParser (HTML)
  if (node.type === "TextAttribute") return true;
  // Literal
  if (
    node.value.type === TSESTree.AST_NODE_TYPES.Literal &&
    typeof node.value.value === "string"
  ) {
    // No support for dynamic or conditional...
    return !/\{|\?|\}/.test(node.value.value);
  }
  // number | bigint | boolean | RegExp | null
  return false;
};

export const isValidExpressionAttributeValue = (
  node: TSESTree.JSXAttribute
) => {
  // No value
  if (!node.value) return false;
  // Unsupported type
  if (node.value.type !== TSESTree.AST_NODE_TYPES.JSXExpressionContainer)
    return false;
  // No expression
  if (!node.value.expression) return false;
  // Empty expression
  if (node.value.expression.type === TSESTree.AST_NODE_TYPES.JSXEmptyExpression)
    return false;
  return true;
};
