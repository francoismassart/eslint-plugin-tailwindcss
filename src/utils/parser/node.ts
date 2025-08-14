import { TSESTree } from "@typescript-eslint/utils";

import { SupportedAttribute, ValueSupportedNode } from "../../types";

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

export const isExpressionAttributeValue = (node: TSESTree.JSXAttribute) => {
  // No value
  if (!node.value) return false;
  if (node.value.type !== TSESTree.AST_NODE_TYPES.JSXExpressionContainer)
    return false;
  if (!node.value.expression) return false;
  if (node.value.expression.type === TSESTree.AST_NODE_TYPES.JSXEmptyExpression)
    return false;
  return true;
};

export const extractValueFromNode = (node: ValueSupportedNode) => {
  // No value
  if (!node.value) return "";
  // TextAttribute via AngularParser (HTML)
  if (node.type === "TextAttribute") return node.value;
  if (node.type === "VAttribute") return node.value.value;
  // JSXAttribute
  switch (node.value.type) {
    case TSESTree.AST_NODE_TYPES.JSXExpressionContainer: {
      const expression = node.value.expression;
      switch (expression.type) {
        case TSESTree.AST_NODE_TYPES.Literal: {
          if (expression.value) return "" + expression.value;
          return "";
        }
        default: {
          return "";
        }
      }
    }
    case TSESTree.AST_NODE_TYPES.Literal: {
      return "" + node.value.value;
    }
    default: {
      return "";
    }
  }
};

const separatorRegEx = /([\t\n\f\r ]+)/;

export const extractClassnamesFromValue = (classString: string) => {
  const parts = classString.split(separatorRegEx);
  const empty = {
    classNames: [],
    whitespaces: [],
    headSpace: false,
    tailSpace: false,
  };
  if (parts.length === 0) return empty;
  // Cleaning
  if (parts[0] === "") {
    parts.shift();
  }
  if (parts.at(-1) === "") {
    parts.pop();
  }
  if (parts.length === 0) return empty;
  const headSpace = separatorRegEx.test(parts[0]);
  const tailSpace = separatorRegEx.test(parts.at(-1) || "");
  const isClass = (_: string, index: number) =>
    headSpace ? index % 2 !== 0 : index % 2 === 0;
  const isNotClass = (_: string, index: number) =>
    headSpace ? index % 2 === 0 : index % 2 !== 0;
  const classes = parts.filter((element, index) => isClass(element, index));
  const spaces = parts.filter((element, index) => isNotClass(element, index));
  return {
    classNames: classes,
    whitespaces: spaces,
    headSpace: headSpace,
    tailSpace: tailSpace,
  };
};

export const extractRangeFromNode = (node: ValueSupportedNode) => {
  if (node.type === "TextAttribute") {
    return [node.valueSpan.fullStart.offset, node.valueSpan.end.offset];
  }
  if (!node.value) {
    return [0, 0];
  }
  switch (node.value.type) {
    case TSESTree.AST_NODE_TYPES.JSXExpressionContainer: {
      return node.value.expression.range;
    }
    default: {
      return node.value.range;
    }
  }
};

/**
 * Get the prefix of a template element.
 * @param haystack The full text of the template element including backtick, `${`, and `}`.
 * @param needle The inner content of the template element.
 * @returns The prefix of the template element.
 * @example
 * getTemplateElementPrefix("`relative grid`", "relative grid"); // "`"
 * getTemplateElementPrefix("`absolute ${", "absolute "); // "`"
 * getTemplateElementPrefix("`} ${", " "); // "`}"
 */
export const getTemplateElementPrefix = (haystack: string, needle: string) => {
  if (haystack.indexOf(needle) < 1) return "";
  return haystack.split(needle).at(0) || "";
};

/**
 * Get the suffix of a template element.
 * @param haystack The full text of the template element including backtick, `${`, and `}`.
 * @param needle The inner content of the template element.
 * @returns The suffix of the template element.
 * @example
 * getTemplateElementSuffix("`relative grid`", "relative grid"); // "`"
 * getTemplateElementSuffix("`absolute ${", "absolute "); // "${"
 * getTemplateElementSuffix("`} ${", " "); // "${"
 */
export const getTemplateElementSuffix = (haystack: string, needle: string) => {
  if (!haystack.includes(needle)) return "";
  return haystack.split(needle).at(-1) || "";
};

/**
 * Get both the prefix and suffix of a template element.
 * @param haystack The full text of the template element including backtick, `${`, and `}`.
 * @param needle The inner content of the template element.
 * @returns The prefix and suffix of the template element.
 * @example
 * getTemplateElementAffixes("`relative grid`", "relative grid"); // ["`", "`"]
 * getTemplateElementAffixes("`absolute ${", "absolute "); // ["`", "${"]
 * getTemplateElementAffixes("`} ${", " "); // ["`}", "${"]
 */
export const getTemplateElementAffixes = (haystack: string, needle: string) => {
  return [
    getTemplateElementPrefix(haystack, needle),
    getTemplateElementSuffix(haystack, needle),
  ];
};

export const getTagNameFromTaggedTemplateExpression = (
  node: TSESTree.TaggedTemplateExpression
) => {
  switch (node.tag.type) {
    case "CallExpression": {
      // tw(Input)`absolute unknown relative`;
      // @ts-expect-error Property 'name' does not exist on type 'Expression'.
      return node.tag.callee.name || "";
    }
    case "MemberExpression": {
      // tw.subTag`flex unknown relative`;
      // @ts-expect-error Property 'name' does not exist on type 'Expression'.
      return node.tag.object.name || "";
    }
    case "Identifier": {
      return node.tag.name || "";
    }
  }
  return "";
};
