import { TSESTree } from "@typescript-eslint/utils";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";
import { AST as VueAST } from "vue-eslint-parser";

import { TextAttribute } from "../types";
import type { PluginSettings } from "./parse-plugin-settings";
import { getTagNameFromTaggedTemplateExpression } from "./parser/node";
import {
  isLiteralAttributeValue,
  isValidCallExpression,
  isValidExpressionAttributeValue,
  isValidJSXAttribute,
  isValidTextAttribute,
  isValidVAttribute,
} from "./parser/visitors-validation";

export type AtomicNode =
  | TextAttribute
  | TSESTree.Identifier
  | TSESTree.Literal
  | TSESTree.TemplateElement
  | VueAST.VAttribute
  | VueAST.VLiteral;

/**
 * Recursively extracts literal nodes from the given AST node.
 * @param settings Plugin settings
 * @param context Rule context
 * @param node Current AST node
 * @param rootNode Root AST node
 * @param depth Current recursion depth
 * @param targetKeys Keys to target for extraction, if specified, it'll only extract from properties with these keys
 * @returns Array of atomic nodes
 */
export const getLiteralsFromNode = <TRuleContext>(
  settings: PluginSettings,
  context: TRuleContext,
  node: TSESTree.Node | VueAST.VAttribute,
  rootNode: TSESTree.Node | VueAST.VAttribute,
  depth: number = 0,
  targetKeys: Array<string> = [],
): Array<AtomicNode> => {
  // const indent = "  ".repeat(depth);
  // console.log(indent, "getLiteralsFromNode", node.type, targetKeys);
  // console.log(indent, "-------------------");

  const literals: Array<AtomicNode> = [];

  switch (node.type) {
    case TSESTree.AST_NODE_TYPES.ArrayExpression: {
      for (const element of node.elements) {
        if (!element) continue;
        literals.push(
          ...getLiteralsFromNode(
            settings,
            context,
            element,
            rootNode,
            depth + 1,
            targetKeys,
          ),
        );
      }
      break;
    }
    case TSESTree.AST_NODE_TYPES.CallExpression: {
      // Call expressions are only parsed by themselves, using the dedicated `CallExpression` visitor
      if (depth > 0) break;
      if (!isValidCallExpression(node, settings)) break;

      for (const argument of node.arguments) {
        literals.push(
          ...getLiteralsFromNode(
            settings,
            context,
            argument,
            rootNode,
            depth + 1,
          ),
        );
      }
      break;
    }
    case TSESTree.AST_NODE_TYPES.ConditionalExpression: {
      literals.push(
        ...getLiteralsFromNode(
          settings,
          context,
          node.consequent,
          rootNode,
          depth + 1,
        ),
        ...getLiteralsFromNode(
          settings,
          context,
          node.alternate,
          rootNode,
          depth + 1,
        ),
      );
      break;
    }
    case TSESTree.AST_NODE_TYPES.ExpressionStatement: {
      for (const element of node.expression ? [node.expression] : []) {
        if (!element) continue;
        literals.push(
          ...getLiteralsFromNode(
            settings,
            context,
            element,
            rootNode,
            depth + 1,
            targetKeys,
          ),
        );
      }
      break;
    }
    case TSESTree.AST_NODE_TYPES.Identifier: {
      literals.push(node);
      break;
    }
    case TSESTree.AST_NODE_TYPES.JSXAttribute: {
      if (!isValidJSXAttribute(node, settings)) break;
      if (!node.value) break;
      if (
        !isLiteralAttributeValue(node) &&
        !isValidExpressionAttributeValue(node)
      )
        break;
      literals.push(
        ...getLiteralsFromNode(
          settings,
          context,
          node.value,
          rootNode,
          depth + 1,
        ),
      );
      break;
    }
    case TSESTree.AST_NODE_TYPES.JSXExpressionContainer: {
      literals.push(
        ...getLiteralsFromNode(
          settings,
          context,
          node.expression,
          rootNode,
          depth + 1,
        ),
      );
      break;
    }
    case TSESTree.AST_NODE_TYPES.Literal: {
      if (typeof node.value !== "string") break;
      if (node.value === "") break;
      literals.push(node);
      break;
    }
    case TSESTree.AST_NODE_TYPES.LogicalExpression: {
      literals.push(
        ...getLiteralsFromNode(
          settings,
          context,
          node.right,
          rootNode,
          depth + 1,
        ),
      );
      break;
    }
    case TSESTree.AST_NODE_TYPES.ObjectExpression: {
      if (rootNode === undefined) {
        return [];
      }
      const isUsedByClsxPlugin =
        rootNode.type === "CallExpression" &&
        rootNode.callee &&
        rootNode.callee.type === "Identifier" &&
        rootNode.callee.name === "clsx";
      const isUsedByClassNamesPlugin =
        rootNode.type === "CallExpression" &&
        rootNode.callee &&
        rootNode.callee.type === "Identifier" &&
        rootNode.callee.name.toLowerCase() === "classnames";
      const isVue =
        rootNode.type === "VAttribute" &&
        rootNode.key &&
        // @ts-expect-error This comparison appears to be unintentional because the types '"VIdentifier"' and '"VDirectiveKey"' have no overlap.ts(2367)
        rootNode.key.type === "VDirectiveKey";
      const ignoredKeys = settings.ignoredKeys || [];
      for (const property of node.properties) {
        if (property.type === TSESTree.AST_NODE_TYPES.SpreadElement) {
          continue;
        }
        if (
          targetKeys.length > 0 &&
          property.key.type === "Identifier" &&
          !targetKeys.includes(property.key.name)
        ) {
          // If targetKeys is specified, only process properties with keys in targetKeys
          continue;
        }
        // TODO Enhance the logic to handle ignored keys
        const isIgnoredParent =
          property.key.type === "Identifier" &&
          ignoredKeys.includes(property.key.name);
        const nodeValue =
          isUsedByClsxPlugin || isUsedByClassNamesPlugin || isVue
            ? property.key
            : property.value;
        // Walk for literals
        literals.push(
          ...getLiteralsFromNode(
            settings,
            context,
            nodeValue,
            rootNode,
            depth + 1,
            isIgnoredParent ? ["class"] : targetKeys,
          ),
        );
      }
      break;
    }
    case TSESTree.AST_NODE_TYPES.TaggedTemplateExpression: {
      literals.push(
        ...getLiteralsFromNode(
          settings,
          context,
          node.quasi,
          rootNode,
          depth + 1,
        ),
      );
      break;
    }
    case TSESTree.AST_NODE_TYPES.TemplateElement: {
      literals.push(node);
      break;
    }
    case TSESTree.AST_NODE_TYPES.TemplateLiteral: {
      for (const [index, quasi] of node.quasis.entries()) {
        // Quasi
        literals.push(
          ...getLiteralsFromNode(settings, context, quasi, rootNode, depth + 1),
        );
        const expression = node.expressions[index];
        if (!expression) continue;
        if (expression.type === TSESTree.AST_NODE_TYPES.Identifier) continue;
        // Expression
        literals.push(
          ...getLiteralsFromNode(
            settings,
            context,
            expression,
            rootNode,
            depth + 1,
          ),
        );
      }

      break;
    }
  }
  return literals.filter((literal) => {
    if ("value" in literal) {
      return literal.value !== null;
    }
    return literal.name !== null;
  });
};

