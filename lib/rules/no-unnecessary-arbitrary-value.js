/**
 * @fileoverview Detect arbitrary classnames which have an existing equivalent preset in the configuration
 * @author François Massart
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const customConfig = require('../util/customConfig');
const astUtil = require('../util/ast');
const groupUtil = require('../util/groupMethods');
const getOption = require('../util/settings');
const parserUtil = require('../util/parser');
const { validZeroRegEx } = require('../util/types/length');
const defaultGroups = require('../config/groups').groups;

// TODO get the correct value of start and end
// TODO make rule fixable when only 1 match
// TODO propose several fixes when multiple matches + priority to exact match

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const UNNECESSARY_ARBITRARY_VALUE_DETECTED_MSG = `The arbitrary class '{{classname}}' should be replaced by '{{presets}}'`;
const UNNECESSARY_ARBITRARY_VALUE_DETECTED_MULTIPLE_MSG = `The arbitrary class '{{classname}}' could be replaced by '{{presets}}'`;

module.exports = {
  meta: {
    docs: {
      description: 'Forbid using arbitrary values in classnames when an equivalent preset exists',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('no-unnecessary-arbitrary-value'),
    },
    messages: {
      unnecessaryArbitraryValueDetected: UNNECESSARY_ARBITRARY_VALUE_DETECTED_MSG,
      unnecessaryArbitraryValueDetectedMultiple: UNNECESSARY_ARBITRARY_VALUE_DETECTED_MULTIPLE_MSG,
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
    const skipClassAttribute = getOption(context, 'skipClassAttribute');
    const tags = getOption(context, 'tags');
    const twConfig = getOption(context, 'config');
    const classRegex = getOption(context, 'classRegex');

    const mergedConfig = customConfig.resolve(twConfig);
    const groups = groupUtil.getGroups(defaultGroups, mergedConfig);
    const configKeys = groupUtil.getGroupConfigKeys(defaultGroups);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Recursive function crawling into child nodes
     * @param {ASTNode} node The root node of the current parsing
     * @param {ASTNode} arg The child node of node
     * @returns {void}
     */
    const parseForArbitraryValues = (node, arg = null) => {
      let start = null;
      let end = null;
      let originalClassNamesValue = null;
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
              parseForArbitraryValues(node, exp);
            });
            arg.quasis.forEach((quasis) => {
              parseForArbitraryValues(node, quasis);
            });
            return;
          case 'ConditionalExpression':
            parseForArbitraryValues(node, arg.consequent);
            parseForArbitraryValues(node, arg.alternate);
            return;
          case 'LogicalExpression':
            parseForArbitraryValues(node, arg.right);
            return;
          case 'ArrayExpression':
            arg.elements.forEach((el) => {
              parseForArbitraryValues(node, el);
            });
            return;
          case 'ObjectExpression':
            const isUsedByClassNamesPlugin = node.callee && node.callee.name === 'classnames';
            const isVue = node.key && node.key.type === 'VDirectiveKey';
            arg.properties.forEach((prop) => {
              const propVal = isUsedByClassNamesPlugin || isVue ? prop.key : prop.value;
              parseForArbitraryValues(node, propVal);
            });
            return;
          case 'Property':
            parseForArbitraryValues(node, arg.key);
            start = arg.range[0] + 1;
            end = arg.range[1] - 1;
            return;
          case 'Literal':
            originalClassNamesValue = arg.value;
            break;
          case 'TemplateElement':
            originalClassNamesValue = arg.value.raw;
            if (originalClassNamesValue === '') {
              return;
            }
            start = arg.range[0];
            end = arg.range[1];
            break;
        }
      }

      const arbitraryRegEx = /^(?<backBone>.*)\[(?<arbitraryValue>.*)\]$/i;
      const { classNames } = astUtil.extractClassnamesFromValue(originalClassNamesValue);
      const arbitraryClassnames = classNames.filter((c) => arbitraryRegEx.test(c));

      if (arbitraryClassnames.length === 0) {
        return;
      }

      const unnecessaryArbitraryClasses = [];
      const existingSubstitutes = [];

      arbitraryClassnames.forEach((arbitraryClass, idx) => {
        const parsed = groupUtil.parseClassname(arbitraryClass, [], mergedConfig, idx);
        const res = arbitraryRegEx.exec(parsed.name);
        if (res && res.groups && res.groups.backBone && res.groups.arbitraryValue) {
          const backBone = res.groups.backBone;
          const arbitraryValue = res.groups.arbitraryValue;
          const groupIdx = groupUtil.getGroupIndex(arbitraryClass, groups, mergedConfig.separator);
          const canBeNegative = groups[groupIdx].indexOf('?<negativeValue>') !== -1;
          const isNegativeClass = parsed.body.indexOf('-') === 0;
          const isNegativeValue = arbitraryValue.indexOf('-') === 0;
          const configurationKey = configKeys[groupIdx];
          const configuration = mergedConfig.theme[configurationKey];
          const configurationKeys = Object.keys(configuration);
          const zeroValueWithOrWithoutUnitsPattern = new RegExp(validZeroRegEx, 'i');
          const isZeroArbitraryValue = zeroValueWithOrWithoutUnitsPattern.test(arbitraryValue);
          const negativeSubstitutes = [];
          const matchingConfigurationKeys = configurationKeys.filter((key) => {
            const configValue = configuration[key];
            if (isZeroArbitraryValue && zeroValueWithOrWithoutUnitsPattern.test(configValue)) {
              // Both config and tested values are 0 based (with or without units)
              negativeSubstitutes.push(false);
              return true;
            }
            // Negative possibilities
            if (canBeNegative) {
              const absoluteValue = isNegativeValue ? arbitraryValue.substring(1) : arbitraryValue;
              const computedAsNegative = isNegativeClass !== isNegativeValue;
              if (`${configValue}` === `${absoluteValue}`) {
                negativeSubstitutes.push(computedAsNegative);
                return true;
              }
              return false;
            }
            // Default
            if (`${configValue}` === `${arbitraryValue}`) {
              negativeSubstitutes.push(false);
              return true;
            }
            return false;
          });
          if (matchingConfigurationKeys.length) {
            unnecessaryArbitraryClasses.push(parsed.name);
            existingSubstitutes.push(
              matchingConfigurationKeys.map((key, idx) => {
                let patchedBody = backBone.substring(parsed.variants.length);
                patchedBody = patchedBody.charAt(0) === '-' ? patchedBody.substring(1) : patchedBody;
                const noneOrMinus = negativeSubstitutes[idx] ? '-' : '';
                return parsed.variants + noneOrMinus + patchedBody + key;
              })
            );
          }
        }
      });

      unnecessaryArbitraryClasses
        .filter((forbiddenClass, idx) => existingSubstitutes[idx].length === 1)
        .forEach((forbiddenClass, idx) => {
          // Fixable arbitrary classname(s)
        });

      const batchForbidden = [];
      const batchSubstitutes = [];
      unnecessaryArbitraryClasses.forEach((forbiddenClass, idx) => {
        if (existingSubstitutes[idx].length === 1) {
          batchForbidden.push(forbiddenClass);
          batchSubstitutes.push(existingSubstitutes[idx]);
        } else {
          context.report({
            node,
            messageId: 'unnecessaryArbitraryValueDetectedMultiple',
            data: {
              classname: forbiddenClass,
              presets: existingSubstitutes[idx].join("' or '"),
            },
          });
        }
      });
      if (batchForbidden.length) {
        let patchedWithSubstitutes = originalClassNamesValue;
        batchForbidden.forEach((needleClass, idx) => {
          patchedWithSubstitutes = patchedWithSubstitutes.replace(needleClass, batchSubstitutes[idx]);
        });
        context.report({
          node,
          messageId: 'unnecessaryArbitraryValueDetected',
          data: {
            classname: batchForbidden.join("', '"),
            presets: batchSubstitutes.join("', '"),
          },
          fix: function (fixer) {
            return fixer.replaceTextRange([start, end], patchedWithSubstitutes);
          },
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
      if (astUtil.isLiteralAttributeValue(node)) {
        parseForArbitraryValues(node);
      } else if (node.value && node.value.type === 'JSXExpressionContainer') {
        parseForArbitraryValues(node, node.value.expression);
      }
    };

    const callExpressionVisitor = function (node) {
      const calleeStr = astUtil.calleeToString(node.callee);
      if (callees.findIndex((name) => calleeStr === name) === -1) {
        return;
      }
      node.arguments.forEach((arg) => {
        parseForArbitraryValues(node, arg);
      });
    };

    const scriptVisitor = {
      JSXAttribute: attributeVisitor,
      TextAttribute: attributeVisitor,
      CallExpression: callExpressionVisitor,
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
          case astUtil.isArrayExpression(node):
            node.value.expression.elements.forEach((arg) => {
              parseForArbitraryValues(node, arg);
            });
            break;
          case astUtil.isObjectExpression(node):
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
