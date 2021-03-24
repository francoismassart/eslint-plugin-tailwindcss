/**
 * @fileoverview Use a consistent orders for the Tailwind CSS classnames, based on property then on variants
 * @author François Massart
 */
'use strict';

const defaultGroups = require('../config/groups').groups;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce a consistent and logical order of the Tailwind CSS classnames',
      category: 'Stylistic Issues',
      recommended: false,
      // url: 
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        prependCustom: {
          default: false,
          type: 'boolean'
        },
        removeDuplicates: {
          default: true,
          type: 'boolean'
        }
      }
    }]
  },

  create: function (context) {

    // variables should be defined here
    /**
     * 1. Group by property
     * 2. Sort each groups based on config
     * 3. Sort elements within group based on:
     *    3.1. size
     *    3.2. theme
     *    3.3. state
     */

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const isClassAttribute = (node) => node.name && /^class(Name)?$/.test(node.name.name);

    const isLitteralAttributeValue = (node) => {
      if (node.value && node.value.type === 'Literal') {
        // No support for dynamic or conditional...
        return !/\{|\?|\}/.test(node.value.value)
      }
      return false;
    };

    const removeDuplicatesFromArray = el => [...new Set(el)];

    const getClassNamesFromAttribute = (attr) => {
      // Fix multiple spaces
      attr.replace(/\s{2,}/g, ' ');
      // Array of unique classNames
      let classesArray = attr.split(' ');
      return classesArray;
    };

    const getGroups = (config) => {
      const groups = [];
      config.forEach(group => {
        // e.g. SIZING or SPACING
        group.members.forEach(prop => {
          // e.g. Width or Padding
          if (typeof prop.members === 'string') {
            // Unique property, like `width` limited to one value
            console.log(`${group.type} > ${prop.type}`);
            groups.push(prop.members);
          } else {
            // Multiple properties, like `padding`, `padding-top`...
            prop.members.forEach(subprop => {
              console.log(`${group.type} > ${prop.type} > ${subprop.type}`);
              groups.push(subprop.members);
            })
          }
        });
      });
      return groups;
    };

    const initGroupSlots = (groups) => {
      const slots = [];
      groups.forEach(g => slots.push([]));
      return slots;
    };

    const getSuffix = (className) => className.split(':').pop();

    const getGroupIndex = (name, arr) => {
      const classSuffix = getSuffix(name);
      let idx = arr.findIndex(pattern => {
        const classRe = new RegExp(`^${pattern}$`);
        return classRe.test(classSuffix)
      }, classSuffix);
      return idx;
    };

    const getPrefixIndex = (str, arr, beginning = false) => {
      const start = beginning ? '^' : '';
      let idx = arr.findIndex(el => {

        const pattern = `${start}${el}\:.*`;
        const re = new RegExp(pattern);
        return re.test(str)
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

    const getSpecificity = (val, arr, beginning = false) => {
      // Index can be -1, 0... Adding 1 for better readability
      return pad(getPrefixIndex(val, arr, beginning) + 1, 2);
    };

    const sortTailwindClasses = (a, b) => {
      const responsiveVariants = ['sm', 'md', 'lg', 'xl', '2xl'];
      const themeVariants = ['dark'];
      const stateVariants = ['hover', 'focus', 'active', 'group-hover', 'group-focus', 'focus-within', 'focus-visible', 'motion-safe', 'motion-reduce', 'disabled', 'visited', 'checked', 'first', 'last', 'odd', 'even'];
      const aIdxStr = `${getSpecificity(a, responsiveVariants, true)}${getSpecificity(a, themeVariants)}${getSpecificity(a, stateVariants)}`;
      const bIdxStr = `${getSpecificity(b, responsiveVariants, true)}${getSpecificity(b, themeVariants)}${getSpecificity(b, stateVariants)}`;
      const aIdx = parseInt(aIdxStr, 10);
      const bIdx = parseInt(bIdxStr, 10);
      if (aIdx < bIdx) {
        return -1;
      }
      if (aIdx > bIdx) {
        return 1;
      }
      return 0;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    const configuration = context.options[0] || {};
    const groupsConfig = configuration.groups || defaultGroups;
    const prependCustom = configuration.prependCustom || false;
    const removeDuplicates = configuration.removeDuplicates || true;
    return {
      HTMLAttribute: function (node) {
        console.info('xoxoxoxox');
        context.report({
          node: node,
          message: 'xoxoxoxoInvalid Tailwind CSS classenames order',
        });
      },
      JSXAttribute: function (node) {
        if (!isClassAttribute(node)) {
          // Only run for class[Name] attributes
          return;
        }
        if (!isLitteralAttributeValue(node)) {
          // No support for dynamic or conditional classnames
          return;
        }

        const originalClassNamesValue = node.value.value;
        let classNames = getClassNamesFromAttribute(originalClassNamesValue);
        if (removeDuplicates) {
          classNames = removeDuplicatesFromArray(classNames);
        }
        if (classNames.length <= 1) {
          // Don't run for a single or empty className
          return;
        }

        // Init assets before sorting
        const groups = getGroups(groupsConfig);
        const sorted = initGroupSlots(groups);
        const extras = [];

        // Move each classname inside its dedicated group
        classNames.forEach(className => {
          const idx = getGroupIndex(className, groups);
          if (idx > -1) {
            sorted[idx].push(className);
            // console.info(`found ${className} in ${groups[idx]}`);
          } else {
            extras.push(className);
          }
        });

        // Sorts each groups' classnames
        sorted.forEach(slot => {
          slot.sort(sortTailwindClasses);
        });

        // Generates the validated/sorted attribute value
        const flatted = sorted.flat();
        const union = prependCustom ? [...extras, ...flatted] : [...flatted, ...extras];
        const validatedClassNamesValue = union.join(' ');
        if (originalClassNamesValue !== validatedClassNamesValue) {
          context.report({
            node: node,
            message: 'Invalid Tailwind CSS classenames order',
            fix: function (fixer) {
              return fixer.replaceText(node.value, `"${validatedClassNamesValue}"`);
            }
          });
        }
      }
    };
  }
};