/**
 * Generate a list of RuleListeners
 * @example // Returns
 * {
 *   CallExpression: (node: TSESTree.Node) => void;
 *   ...
 *   JSXAttribute: (node: TSESTree.Node) => void;
 * }
 */
export const createScriptVisitors = <TRuleContext, TOptions>(
  context: TRuleContext,
  settings: PluginSettings,
  options: TOptions,
  lintLiterals: (
    context: TRuleContext,
    settings: PluginSettings,
    options: TOptions,
    literals: Array<AtomicNode>,
  ) => void,
): RuleListener => {
  // console.log(options);
  return {
    /**
     * In JSX + inside <script> section of Vue SFC…
     * @example
     * const classes = ctl('flex');
     * …
     * <div className={classes}>CallExpression via a const</div>
     * @example
     * <div className={ctl('flex')}>CallExpression inside a prop</div>
     * @example
     * const called = ctl('flex');
     * </script>
     * <template><div :class="called">CallExpression declared in the script section of a Vue SFC</div></template>
     */
    CallExpression(node: TSESTree.Node) {
      const callExpressionNode = node as TSESTree.CallExpression;

      const literals = getLiteralsFromNode(
        settings,
        context,
        callExpressionNode,
        callExpressionNode,
        0,
      );
      lintLiterals(context, settings, options, literals);
    },

    /**
     * Only the JSXAttributes
     * @example
     * <div className={'flex'}>JSXAttributes</div>
     */
    JSXAttribute(node: TSESTree.Node) {
      const jsxAttributeNode = node as TSESTree.JSXAttribute;

      const literals = getLiteralsFromNode(
        settings,
        context,
        jsxAttributeNode,
        jsxAttributeNode,
        0,
      );
      lintLiterals(context, settings, options, literals);
    },

    /**
     * In JSX + inside <script> section of Vue SFC…
     * @example
     * const classes = tw`flex`;
     */
    TaggedTemplateExpression(node: TSESTree.Node) {
      if (!settings.functions || settings.functions.length === 0) return;
      const taggedTemplateExpressionNode =
        node as TSESTree.TaggedTemplateExpression;
      const tagName = getTagNameFromTaggedTemplateExpression(
        taggedTemplateExpressionNode,
      );
      if (!settings.functions.includes(tagName)) return;

      const literals = getLiteralsFromNode(
        settings,
        context,
        taggedTemplateExpressionNode,
        taggedTemplateExpressionNode,
        0,
      );
      lintLiterals(context, settings, options, literals);
    },

    /**
     * Useful for regular HTML (non JSX)
     * @example
     * <div class="flex">TextAttribute</div>
     */
    TextAttribute(node: TSESTree.Node) {
      const textAttributeNode = node as unknown as TextAttribute;
      if (!isValidTextAttribute(textAttributeNode, settings)) return;
      const literals = [textAttributeNode];
      lintLiterals(context, settings, options, literals);
    },
  };
};

