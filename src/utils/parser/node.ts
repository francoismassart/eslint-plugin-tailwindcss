import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { AST as VueAST } from "vue-eslint-parser";

import { AtomicNode } from "../rule";
import { GenericRuleContext } from "./visitors";

// TODO Investigate the differences between VueAST types and its runtime values

const separatorRegEx = /([\t\n\f\r ]+)/;

/**
 * @example
 * getClassnamesFromValue(` flex  grow   `);
 * // returns
 * // {
 * //   classNames: ['flex', 'grow'],
 * //   whitespaces: [" ", "  ", "   "],
 * //   headSpace: true,
 * //   tailSpace: true
 * // }
 */
export const getClassnamesFromValue = (classString: string) => {
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

/**
 * @example
 * // tw`flex`
 * getTagNameFromTaggedTemplateExpression(node); // 'tw'
 */
export const getTagNameFromTaggedTemplateExpression = (
  node: TSESTree.TaggedTemplateExpression,
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

/**
 * @example
 * getJSXAttributeName(<div className="flex" />); // className
 * getJSXAttributeName(<div ns:demo="flex" />); // ns:demo
 */
export const getJSXAttributeName = (node: TSESTree.JSXAttribute): string => {
  switch (node.name.type) {
    case AST_NODE_TYPES.JSXIdentifier: {
      return node.name.name;
    }
    case AST_NODE_TYPES.JSXNamespacedName: {
      return `${node.name.namespace.name}:${node.name.name.name}`;
    }
    default: {
      return "";
    }
  }
};

/**
 * @example
 * getVAttributeName(<template><p class="flex"></p></template>); // class
 * getVAttributeName(<template><p v-bind:class="classes"></p></template>); // class
 */
export const getVAttributeName = (node: VueAST.VAttribute): string => {
  /*
  ⚠️ `key.name` will convert to lowercase
  e.g. `className` becomes `classname`
  🤓 use `key.rawName` instead 😅
  */
  if (node.key.type === "VIdentifier") return node.key.rawName;
  if (node.key.type === "VDirectiveKey") {
    const directiveKey = node.key as unknown as VueAST.VDirectiveKey;
    const argument = directiveKey.argument;
    if (!argument) return "";
    if (argument.type === "VIdentifier") return argument.rawName;
  }
  return "";
};

/**
 * @example
 * // Given a TemplateElement ` absolute ${` returns
 * {
 *   originalClassNamesValue: " absolute ",
 *   start: 0, // index of the first backtick
 *   end: 15, // length of the template element
 *   prefix: "`", // used for rebuilding
 *   suffix: "${" // used for rebuilding
 * }
 */
export const dissectAtomicNode = (
  node: AtomicNode,
  context: GenericRuleContext,
) => {
  let originalClassNamesValue = "";
  let start = 0;
  let end = 0;
  let prefix = "";
  let suffix = "";
  switch (node.type) {
    case TSESTree.AST_NODE_TYPES.Literal: {
      originalClassNamesValue = "" + node.value;
      [start, end] = node.range;
      start++;
      end--;
      break;
    }
    case TSESTree.AST_NODE_TYPES.TemplateElement: {
      originalClassNamesValue = node.value.raw;
      if (originalClassNamesValue === "") {
        break;
      }
      [start, end] = node.range;
      // https://github.com/eslint/eslint/issues/13360
      // The problem is that range computation includes the backticks (`test`)
      // but `value.raw` does not include them, so there is a mismatch.
      // start/end does not include the backticks, therefore it matches value.raw.
      const rawCode = context.sourceCode.getText(
        node as unknown as TSESTree.Node,
      );
      [prefix, suffix] = getTemplateElementAffixes(
        rawCode,
        originalClassNamesValue,
      );
      break;
    }
    case "TextAttribute": {
      originalClassNamesValue = node.value;
      start = node.valueSpan.fullStart.offset;
      end = node.valueSpan.end.offset;
      break;
    }
    case "VLiteral": {
      originalClassNamesValue = "" + node.value;
      [start, end] = node.range;
      start++;
      end--;
      break;
    }
    default: {
      // console.log(index, "Unhandled literal type", literal.type);
      break;
    }
  }
  return {
    originalClassNamesValue,
    start,
    end,
    prefix,
    suffix,
  };
};
