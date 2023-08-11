/**
 * @fileoverview Forbid using arbitrary values in classnames
 * @author François Massart
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const customConfig = require('../util/customConfig');
const astUtil = require('../util/ast');
const groupUtil = require('../util/groupMethods');
const { getOption, normalizeCallees } = require('../util/settings');
const parserUtil = require('../util/parser');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const ARBITRARY_VALUE_DETECTED_MSG = `Arbitrary value detected in '{{classname}}'`;

module.exports = {
  meta: {
    docs: {
      description: 'Forbid using arbitrary values in classnames',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-arbitrary-value'),
    },
    messages: {
      arbitraryValueDetected: ARBITRARY_VALUE_DETECTED_MSG,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          callees: {
            type: 'array',
            items: { type: 'string', minLength: 0 },
            uniqueItems: true,
          },
          ignoredKeys: {
            type: 'array',
            items: { type: 'string', minLength: 0 },
            uniqueItems: true,
          },
          config: {
            // returned from `loadConfig()` utility
            type: ['string', 'object'],
          },
          tags: {
            type: 'array',
            items: { type: 'string', minLength: 0 },
            uniqueItems: true,
          },
        },
      },
    ],
  },

  create: function (context) {
    const callees = normalizeCallees(getOption(context, 'callees'));
    const skipClassAttribute = getOption(context, 'skipClassAttribute');
    const tags = getOption(context, 'tags');
    const twConfig = getOption(context, 'config');
    const classRegex = getOption(context, 'classRegex');
    const classDeclarationRegex = getOption(context, 'declarationRegex');
    const skipClassDeclaration = getOption(context, 'skipClassDeclaration');

    const mergedConfig = customConfig.resolve(twConfig);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Recursive function crawling into child nodes
     * @param {ASTNode} node The root node of the current parsing
     * @param {ASTNode} arg The child node of node
     * @returns {void}
     */
    const parseForArbitraryValues = (node, arg = null, calleeKey = false) => {
      let originalClassNamesValue = null;
      if (arg === null) {
        originalClassNamesValue = astUtil.extractValueFromNode(node);
      } else {
        switch (arg.type) {
          case 'Identifier':
            return;
          case 'TemplateLiteral':
            arg.expressions.forEach((exp) => {
              parseForArbitraryValues(node, exp, calleeKey);
            });
            arg.quasis.forEach((quasis) => {
              parseForArbitraryValues(node, quasis, calleeKey);
            });
            return;
          case 'ConditionalExpression':
            parseForArbitraryValues(node, arg.consequent, calleeKey);
            parseForArbitraryValues(node, arg.alternate, calleeKey);
            return;
          case 'LogicalExpression':
            parseForArbitraryValues(node, arg.right, calleeKey);
            return;
          case 'ArrayExpression':
            arg.elements.forEach((el) => {
              parseForArbitraryValues(node, el, calleeKey);
            });
            return;
          case 'ObjectExpression':
            const isVue = node.key && node.key.type === 'VDirectiveKey';
            arg.properties.forEach((prop) => {
              const propVal = calleeKey || isVue ? prop.key : prop.value;
              parseForArbitraryValues(node, propVal, calleeKey);
            });
            return;
          case 'Property':
            parseForArbitraryValues(node, arg.key, calleeKey);
            return;
          case 'Literal':
            originalClassNamesValue = arg.value;
            break;
          case 'TemplateElement':
            originalClassNamesValue = arg.value.raw;
            if (originalClassNamesValue === '') {
              return;
            }
            break;
        }
      }

      let { classNames } = astUtil.extractClassnamesFromValue(originalClassNamesValue);
      const forbidden = [];
      classNames.forEach((cls, idx) => {
        const parsed = groupUtil.parseClassname(cls, [], mergedConfig, idx);
        if (/\[.*\]/i.test(parsed.name)) {
          forbidden.push(parsed.name);
        }
      });

      forbidden.forEach((forbiddenClass) => {
        context.report({
          node,
          messageId: 'arbitraryValueDetected',
          data: {
            classname: forbiddenClass,
          },
        });
      });
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    const attributeVisitor = function (node) {
      if (!astUtil.isClassAttribute(node, classRegex) || skipClassAttribute) {
        return;
      }
      if (astUtil.isLiteralAttributeValue(node)) {
        parseForArbitraryValues(node);
      } else if (node.value && node.value.type === 'JSXExpressionContainer') {
        parseForArbitraryValues(node, node.value.expression);
      }
    };

    const callExpressionVisitor = function (node) {
      const calleeType = callees[astUtil.calleeToString(node.callee)];
      if (!calleeType) {
        return;
      }
      node.arguments.forEach((arg) => {
        parseForArbitraryValues(node, arg, calleeType === 'key');
      });
    };

    const variableDeclaratorVistor = function (node) {
      if (!astUtil.isVariableDeclaration(node, classDeclarationRegex) || skipClassDeclaration) {
        return;
      }
      if (!astUtil.isValidDeclaratorValue(node)) {
        return;
      }
      parseForArbitraryValues(node, node.init);
    };

    const scriptVisitor = {
      JSXAttribute: attributeVisitor,
      TextAttribute: attributeVisitor,
      CallExpression: callExpressionVisitor,
      VariableDeclarator: variableDeclaratorVistor,
      TaggedTemplateExpression: function (node) {
        if (!tags.includes(node.tag.name)) {
          return;
        }
        parseForArbitraryValues(node, node.quasi);
      },
    };

    const templateVisitor = {
      CallExpression: callExpressionVisitor,
      /*
      Tagged templates inside data bindings
      https://github.com/vuejs/vue/issues/9721
      */
      VAttribute: function (node) {
        switch (true) {
          case !astUtil.isValidVueAttribute(node, classRegex):
            return;
          case astUtil.isVLiteralValue(node):
            parseForArbitraryValues(node, null);
            break;
          case astUtil.isVArrayExpression(node):
            node.value.expression.elements.forEach((arg) => {
              parseForArbitraryValues(node, arg);
            });
            break;
          case astUtil.isVObjectExpression(node):
            node.value.expression.properties.forEach((prop) => {
              parseForArbitraryValues(node, prop);
            });
            break;
        }
      },
    };

    return parserUtil.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
  },
};
