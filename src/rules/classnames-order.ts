/**
 * @fileoverview Enforces a consistent order for the Tailwind CSS classnames, based on the compiler.
 * @author François Massart
 */

import { TSESTree } from "@typescript-eslint/utils";
import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleFunction } from "@typescript-eslint/utils/ts-eslint";
import { AST as VueAST } from "vue-eslint-parser";

import type {
  ScriptVisitor,
  SupportedChildNode,
  SupportedNode,
  TemplateVisitor,
  TextAttribute,
  ValueSupportedNode,
} from "../types";
import urlCreator from "../url-creator";
import { parsePluginSettings } from "../utils/parse-plugin-settings";
import {
  getClassnamesFromValue,
  getRangeFromNode,
  getTagNameFromTaggedTemplateExpression,
  getTemplateElementAffixes,
  getValueFromNodeAtom,
} from "../utils/parser/node";
import { defineVisitors, GenericRuleContext } from "../utils/parser/visitors";
import {
  isLiteralAttributeValue,
  isValidCallExpression,
  isValidExpressionAttributeValue,
  isValidJSXAttribute,
  isValidTextAttribute,
  isValidVAttribute,
} from "../utils/parser/visitors-validation";
import { getSortedClassNamesWorker } from "../utils/tailwindcss-api";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "classnames-order";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
type MessageIds = "fix:sort";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

