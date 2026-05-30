/**
 * @fileoverview Enforces correct arbitrary value syntax (using square brackets)
 * @author Sweet
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const customConfig = require('../util/customConfig');
const astUtil = require('../util/ast');
const groupUtil = require('../util/groupMethods');
const getOption = require('../util/settings');
const parserUtil = require('../util/parser');
const createContextFallback = require('tailwindcss/lib/lib/setupContextUtils').createContext;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const INVALID_ARBITRARY_VALUE_MSG = `Classname '{{classname}}' uses invalid arbitrary value syntax, should be '{{suggestion}}'`;

// Regular expression to match class names with incorrect value usage
// Modified to only match values with units, avoiding matching pure numbers and color values
const INVALID_ARBITRARY_VALUE_REGEX = /^([a-z][\w-]*?)-([-]?\d+(?:\.\d+)?(?:px|rem|em|vh|vw|%|s|ms|deg|turn))$/i;

// Regular expression to exclude color classes (e.g. bg-blue-500, text-red-600, etc.)
const COLOR_CLASSNAME_REGEX = /-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+$/i;

// List of supported CSS units
const CSS_UNITS = ['px', 'rem', 'em', 'vh', 'vw', 'vmin', 'vmax', 's', 'ms', 'deg', 'turn', 'rad', 'fr', 'ch', 'ex', 'rpx'];

// Regular expression to match values with units
const CSS_UNIT_REGEX = new RegExp(`^([a-z][\\w-]*?)-([-]?\\d+(?:\\.\\d+)?(?:${CSS_UNITS.join('|')}))$`, 'i');

// Regular expression to exclude classes with percentage units
const PERCENTAGE_REGEX = /^([a-z][\w-]*?)-\d+(?:\.\d+)?%$/i;

const contextFallbackCache = new WeakMap();

module.exports = {
  meta: {
    docs: {
      description: 'Enforces correct arbitrary value syntax (using square brackets)',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('enforces-arbitrary-value-syntax'),
    },
    messages: {
      invalidArbitraryValueSyntax: INVALID_ARBITRARY_VALUE_MSG,
    },
    fixable: 'code',
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
    const callees = getOption(context, 'callees');
    const ignoredKeys = getOption(context, 'ignoredKeys');
    const skipClassAttribute = getOption(context, 'skipClassAttribute');
    const tags = getOption(context, 'tags');
    const twConfig = getOption(context, 'config');
    const classRegex = getOption(context, 'classRegex');

    const mergedConfig = customConfig.resolve(twConfig);
    const contextFallback = // Set the created contextFallback in the cache if it does not exist yet.
      (
        contextFallbackCache.has(mergedConfig)
          ? contextFallbackCache
          : contextFallbackCache.set(mergedConfig, createContextFallback(mergedConfig))
      ).get(mergedConfig);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Check if a class name uses incorrect arbitrary value syntax
     * @param {string} className The class name to check
     * @returns {object|null} An object containing the correction suggestion, or null if no correction is needed
     */
    const checkArbitraryValueSyntax = (className) => {
      // Skip if the class name matches the color class pattern (e.g. bg-blue-500)
      if (COLOR_CLASSNAME_REGEX.test(className)) {
        return null;
      }

      // Skip if the class name contains a percentage unit
      if (PERCENTAGE_REGEX.test(className)) {
        return null;
      }

      // Check if it matches a value with a unit
      const match = className.match(CSS_UNIT_REGEX);
      if (match) {
        const [, prefix, value] = match;
        // Build the corrected class name
        const correctedClassName = `${prefix}-[${value}]`;
        return {
          original: className,
          suggestion: correctedClassName
        };
      }
      return null;
    };

    /**
     * Parse class names and report any syntax errors found
     * @param {Array} classNames Array of class names
     * @param {ASTNode} node AST node
     * @param {Function} fixerFn Fix function
     */
    const parseForInvalidArbitraryValueSyntax = (classNames, node, fixerFn) => {
      // Collect all class names that need to be fixed
      const invalidClassnames = classNames
        .map(className => {
          const result = checkArbitraryValueSyntax(className);
          return result ? {
            original: result.original,
            suggestion: result.suggestion
          } : null;
        })
        .filter(result => result !== null);

      // If there are class names that need to be fixed, report errors
      if (invalidClassnames.length > 0) {
        invalidClassnames.forEach(result => {
          context.report({
            node,
            messageId: 'invalidArbitraryValueSyntax',
            data: {
              classname: result.original,
              suggestion: result.suggestion,
            },
            fix: fixerFn ? (fixer) => fixerFn(fixer, invalidClassnames) : null,
          });
        });
      }
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    const attributeVisitor = function (node) {
      if (!astUtil.isClassAttribute(node, classRegex) || skipClassAttribute) {
        return;
      }

      // Handle text attribute
      if (node.type === 'TextAttribute' && node.name === 'class') {
        const originalValue = node.value;
        if (typeof originalValue === 'string') {
          const { classNames } = astUtil.extractClassnamesFromValue(originalValue);

          const fixerFn = (fixer, invalidClassnames) => {
            let updatedValue = originalValue;

            // Replace all invalid class names
            invalidClassnames.forEach(item => {
              const classNameRegex = new RegExp(`\\b${item.original}\\b`, 'g');
              updatedValue = updatedValue.replace(classNameRegex, item.suggestion);
            });

            return fixer.replaceText(node, `class="${updatedValue}"`);
          };

          parseForInvalidArbitraryValueSyntax(classNames, node, fixerFn);
        }
      } else if (astUtil.isLiteralAttributeValue(node)) {
        const originalClassNamesValue = astUtil.extractValueFromNode(node);

        if (node.type === 'JSXAttribute') {
          let start, end;

          if (node.value.type === 'Literal') {
            start = node.value.range[0] + 1;
            end = node.value.range[1] - 1;
          } else if (node.value.type === 'JSXExpressionContainer' && node.value.expression.type === 'Literal') {
            start = node.value.expression.range[0] + 1;
            end = node.value.expression.range[1] - 1;
          }

          const fixerFn = (fixer, invalidClassnames) => {
            // Get the full class name string
            const sourceCode = context.getSourceCode();
            const text = sourceCode.getText().slice(start, end);

            let updatedText = text;

            // Replace all invalid class names
            invalidClassnames.forEach(item => {
              const classNameRegex = new RegExp(`\\b${item.original}\\b`, 'g');
              updatedText = updatedText.replace(classNameRegex, item.suggestion);
            });

            return fixer.replaceTextRange([start, end], updatedText);
          };

          const { classNames } = astUtil.extractClassnamesFromValue(originalClassNamesValue);
          parseForInvalidArbitraryValueSyntax(classNames, node, fixerFn);
        }
      }
    };

    const callExpressionVisitor = function (node) {
      const calleeStr = astUtil.calleeToString(node.callee);
      if (callees.findIndex((name) => calleeStr === name) === -1) {
        return;
      }

      node.arguments.forEach((arg) => {
        if (arg.type === 'Literal' && typeof arg.value === 'string') {
          const { classNames } = astUtil.extractClassnamesFromValue(arg.value);

          const fixerFn = (fixer, invalidClassnames) => {
            const sourceCode = context.getSourceCode();
            const text = sourceCode.getText(arg);
            const innerText = text.slice(1, -1); // Remove quotes

            let updatedText = innerText;

            // Replace all invalid class names
            invalidClassnames.forEach(item => {
              const classNameRegex = new RegExp(`\\b${item.original}\\b`, 'g');
              updatedText = updatedText.replace(classNameRegex, item.suggestion);
            });

            // Use the same type of quote
            const quote = text[0];
            return fixer.replaceText(arg, `${quote}${updatedText}${quote}`);
          };

          parseForInvalidArbitraryValueSyntax(classNames, arg, fixerFn);
        } else {
          astUtil.parseNodeRecursive(node, arg, (classNames, nestedNode) => {
            parseForInvalidArbitraryValueSyntax(classNames, nestedNode, null);
          }, false, false, ignoredKeys);
        }
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
        astUtil.parseNodeRecursive(node, node.quasi, (classNames, nestedNode) => {
          parseForInvalidArbitraryValueSyntax(classNames, nestedNode, null);
        }, false, false, ignoredKeys);
      },
    };

    // With the vue-eslint-parser
    if (parserUtil.defineTemplateBodyVisitor) {
      return parserUtil.defineTemplateBodyVisitor(
        context,
        {
          VAttribute: function (node) {
            if (!astUtil.isValidVueAttribute(node, classRegex)) {
              return;
            }

            if (astUtil.isVLiteralValue(node)) {
              const { classNames } = astUtil.extractClassnamesFromValue(node.value.value);
              parseForInvalidArbitraryValueSyntax(classNames, node, null);
            } else if (astUtil.isArrayExpression(node)) {
              node.value.expression.elements.forEach((element) => {
                if (element.type === 'Literal' && typeof element.value === 'string') {
                  const { classNames } = astUtil.extractClassnamesFromValue(element.value);
                  parseForInvalidArbitraryValueSyntax(classNames, element, null);
                }
              });
            } else if (astUtil.isObjectExpression(node)) {
              node.value.expression.properties.forEach((property) => {
                if (property.key.type === 'Literal' && typeof property.key.value === 'string') {
                  const { classNames } = astUtil.extractClassnamesFromValue(property.key.value);
                  parseForInvalidArbitraryValueSyntax(classNames, property.key, null);
                }
              });
            }
          },
          VElement: function (node) {
            // Look for <Component :is="'div'" class="..."/>
            // the "class" attribute is attached to the VElement
            // (no dynamic value)
            if (node.startTag.attributes) {
              node.startTag.attributes.forEach((attr) => {
                if (attr.key && attr.key.name === 'class' && attr.value) {
                  const { classNames } = astUtil.extractClassnamesFromValue(attr.value.value);
                  parseForInvalidArbitraryValueSyntax(classNames, attr, null);
                }
              });
            }
          },
        },
        scriptVisitor
      );
    }

    return scriptVisitor;
  },
}; 