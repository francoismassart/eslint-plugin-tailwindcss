/**
 * @fileoverview Avoid contradicting Tailwind CSS classnames (e.g. "w-3 w-5")
 * @author François Massart
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const defaultGroups = require('../config/groups').groups;
const customConfig = require('../util/customConfig');
const astUtil = require('../util/ast');
const attrUtil = require('../util/attr');
const groupUtil = require('../util/groupMethods');
const getOption = require('../util/settings');
const parserUtil = require('../util/parser');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const CONFLICTING_CLASSNAMES_DETECTED_MSG = `Classnames {{classnames}} are conflicting!`;

module.exports = {
  meta: {
    docs: {
      description: 'Avoid contradicting Tailwind CSS classnames (e.g. "w-3 w-5")',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-contradicting-classname'),
    },
    messages: {
      conflictingClassnames: CONFLICTING_CLASSNAMES_DETECTED_MSG,
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
        },
      },
    ],
  },

  create: function (context) {
    const callees = getOption(context, 'callees');
    const twConfig = getOption(context, 'config');

    const mergedConfig = customConfig.resolve(twConfig);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Parse the classnames and report found conflicts
     * @param {Array} classNames
     * @param {ASTNode} node
     */
    const parseForContradictingClassNames = (classNames, node) => {
      classNames = attrUtil.sanitizeClassnames(classNames);
      // Init assets before sorting
      const groups = groupUtil.getGroups(defaultGroups, mergedConfig);
      const sorted = groupUtil.initGroupSlots(groups);

      // Move each classname inside its dedicated group
      classNames.forEach((className) => {
        const idx = groupUtil.getGroupIndex(className, groups, mergedConfig.separator);
        if (idx > -1) {
          sorted[idx].push(className);
        }
      });

      classNames = sorted.filter((slot) => slot.length > 1);

      // Sorts each groups' classnames
      classNames.forEach((slot) => {
        const variants = [];
        slot.forEach((cls) => {
          const start = cls.lastIndexOf(mergedConfig.separator) + 1;
          const prefix = cls.substr(0, start);
          const name = cls.substr(start);
          const rePrefix = prefix === '' ? '((?!:).)*$' : prefix;
          const idx = variants.findIndex((v) => v.prefix === rePrefix);
          if (idx === -1) {
            variants.push({
              prefix: rePrefix,
              name: [name],
            });
          } else {
            variants[idx].name.push(name);
          }
        });
        const troubles = variants.filter((v) => v.name.length > 1);
        if (troubles.length) {
          troubles.forEach((t) => {
            const re = new RegExp('^' + t.prefix);
            const conflicting = slot.filter((c) => re.test(c));
            context.report({
              node: node,
              messageId: 'conflictingClassnames',
              data: {
                classnames: conflicting.join(', '),
              },
            });
          });
        }
      });
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    const scriptVisitor = {
      JSXAttribute: function (node) {
        if (!astUtil.isValidJSXAttribute(node)) {
          return;
        }
        astUtil.parseNodeRecursive(node, null, parseForContradictingClassNames, true);
      },
      CallExpression: function (node) {
        if (callees.findIndex((name) => node.callee.name === name) === -1) {
          return;
        }
        const allClassnamesForNode = [];
        const pushClasses = (classNames, targetNode) => {
          if (targetNode === null) {
            // Classnames should be parsed in isolation (e.g. conditional expressions)
            parseForContradictingClassNames(classNames, node);
          } else {
            // Gather the classes prior to validation
            allClassnamesForNode.push(...classNames);
          }
        };
        node.arguments.forEach((arg) => {
          astUtil.parseNodeRecursive(node, arg, pushClasses, true);
        });
        parseForContradictingClassNames(allClassnamesForNode, node);
      },
    };

    const templateVisitor = {
      VAttribute: function (node) {
        if (!astUtil.isValidVueAttribute(node)) {
          return;
        }
        astUtil.parseNodeRecursive(node, null, parseForContradictingClassNames, true);
      },
    };

    return parserUtil.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
  },
};
