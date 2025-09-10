import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { AST as VueAST } from "vue-eslint-parser";

import { AtomicNode } from "../rule";
import { GenericRuleContext } from "./visitors";

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

/**
 * Used to safely find the index of a classname in a string of classnames.
 * Ensures that the found classname is not a substring of another classname.
 *
 * @example
 * getIndexOfNeedle("flex-col md:flex", "flex"); // -1
 * getIndexOfNeedle("flex-col flex", "flex"); // 9
 */
export const getIndexOfNeedle = (haystack: string, needle: string): number => {
  const validChars = new Set([undefined, " ", "\n", "\t", "\r", "\f"]);
  let position = 0;

  while (position <= haystack.length - needle.length) {
    const index = haystack.indexOf(needle, position);
    if (index === -1) return -1;

    const previousCharacter = index > 0 ? haystack[index - 1] : undefined;
    const nextChar =
      index + needle.length < haystack.length
        ? haystack[index + needle.length]
        : undefined;

    if (validChars.has(previousCharacter) && validChars.has(nextChar)) {
      return index;
    }
    position = index + needle.length;
  }

  return -1;
};

export const generateLocForClassname = (
  node: AtomicNode,
  needle: string,
  originalClassNamesValue: string,
  context: GenericRuleContext,
) => {
  const isTemplateElement =
    node.type === TSESTree.AST_NODE_TYPES.TemplateElement;
  // @ts-expect-error unkown loc property
  const nodeLoc: TSESTree.SourceLocation = node.loc;
  const nodeLocStart: TSESTree.Position = nodeLoc.start;

  const index = getIndexOfNeedle(originalClassNamesValue, needle);
  if (index === -1) {
    return nodeLoc;
  }
  const needleLocStart = context.sourceCode.getLocFromIndex(index);
  const needleLocEnd = context.sourceCode.getLocFromIndex(
    index + needle.length,
  );
  // TemplateElement needs special handling
  if (isTemplateElement) {
    const sliceEnd = Math.max(0, index);
    const prefix = originalClassNamesValue.slice(0, sliceEnd);
    const newLines = (prefix.match(/\n/g) || []).length;
    needleLocStart.line = newLines;
    needleLocEnd.line = newLines;
    const lastNewlineIndex = prefix.lastIndexOf("\n");
    const charsSinceLastNewline =
      lastNewlineIndex === -1
        ? needleLocStart.column
        : prefix.length - lastNewlineIndex - 1;
    needleLocStart.column = charsSinceLastNewline;
    needleLocEnd.column = needleLocStart.column + needle.length;
  }
  // Lines
  const lineOffset =
    node.type === TSESTree.AST_NODE_TYPES.TemplateElement ? 0 : 1;
  const patchedLineStart = nodeLocStart.line + needleLocStart.line - lineOffset; // -1 because locStart.line is 1-based
  const patchedLineEnd = patchedLineStart;
  // Columns
  let patchedColumnStart = needleLocStart.column;
  if (
    (isTemplateElement && needleLocStart.line === 0) ||
    (!isTemplateElement && needleLocStart.line === 1)
  ) {
    patchedColumnStart = nodeLocStart.column + needleLocStart.column + 1; // Jump the starting quote
  }
  const patchedColumnEnd = patchedColumnStart + needle.length;
  const patchedLoc = {
    start: {
      column: patchedColumnStart,
      line: patchedLineStart,
    },
    end: {
      column: patchedColumnEnd,
      line: patchedLineEnd,
    },
  };
  return patchedLoc;
};

export const getRange = (
  node: AtomicNode,
  needle: string,
  originalClassNamesValue: string,
): [number, number] => {
  // @ts-expect-error unknown loc property
  const nodeLoc = node.loc;
  let offset = nodeLoc.start.column;
  switch (node.type) {
    case "TextAttribute": {
      // @ts-expect-error col is unknown
      offset = node.valueSpan.start.col;
      break;
    }
    case "Literal": {
      offset = nodeLoc.start.column + 1; // Jump the starting quote
      break;
    }
    case "TemplateElement": {
      console.log(node);
      offset = node.range[0] + 1;
      break;
    }
    default: {
      console.info("");
      console.info("Unknown node type:", node.type);
      console.info("");
      return [0, 0];
      break;
    }
  }
  const index = getIndexOfNeedle(originalClassNamesValue, needle);
  if (index === -1) return [0, 0];
  return [offset + index, offset + index + needle.length];
};
