/**
 * @fileoverview Requires exactly one space between each class
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const astUtil = require('../util/ast');
const getOption = require('../util/settings');
const parserUtil = require('../util/parser');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const MULTIPLE_WHITESPACE_DETECTED_MSG = 'Multiple whitespace detected';

module.exports = {
  meta: {
    docs: {
      description: 'Remove unnecessary whitespaces between Tailwind CSS classnames',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('no-multiple-whitespace'),
    },
    messages: {
      multipleWhitespaceDetected: MULTIPLE_WHITESPACE_DETECTED_MSG,
    },
    fixable: 'code',
  },

  create: function (context) {
    const callees = getOption(context, 'callees');
    const skipClassAttribute = getOption(context, 'skipClassAttribute');
    const tags = getOption(context, 'tags');
    const classRegex = getOption(context, 'classRegex');

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Parse the classnames and report multiple whitespace
     * @param {ASTNode} node The root node of the current parsing
     * @param {ASTNode} arg The child node of node
     * @returns {void}
     */
    const parseForMultipleWhitespace = (node, arg = null) => {
      let originalClassNamesValue = null;
      let start = null;
      let end = null;
      let prefix = '';
      let suffix = '';

      if (arg === null) {
        originalClassNamesValue = astUtil.extractValueFromNode(node);
        const range = astUtil.extractRangeFromNode(node);
        if (node.type === 'TextAttribute') {
          start = range[0];
          end = range[1];
        } else {
          start = range[0] + 1;
          end = range[1] - 1;
        }
      } else {
        switch (arg.type) {
          case 'Identifier':
            return;
          case 'TemplateLiteral':
            arg.expressions.forEach((exp) => {
              parseForMultipleWhitespace(node, exp);
            });
            arg.quasis.forEach((quasis) => {
              parseForMultipleWhitespace(node, quasis);
            });
            return;
          case 'ConditionalExpression':
            parseForMultipleWhitespace(node, arg.consequent);
            parseForMultipleWhitespace(node, arg.alternate);
            return;
          case 'LogicalExpression':
            parseForMultipleWhitespace(node, arg.right);
            return;
          case 'ArrayExpression':
            arg.elements.forEach((el) => {
              parseForMultipleWhitespace(node, el);
            });
            return;
          case 'ObjectExpression':
            const isUsedByClassNamesPlugin = node.callee && node.callee.name === 'classnames';
            const isVue = node.key && node.key.type === 'VDirectiveKey';
            arg.properties.forEach((prop) => {
              const propVal = isUsedByClassNamesPlugin || isVue ? prop.key : prop.value;
              parseForMultipleWhitespace(node, propVal);
            });
            return;
          case 'Property':
            parseForMultipleWhitespace(node, arg.key);
            return;

          case 'Literal':
            originalClassNamesValue = arg.value;
            start = arg.range[0] + 1;
            end = arg.range[1] - 1;
            break;
          case 'TemplateElement':
            originalClassNamesValue = arg.value.raw;
            if (originalClassNamesValue === '') {
              return;
            }
            start = arg.range[0];
            end = arg.range[1];
            // https://github.com/eslint/eslint/issues/13360
            // The problem is that range computation includes the backticks (`test`)
            // but value.raw does not include them, so there is a mismatch.
            // start/end does not include the backticks, therefore it matches value.raw.
            const txt = context.getSourceCode().getText(arg);
            prefix = astUtil.getTemplateElementPrefix(txt, originalClassNamesValue);
            suffix = astUtil.getTemplateElementSuffix(txt, originalClassNamesValue);
            originalClassNamesValue = astUtil.getTemplateElementBody(txt, prefix, suffix);
            break;
        }
      }

      // Class names on multiple lines
      if (/\r|\n/.test(originalClassNamesValue)) {
        return;
      } else {
        let { whitespaces } = astUtil.extractClassnamesFromValue(originalClassNamesValue);
        
        if(whitespaces.some(whitespace => whitespace.length > 1) || originalClassNamesValue.trim() !== originalClassNamesValue) {
          context.report({
            node: node,
            messageId: 'multipleWhitespaceDetected',
            fix: function (fixer) {
              const newText = originalClassNamesValue.trim().replace(/\s+/g, ' ').trim();
              return fixer.replaceTextRange([start, end], newText);
            },
          })
        }
      }
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    const attributeVisitor = function (node) {
      if (!astUtil.isClassAttribute(node, classRegex) || skipClassAttribute) {
        return;
      }
      if (astUtil.isLiteralAttributeValue(node)) {
        parseForMultipleWhitespace(node);
      } else if (node.value && node.value.type === 'JSXExpressionContainer') {
        parseForMultipleWhitespace(node, node.value.expression);
      }
    };

    const callExpressionVisitor = function (node) {
      const calleeStr = astUtil.calleeToString(node.callee);
      if (callees.findIndex((name) => calleeStr === name) === -1) {
        return;
      }

      node.arguments.forEach((arg) => {
        parseForMultipleWhitespace(node, arg);
      });
    };

    const scriptVisitor = {
      JSXAttribute: attributeVisitor,
      TextAttribute: attributeVisitor,
      CallExpression: callExpressionVisitor,
      TaggedTemplateExpression: function (node) {
        if (!tags.includes(node.tag.name ?? node.tag.object?.name ?? node.tag.callee?.name)) {
          return;
        }

        parseForMultipleWhitespace(node, node.quasi);
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
            parseForMultipleWhitespace(node);
            break;
          case astUtil.isArrayExpression(node):
            node.value.expression.elements.forEach((arg) => {
              parseForMultipleWhitespace(node, arg);
            });
            break;
          case astUtil.isObjectExpression(node):
            node.value.expression.properties.forEach((prop) => {
              parseForMultipleWhitespace(node, prop);
            });
            break;
        }
      },
    };

    return parserUtil.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
  },
};
