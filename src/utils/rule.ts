import { TSESTree } from "@typescript-eslint/utils";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";
import { AST as VueAST } from "vue-eslint-parser";

import { TextAttribute } from "../types";
import type { PluginSettings } from "./parse-plugin-settings";
import { getTagNameFromTaggedTemplateExpression } from "./parser/node.js";
import {
  isLiteralAttributeValue,
  isValidCallExpression,
  isValidExpressionAttributeValue,
  isValidJSXAttribute,
  isValidTextAttribute,
  isValidVAttribute,
} from "./parser/visitors-validation.js";

export type AtomicNode =
  | TSESTree.Literal
  | TSESTree.TemplateElement
  | TextAttribute
  | VueAST.VAttribute
  | VueAST.VLiteral;

const getLiteralsFromNode = <TRuleContext>(
  settings: PluginSettings,
  context: TRuleContext,
  node: TSESTree.Node | VueAST.VAttribute,
  rootNode: TSESTree.Node | VueAST.VAttribute,
  depth: number = 0
): Array<AtomicNode> => {
  //   const indent = "  ".repeat(depth);
  //   console.log(indent, "getLiteralsFromNode", node.type);
  //   console.log(indent, "-------------------");

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
            depth + 1
          )
        );
      }
      break;
    }
    case TSESTree.AST_NODE_TYPES.CallExpression: {
      if (depth > 0) {
        break;
      }
      if (!isValidCallExpression(node, settings)) {
        break;
      }
      for (const argument of node.arguments) {
        literals.push(
          ...getLiteralsFromNode(
            settings,
            context,
            argument,
            rootNode,
            depth + 1
          )
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
          depth + 1
        ),
        ...getLiteralsFromNode(
          settings,
          context,
          node.alternate,
          rootNode,
          depth + 1
        )
      );
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
          depth + 1
        )
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
          depth + 1
        )
      );
      break;
    }
    case TSESTree.AST_NODE_TYPES.Literal: {
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
          depth + 1
        )
      );
      break;
    }
    case TSESTree.AST_NODE_TYPES.ObjectExpression: {
      // TODO use depth instead ?
      if (rootNode === undefined) {
        return [];
      }
      const isUsedByClassNamesPlugin =
        rootNode.type === "CallExpression" &&
        rootNode.callee &&
        rootNode.callee.type === "Identifier" &&
        rootNode.callee.name === "classnames";
      const isVue =
        rootNode.type === "VAttribute" &&
        rootNode.key &&
        // @ts-expect-error This comparison appears to be unintentional because the types '"VIdentifier"' and '"VDirectiveKey"' have no overlap.ts(2367)
        rootNode.key.type === "VDirectiveKey";
      for (const property of node.properties) {
        if (property.type === TSESTree.AST_NODE_TYPES.SpreadElement) {
          continue;
        }
        const propertyValue =
          isUsedByClassNamesPlugin || isVue ? property.key : property.value;
        literals.push(
          ...getLiteralsFromNode(
            settings,
            context,
            propertyValue,
            rootNode,
            depth + 1
          )
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
          depth + 1
        )
      );
      break;
    }
    case TSESTree.AST_NODE_TYPES.TemplateElement: {
      literals.push(node);
      break;
    }
    case TSESTree.AST_NODE_TYPES.TemplateLiteral: {
      for (const expression of node.expressions) {
        literals.push(
          ...getLiteralsFromNode(
            settings,
            context,
            expression,
            rootNode,
            depth + 1
          )
        );
      }
      for (const quasi of node.quasis) {
        literals.push(
          ...getLiteralsFromNode(settings, context, quasi, rootNode, depth + 1)
        );
      }
      break;
    }
  }
  return literals;
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
  // @ts-expect-error 'options' is declared but its value is never read.ts(6133)
  options: TOptions,
  lintLiterals: (
    context: TRuleContext,
    settings: PluginSettings,
    literals: Array<AtomicNode>
  ) => void
): RuleListener => {
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
        0
      );
      lintLiterals(context, settings, literals);
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
        0
      );
      lintLiterals(context, settings, literals);
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
        taggedTemplateExpressionNode
      );
      if (!settings.functions.includes(tagName)) return;

      const literals = getLiteralsFromNode(
        settings,
        context,
        taggedTemplateExpressionNode,
        taggedTemplateExpressionNode,
        0
      );
      lintLiterals(context, settings, literals);
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
      lintLiterals(context, settings, literals);
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
  // @ts-expect-error 'options' is declared but its value is never read.ts(6133)
  options: TOptions,
  lintLiterals: (
    context: TRuleContext,
    settings: PluginSettings,
    literals: Array<AtomicNode>
  ) => void
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
        lintLiterals(context, settings, [node.value]);
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
            ...getLiteralsFromNode(settings, context, current, node, 0)
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
                  ...getLiteralsFromNode(settings, context, key, node, 0)
                );
              }
            }
          }
          break;
        }
      }
      lintLiterals(context, settings, literals);
    },
  };
};