export const classnamesOrder = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Enforces a consistent order for the Tailwind CSS classnames, based on the compiler.",
    },
    hasSuggestions: true,
    messages: {
      "fix:sort": "Invalid Tailwind CSS classnames order",
    },
    fixable: "code",
    // Schema is also parsed by `eslint-doc-generator`
    schema: [
      {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    ],
    type: "suggestion",
  },
  /**
   * About `defaultOptions`:
   * - `defaultOptions` is not parsed to generate the documentation
   * - `defaultOptions` is used when options are NOT provided in the rules configuration
   * - If some configuration is provided as the second argument, `defaultOptions` is ignored completely (not merged)
   * - In other words, the `defaultOptions` is only used when the rule is used WITHOUT any configuration
   */
  defaultOptions: [{}],
  // create: (context, options)
  create: (context) => {
    // Merged settings
    const settings = parsePluginSettings(context.settings);

    /**
     * Recursive function crawling into child nodes
     * @param node The root node of the current parsing (JSXAttribute)
     * @param child The child node of node
     * @returns {void}
     */
    const sortNodeArgumentValue = (
      node: SupportedNode,
      child?: SupportedChildNode
    ) => {
      let originalClassNamesValue = "";
      let start: number;
      let end: number;
      let prefix = "";
      let suffix = "";
      if (child === undefined) {
        // Simple case: the node is a JSXAttribute or TextAttribute or VueAST.VAttribute
        originalClassNamesValue = getValueFromNodeAtom(
          node as ValueSupportedNode
        );
        const range = getRangeFromNode(node as ValueSupportedNode);
        if (node.type === "TextAttribute") {
          [start, end] = range;
        } else {
          start = range[0] + 1;
          end = range[1] - 1;
        }
      } else {
        switch (child.type) {
          case "TemplateLiteral": {
            for (const exp of child.expressions) {
              sortNodeArgumentValue(node, exp);
            }
            for (const quasis of child.quasis) {
              sortNodeArgumentValue(node, quasis);
            }
            return;
          }
          case "ConditionalExpression": {
            sortNodeArgumentValue(node, child.consequent);
            sortNodeArgumentValue(node, child.alternate);
            return;
          }
          case "LogicalExpression": {
            sortNodeArgumentValue(node, child.right);
            return;
          }
          case "ArrayExpression": {
            for (const element of child.elements) {
              sortNodeArgumentValue(node, element);
            }
            return;
          }
          case "ObjectExpression": {
            // e.g. `{ 'bg-active': isActive }`
            // @example `classnames({ 'bg-active': isActive })`
            const isUsedByClassNamesPlugin =
              node.type === "CallExpression" &&
              node.callee &&
              node.callee.type === "Identifier" &&
              node.callee.name === "classnames";
            const isVue =
              node.type === "VAttribute" &&
              node.key &&
              // @ts-expect-error This comparison appears to be unintentional because the types '"VIdentifier"' and '"VDirectiveKey"' have no overlap.ts(2367)
              node.key.type === "VDirectiveKey";
            for (const property of child.properties) {
              if (property.type === "SpreadElement") {
                /**/
              }
              if (property.type === "Property") {
                /**/
              }
              if (property.type === "SpreadProperty") {
                /**/
              }
              if (property.type === "ExperimentalSpreadProperty") {
                /**/
              }
              if (property.type !== "Property") return;
              const propertyValue =
                isUsedByClassNamesPlugin || isVue
                  ? property.key
                  : property.value;
              // @ts-expect-error Type 'ESLintObjectPattern' is not assignable to type 'SupportedChildNode | undefined'.
              sortNodeArgumentValue(node, propertyValue);
            }
            return;
          }
          case "Property": {
            sortNodeArgumentValue(node, child.key);
            break;
          }

          case "Literal": {
            originalClassNamesValue = "" + child.value;
            start = child.range[0] + 1;
            end = child.range[1] - 1;
            break;
          }
          case "TemplateElement": {
            originalClassNamesValue = child.value.raw;
            if (originalClassNamesValue === "") {
              return;
            }
            [start, end] = child.range;
            // TODO Mess should be cleaned
            //*/
            // https://github.com/eslint/eslint/issues/13360
            // The problem is that range computation includes the backticks (`test`)
            // but value.raw does not include them, so there is a mismatch.
            // start/end does not include the backticks, therefore it matches value.raw.
            // @ts-expect-error TODO fix typing
            const rawCode = context.sourceCode.getText(child);
            [prefix, suffix] = getTemplateElementAffixes(
              rawCode,
              originalClassNamesValue
            );
            //*/
            break;
          }
          default:
          // console.log("child.type: " + child.type);
        }
      }
      // Process the extracted classnames and report
      {
        const { classNames, whitespaces, headSpace, tailSpace } =
          getClassnamesFromValue(originalClassNamesValue);
        // Skip empty/Single className
        if (classNames.length <= 1) return;

        const orderedClassNames = getSortedClassNamesWorker(
          settings.cssConfigPath,
          classNames
        );

        // Generates the validated/sorted attribute value
        let validatedClassNamesValue = "";
        for (let index = 0; index < orderedClassNames.length; index++) {
          const w = whitespaces[index] ?? "";
          const cls = orderedClassNames[index];
          validatedClassNamesValue += headSpace ? `${w}${cls}` : `${cls}${w}`;
          if (
            headSpace &&
            tailSpace &&
            index === orderedClassNames.length - 1
          ) {
            validatedClassNamesValue += whitespaces.at(-1) ?? "";
          }
        }

        if (originalClassNamesValue !== validatedClassNamesValue) {
          validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;
          context.report({
            node: node as TSESTree.Node,
            messageId: "fix:sort",
            fix: function (fixer) {
              return fixer.replaceTextRange(
                [start, end],
                validatedClassNamesValue
              );
            },
          });
        }
      }
      return;
    };

    /**
     * Visitor used for both JSX and simple text attributes
     */
    const attributeVisitor: RuleFunction<TSESTree.JSXAttribute> = (node) => {
      if (!isValidJSXAttribute(node, settings)) return;
      if (isLiteralAttributeValue(node)) {
        sortNodeArgumentValue(node);
      }
      if (isValidExpressionAttributeValue(node)) {
        // @ts-expect-error Property 'expression' does not exist on type. ts(2339)
        sortNodeArgumentValue(node, node.value.expression);
      }
    };

    // @ts-expect-error Type 'TextAttribute' does not satisfy the constraint 'NodeOrTokenData'.
    const textAttributeVisitor: RuleFunction<TextAttribute> = (node) => {
      if (!isValidTextAttribute(node, settings)) return;
      if (isLiteralAttributeValue(node)) {
        sortNodeArgumentValue(node);
      }
    };

    /**
     * Visitor for VAttribute within Vue SFC's `<template>`
     * @param node
     * @returns
     */
    const vAttributeVisitor: RuleFunction<VueAST.VAttribute> = (node) => {
      if (!isValidVAttribute(node, settings)) return;
      if (node.value?.type === "VLiteral") {
        sortNodeArgumentValue(node);
      } else if (node.value?.type === "VExpressionContainer") {
        const expressionContainer =
          node.value as unknown as VueAST.VExpressionContainer;
        switch (expressionContainer.expression?.type) {
          case "Literal": {
            sortNodeArgumentValue(node, expressionContainer.expression); // 🎯
            break;
          }
          case "CallExpression": {
            if (
              // @ts-expect-error Argument of type 'ESLintCallExpression' is not assignable to parameter of type 'CallExpression'.ts(2345)
              isValidCallExpression(expressionContainer.expression, settings)
            ) {
              for (const argument of expressionContainer.expression.arguments) {
                sortNodeArgumentValue(node, argument as SupportedNode); // 🎯
              }
            }
            break;
          }
          case "ArrayExpression": {
            for (const argument of expressionContainer.expression.elements) {
              sortNodeArgumentValue(node, argument); // 🎯
            }
            break;
          }
          case "ObjectExpression": {
            for (const property of expressionContainer.expression.properties) {
              if (property.type === "Property") {
                sortNodeArgumentValue(node, property); // 🎯
              }
            }
            break;
          }
        }
      }
    };

    const callExpressionVisitor: RuleFunction<TSESTree.CallExpression> = (
      node
    ) => {
      if (isValidCallExpression(node, settings)) {
        for (const argument of node.arguments) {
          sortNodeArgumentValue(node, argument as SupportedNode); // 🎯
        }
      }
    };

    const taggedTemplateExpressionVisitor: RuleFunction<
      TSESTree.TaggedTemplateExpression
    > = (node) => {
      if (!settings.functions || settings.functions.length === 0) return;
      const tagName = getTagNameFromTaggedTemplateExpression(node);
      if (!settings.functions.includes(tagName)) return;
      sortNodeArgumentValue(node, node.quasi); // 🎯
    };

    /**
     * Script visitor is used within both JSX and Vue SFC files (inside <script> section).
     */
    const scriptVisitor: ScriptVisitor = {
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
      CallExpression: callExpressionVisitor,
      /**
       * Only the JSXAttributes
       * @example
       * <div className={'flex'}>JSXAttributes</div>
       */
      JSXAttribute: attributeVisitor,
      /**
       * In JSX + inside <script> section of Vue SFC…
       * @example
       * const classes = tw`flex`;
       */
      TaggedTemplateExpression: taggedTemplateExpressionVisitor,
      /**
       * Useful for regular HTML (non JSX)
       * @example
       * <div class="flex">TextAttribute</div>
       */
      TextAttribute: textAttributeVisitor,
    };
    /**
     * Template visitor is only used within Vue SFC files (inside <template> section).
     */
    const templateVisitor: TemplateVisitor = {
      VAttribute: vAttributeVisitor,
    };

    return defineVisitors(
      context as unknown as Readonly<GenericRuleContext>,
      templateVisitor,
      scriptVisitor
    );
  },
});
