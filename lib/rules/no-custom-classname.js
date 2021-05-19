/**
 * @fileoverview Detect classnames which do not belong to Tailwind CSS
 * @author no-custom-classname
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const defaultGroups = require('../config/groups').groups;
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
const CUSTOM_CLASSNAME_DETECTED_MSG = `Classname '{{classname}}' is not a Tailwind CSS class!`;

module.exports = {
  meta: {
    docs: {
      description: 'Detect classnames which do not belong to Tailwind CSS',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-custom-classname'),
    },
    messages: {
      customClassnameDetected: CUSTOM_CLASSNAME_DETECTED_MSG,
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
          config: {
            default: 'tailwind.config.js',
            type: ['string', 'object'],
          },
          whitelist: {
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
    const twConfig = getOption(context, 'config');
    const whitelist = getOption(context, 'whitelist');

    const mergedConfig = customConfig.resolve(twConfig);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const parseForCustomClassNames = (classNames, node) => {
      // Init assets before sorting
      const groups = groupUtil.getGroups(defaultGroups, mergedConfig);

      classNames.forEach((className) => {
        const idx = groupUtil.getGroupIndex(className, groups, mergedConfig.separator);
        const whitelistIdx = groupUtil.getGroupIndex(className, whitelist, mergedConfig.separator);
        if (idx === -1 && whitelistIdx === -1) {
          context.report({
            node,
            messageId: 'customClassnameDetected',
            data: {
              classname: className,
            },
          });
        }
      });
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
        classNames = removeDuplicatesFromArray(classNames);
        if (classNames.length === 0) {
          // Don't run for empty className
          return;
        }

        parseForCustomClassNames(classNames, node);
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
          const raw = quasis.value.raw;
          const singleLineAttr = raw.replace(/\n/g, ' ');
          let classNames = attrUtil.getClassNamesFromAttribute(singleLineAttr);
          classNames = classNames.filter((el) => el !== '');

          classNames = removeDuplicatesFromArray(classNames);
          if (classNames.length === 0) {
            // Don't run for empty className
            return;
          }

          parseForCustomClassNames(classNames, node);
        });
      },
    };
  },
};
