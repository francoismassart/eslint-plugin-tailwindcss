/**
 * @fileoverview Use a consistent orders for the Tailwind CSS classnames, based on property then on variants
 * @author François Massart
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const customConfig = require('../util/customConfig');
const astUtil = require('../util/ast');
const attrUtil = require('../util/attr');
const groupUtil = require('../util/groupMethods');
const removeDuplicatesFromArray = require('../util/removeDuplicatesFromArray');
const getOption = require('../util/settings');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const INVALID_CLASSNAMES_ORDER_MSG = 'Invalid Tailwind CSS classenames order';

module.exports = {
  meta: {
    docs: {
      description: 'Enforce a consistent and logical order of the Tailwind CSS classnames',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('classnames-order'),
    },
    messages: {
      invalidOrder: INVALID_CLASSNAMES_ORDER_MSG,
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
          config: {
            default: 'tailwind.config.js',
            type: ['string', 'object'],
          },
          groups: {
            type: 'array',
            items: { type: 'object' },
          },
          prependCustom: {
            default: false,
            type: 'boolean',
          },
          removeDuplicates: {
            default: true,
            type: 'boolean',
          },
        },
      },
    ],
  },

  create: function (context) {
    const callees = getOption(context, 'callees');
    const twConfig = getOption(context, 'config');
    const groupsConfig = getOption(context, 'groups');
    const prependCustom = getOption(context, 'prependCustom');
    const removeDuplicates = getOption(context, 'removeDuplicates');

    const mergedConfig = customConfig.resolve(twConfig);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const getPrefixIndex = (str, arr, beginning = false) => {
      const start = beginning ? '^' : '';
      let idx = arr.findIndex((el) => {
        const pattern = `${start}${el}\:.*`;
        const re = new RegExp(pattern);
        return re.test(str);
      }, str);
      return idx;
    };

    const pad = (num, size = 2) => {
      let str = '' + num;
      while (str.length < size) {
        str = '0' + str;
      }
      return str;
    };

    const getSortedGroups = (classNames) => {
      // Init assets before sorting
      const groups = groupUtil.getGroups(groupsConfig, mergedConfig);
      const sorted = groupUtil.initGroupSlots(groups);
      const extras = [];

      // Move each classname inside its dedicated group
      classNames.forEach((className) => {
        const trimmed = className.replace(/\s{1,}/g, '');
        const idx = groupUtil.getGroupIndex(trimmed, groups, mergedConfig.separator);
        if (idx > -1) {
          sorted[idx].push(className);
        } else {
          extras.push(className);
        }
      });

      // Sorts each groups' classnames
      sorted.forEach((slot) => {
        slot.sort(sortTailwindClasses);
      });
      return {
        sorted,
        extras,
      };
    };

    const getSpecificity = (val, arr, beginning = false) => {
      // Index can be -1, 0... Adding 1 for better readability
      return pad(getPrefixIndex(val, arr, beginning) + 1, 2);
    };

    const sortTailwindClasses = (a, b) => {
      const responsiveVariants = Object.keys(mergedConfig.theme.screens);
      const themeVariants = ['dark'];
      // motion-safe/reduce are not present...
      // TODO Check if already present due to custom config overwiting the default `variantOrder`
      const stateVariants = [...mergedConfig.variantOrder, 'motion-safe', 'motion-reduce'];
      const aIdxStr = `${getSpecificity(attrUtil.cleanClassname(a), responsiveVariants, true)}${getSpecificity(
        a,
        themeVariants
      )}${getSpecificity(a, stateVariants)}`;
      const bIdxStr = `${getSpecificity(attrUtil.cleanClassname(b), responsiveVariants, true)}${getSpecificity(
        b,
        themeVariants
      )}${getSpecificity(b, stateVariants)}`;
      const aIdx = parseInt(aIdxStr, 10);
      const bIdx = parseInt(bIdxStr, 10);
      if (aIdx < bIdx) {
        return -1;
      }
      if (aIdx > bIdx) {
        return 1;
      }
      return 0;
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      JSXAttribute: function (node) {
        if (!astUtil.isValidJSXAttribute(node)) {
          return;
        }

        const originalClassNamesValue = node.value.value;
        let classNames = attrUtil.getClassNamesFromAttribute(originalClassNamesValue);
        if (removeDuplicates) {
          classNames = removeDuplicatesFromArray(classNames);
        }
        if (classNames.length <= 1) {
          // Don't run for a single or empty className
          return;
        }

        // Sorting
        const { sorted, extras } = getSortedGroups(classNames);

        // Generates the validated/sorted attribute value
        const flatted = sorted.flat();
        const union = prependCustom ? [...extras, ...flatted] : [...flatted, ...extras];
        const validatedClassNamesValue = union.join(' ');
        if (originalClassNamesValue !== validatedClassNamesValue) {
          context.report({
            node: node,
            messageId: 'invalidOrder',
            fix: function (fixer) {
              return fixer.replaceTextRange(
                [node.value.range[0] + 1, node.value.range[1] - 1],
                validatedClassNamesValue
              );
            },
          });
        }
      },
      CallExpression: function (node) {
        if (callees.findIndex((name) => node.callee.name === name) === -1) {
          return;
        }
        if (node.arguments.length !== 1) {
          return;
        }
        const arg = node.arguments[0];
        if (arg.type !== 'TemplateLiteral' || !arg.quasis.length) {
          return;
        }
        arg.quasis.forEach((quasis) => {
          // Will sort each quasis in isolation
          const originalClassNamesValue = quasis.value.raw;

          let classNames = attrUtil.getClassNamesFromAttribute(originalClassNamesValue);
          const isSingleLine = attrUtil.isSingleLine(originalClassNamesValue);
          let before = null;
          let after = null;

          if (!isSingleLine) {
            const spacesOnly = /^(\s)*$/;
            if (spacesOnly.test(classNames[0])) {
              before = classNames.shift();
            }
            if (spacesOnly.test(classNames[classNames.length - 1])) {
              after = classNames.pop();
            }
          }

          if (removeDuplicates) {
            classNames = removeDuplicatesFromArray(classNames);
          }
          if (classNames.length <= 1) {
            // Don't run for a single or empty className
            return;
          }

          // Sorting
          const { sorted, extras } = getSortedGroups(classNames);

          // Generates the validated/sorted attribute value
          const flatted = sorted.flat();
          const union = prependCustom ? [...extras, ...flatted] : [...flatted, ...extras];
          if (before !== null) {
            union.unshift(before);
          }
          if (after !== null) {
            union.push(after);
          }
          const validatedClassNamesValue = union.join(isSingleLine ? ' ' : '\n');
          if (originalClassNamesValue !== validatedClassNamesValue) {
            const endPos = isSingleLine ? 1 : 2;
            context.report({
              node: node,
              messageId: 'invalidOrder',
              fix: function (fixer) {
                return fixer.replaceTextRange(
                  [quasis.range[0] + 1, quasis.range[1] - endPos],
                  validatedClassNamesValue
                );
              },
            });
          }
        });
      },
    };
  },
};