/**
 * Generate a list of RuleListeners
 * @example // Returns
 * {
 *   CallExpression: (node: TSESTree.Node) => void;
 *   ...
 *   JSXAttribute: (node: TSESTree.Node) => void;
 * }
 */
export const createTemplateVisitors = <TRuleContext, TOptions>(
  context: TRuleContext,
  settings: PluginSettings,
  options: TOptions,
  lintLiterals: (
    context: TRuleContext,
    settings: PluginSettings,
    options: TOptions,
    literals: Array<AtomicNode>,
  ) => void,
): RuleListener => {
  return {
    /**
     * Visitor for VAttribute within Vue SFC's `<template>`
     * @example
     * <template>
     *   <div v-bind:class="{'flex': isFlex}"></div>
     * </template>
     */
    VAttribute(node: VueAST.VAttribute) {
      if (!isValidVAttribute(node, settings)) return;
      if (node.value?.type === "VLiteral") {
        lintLiterals(context, settings, options, [node.value]);
      }
      // @ts-expect-error Types have no overlap.ts(2367)
      if (node.value?.type !== "VExpressionContainer") return;

      const container = node.value as unknown as VueAST.VExpressionContainer;
      const expression = container.expression;
      if (!expression) return;
      const expressionType = container.expression?.type || "";
      if (!expressionType) return;
      if (
        ![
          "ArrayExpression",
          "CallExpression",
          "Literal",
          "ObjectExpression",
        ].includes(expressionType)
      )
        return;
      const current = expression as TSESTree.Node;
      const literals: Array<AtomicNode> = [];
      switch (expressionType) {
        case "ArrayExpression":
        case "CallExpression":
        case "Literal": {
          literals.push(
            ...getLiteralsFromNode(settings, context, current, node, 0),
          );
          break;
        }
        case "ObjectExpression": {
          /**
           * In Vue classnames in ObjectExpression are stored in the keys
           * @example
           * <template><h1 :class="{'flex grow': isActive}">vue</h1></template>
           */
          if ("properties" in expression) {
            for (const property of expression.properties) {
              if (property.type === "Property") {
                const key = property.key as TSESTree.Node;
                literals.push(
                  ...getLiteralsFromNode(settings, context, key, node, 0),
                );
              }
            }
          }
          break;
        }
      }
      lintLiterals(context, settings, options, literals);
    },
  };
};
