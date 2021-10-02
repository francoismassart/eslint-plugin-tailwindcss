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
const parserUtil = require('../util/parser');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const INVALID_CLASSNAMES_ORDER_MSG = 'Invalid Tailwind CSS classnames order';

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
    const tags = getOption(context, 'tags');
    const twConfig = getOption(context, 'config');
    const groupsConfig = getOption(context, 'groups');
    const groupByResponsive = getOption(context, 'groupByResponsive');
    const prependCustom = getOption(context, 'prependCustom');
    const removeDuplicates = getOption(context, 'removeDuplicates');

    const mergedConfig = customConfig.resolve(twConfig);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    /**
     * Get the index of a variant within a className
     * @param {String} str The input string (haystack)
     * @param {Array} arr The list of possible variants (needle)
     * @param {Boolean} beginning Optional, starts from the beginning
     * @returns {Number}
     */
    const getPrefixIndex = (str, arr, beginning = false) => {
      const start = beginning ? '^' : '';
      let idx = arr.findIndex((el) => {
        const separator = '\\' + mergedConfig.separator;
        const pattern = `${start}${el}${separator}.*`;
        const re = new RegExp(pattern);
        return re.test(str);
      }, str);
      return idx;
    };

    /**
     * Add left '0' padding to given number
     * @param {Number} num The input number
     * @param {Number} size Optional, the desired length
     * @returns {String}
     */
    const pad = (num, size = 2) => {
      let str = '' + num;
      while (str.length < size) {
        str = '0' + str;
      }
      return str;
    };
    /**
     * Generate an Array of Array, grouping class by responsive variants
     * @param {Array} classNames
     * @returns {Array} an Array (one entry per responsive variant), each entry is an array of classnames
     */
    const getResponsiveGroups = (classNames) => {
      const responsiveVariants = Object.keys(mergedConfig.theme.screens);
      const classnamesByResponsive = [[]];
      responsiveVariants.forEach((prefix) => {
        classnamesByResponsive.push([]);
      });
      classNames.forEach((cls) => {
        const idx = parseInt(getSpecificity(attrUtil.cleanClassname(cls), responsiveVariants, true), 10);
        classnamesByResponsive[idx].push(cls);
      });
      return classnamesByResponsive;
    };

    /**
     * Parse each classname and populate the `sorted` and `extra` arrays
     * @param {Array} classNames
     * @returns {Object} An object with `sorted` and `extra` arrays
     */
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

    /**
     * Get a padded string version of the sorting key
     * @param {String} classname
     * @param {Array} variants
     * @param {Boolean} beginning
     * @returns {String}
     */
    const getSpecificity = (classname, variants, beginning = false) => {
      // Index can be -1, 0... Adding 1 for better readability... -1 becomes 0
      return pad(getPrefixIndex(classname, variants, beginning) + 1, 2);
    };

    /**
     * Sort classnames by using a sorting key
     * @param {String} a A classname
     * @param {String} b Another classname
     * @returns {Number} -1, 0 or +1
     */
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

    /**
     * Recursive function crawling into child nodes
     * @param {ASTNode} node The root node of the current parsing
     * @param {ASTNode} arg The child node of node
     * @returns {void}
     */
    const sortNodeArgumentValue = (node, arg = null) => {
      let originalClassNamesValue = null;
      let start = null;
      let end = null;
      let prefix = '';
      let suffix = '';
      let trim = false;
      if (arg === null) {
        originalClassNamesValue = node.value.value;
        start = node.value.range[0] + 1;
        end = node.value.range[1] - 1;
      } else {
        switch (arg.type) {
          case 'TemplateLiteral':
            arg.expressions.forEach((exp) => {
              sortNodeArgumentValue(node, exp);
            });
            arg.quasis.forEach((quasis) => {
              sortNodeArgumentValue(node, quasis);
            });
            return;
          case 'ConditionalExpression':
            sortNodeArgumentValue(node, arg.consequent);
            sortNodeArgumentValue(node, arg.alternate);
            return;
          case 'LogicalExpression':
            sortNodeArgumentValue(node, arg.right);
            return;
          case 'Literal':
            trim = true;
            originalClassNamesValue = arg.value;
            start = arg.range[0] + 1;
            end = arg.range[1] - 1;
            break;
          case 'TemplateElement':
            originalClassNamesValue = arg.value.raw;
            start = arg.range[0];
            end = arg.range[1];
            // https://github.com/eslint/eslint/issues/13360
            // The problem is that range computation includes the backticks (`test`)
            // but value.raw does not include them, so there is a mismatch.
            // start/end does not include the backticks, therefore it matches value.raw.
            const txt = context.getSourceCode().getText(arg);
            prefix = astUtil.getTemplateElementPrefix(txt, originalClassNamesValue);
            suffix = astUtil.getTemplateElementSuffix(txt, originalClassNamesValue);
            break;
        }
      }

      let classNames = attrUtil.getClassNamesFromAttribute(originalClassNamesValue, trim);
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
        // Don't run sorting for a single or empty className
        return;
      }

      // Sorting
      const mergedSorted = [];
      const mergedExtras = [];
      if (groupByResponsive) {
        const respGroups = getResponsiveGroups(classNames);
        respGroups.forEach((clsGroup) => {
          const { sorted, extras } = getSortedGroups(clsGroup);
          mergedSorted.push(...sorted);
          mergedExtras.push(...extras);
        });
      } else {
        const { sorted, extras } = getSortedGroups(classNames);
        mergedSorted.push(...sorted);
        mergedExtras.push(...extras);
      }

      // Generates the validated/sorted attribute value
      const flatted = mergedSorted.flat();
      const union = prependCustom ? [...mergedExtras, ...flatted] : [...flatted, ...mergedExtras];
      if (before !== null) {
        union.unshift(before);
      }
      if (after !== null) {
        union.push(after);
      }
      let validatedClassNamesValue = union.join(isSingleLine ? ' ' : '\n');
      const originalPatched = isSingleLine ? originalClassNamesValue.trim() : originalClassNamesValue;
      if (originalPatched !== validatedClassNamesValue) {
        validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;
        context.report({
          node: node,
          messageId: 'invalidOrder',
          fix: function (fixer) {
            return fixer.replaceTextRange([start, end], validatedClassNamesValue);
          },
        });
      }
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    const scriptVisitor = {
      JSXAttribute: function (node) {
        if (!astUtil.isValidJSXAttribute(node)) {
          return;
        }
        sortNodeArgumentValue(node);
      },
      CallExpression: function (node) {
        if (callees.findIndex((name) => node.callee.name === name) === -1) {
          return;
        }

        node.arguments.forEach((arg) => {
          sortNodeArgumentValue(node, arg);
        });
      },
      TaggedTemplateExpression: function (node) {
        if (!tags.includes(node.tag.name)) {
          return;
        }

        sortNodeArgumentValue(node, node.quasi);
      },
    };
    const templateVisitor = {
      VAttribute: function (node) {
        if (!astUtil.isValidVueAttribute(node)) {
          return;
        }
        sortNodeArgumentValue(node);
      },
    };

    return parserUtil.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
  },
};
