/**
 * @fileoverview Detect obsolete classnames when upgrading to Tailwind CSS v3
 * @author François Massart
 */
'use strict';

const docsUrl = require('../util/docsUrl');
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
const CLASSNAME_NOT_NEEDED_MSG = `Classname '{{classnames}}' is not needed in Tailwind CSS v3!`;
const CLASSNAMES_NOT_NEEDED_MSG = `Classnames '{{classnames}}' are not needed in Tailwind CSS v3!`;
const CLASSNAME_CHANGED_MSG = `Classname '{{deprecated}}' should be updated to '{{updated}}' in Tailwind CSS v3!`;
const OPACITY_CLASS_DEPRECATED_MSG = `Classname '{{classname}}' should be replaced by an opacity suffix (eg. '/{{value}}')`;

module.exports = {
  meta: {
    docs: {
      description: 'Detect obsolete classnames when upgrading to Tailwind CSS v3',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('migration-from-tailwind-2'),
    },
    messages: {
      classnameNotNeeded: CLASSNAME_NOT_NEEDED_MSG,
      classnamesNotNeeded: CLASSNAMES_NOT_NEEDED_MSG,
      classnameChanged: CLASSNAME_CHANGED_MSG,
      classnameOpacityDeprecated: OPACITY_CLASS_DEPRECATED_MSG,
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
    const parseForObsoleteClassNames = (node, arg = null) => {
      let originalClassNamesValue = null;
      let start = null;
      let end = null;
      let prefix = '';
      let suffix = '';
      let trim = false;
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
          case 'TemplateLiteral':
            arg.expressions.forEach((exp) => {
              parseForObsoleteClassNames(node, exp);
            });
            arg.quasis.forEach((quasis) => {
              parseForObsoleteClassNames(node, quasis);
            });
            return;
          case 'ConditionalExpression':
            parseForObsoleteClassNames(node, arg.consequent);
            parseForObsoleteClassNames(node, arg.alternate);
            return;
          case 'LogicalExpression':
            parseForObsoleteClassNames(node, arg.right);
            return;
          case 'ArrayExpression':
            arg.elements.forEach((el) => {
              parseForObsoleteClassNames(node, el);
            });
            return;
          case 'ObjectExpression':
            arg.properties.forEach((prop) => {
              parseForObsoleteClassNames(node, prop.key);
            });
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

      const notNeeded = [];
      const outdated = [];
      const deprecatedBgOpacity = [];
      const filtered = classNames.filter((cls) => {
        const suffix = groupUtil.getSuffix(cls, mergedConfig.separator);
        if (/^((backdrop\-)?(filter|transform))$/i.test(suffix)) {
          notNeeded.push(cls);
          return false;
        }
        let overflowRes = /^overflow\-(?<value>clip|ellipsis)$/i.exec(suffix);
        if (overflowRes && overflowRes.groups && overflowRes.groups.value) {
          outdated.push([cls, cls.replace(/overflow\-(clip|ellipsis)$/i, `text-${overflowRes.groups.value}`)]);
        }
        let growShrinkRes = /flex\-(?<prop>grow|shrink)(\-(?<value>${flexVal}))?/i.exec(suffix);
        if (growShrinkRes && growShrinkRes.groups && growShrinkRes.groups.prop) {
          const prop = growShrinkRes.groups.prop;
          const flexVal = growShrinkRes.groups.flexVal;
          const optionalVal = flexVal ? `\-${flexVal}` : '';
          const fixRegex = new RegExp(`flex\-${prop}${optionalVal}`);
          outdated.push([cls, cls.replace(fixRegex, `${prop}${flexVal ? '-' + flexVal : ''}`)]);
        }
        let boxRes = /^decoration\-(?<value>clone|slice)$/i.exec(suffix);
        if (boxRes && boxRes.groups && boxRes.groups.value) {
          const boxVal = boxRes.groups.value;
          const fixRegex = new RegExp(`decoration\-${boxVal}`);
          outdated.push([cls, cls.replace(fixRegex, `box-decoration\-${boxVal}`)]);
        }
        let bgOpacityRes = /^(bg|border|ring)\-opacity\-(?<value>\d{1,})$/i.exec(suffix);
        if (bgOpacityRes && bgOpacityRes.groups && bgOpacityRes.groups.value) {
          const opacityVal = bgOpacityRes.groups.value;
          deprecatedBgOpacity.push([cls, opacityVal]);
        }
        let placeholderRes = /^placeholder\-(?<value>.{1,})$/i.exec(suffix);
        if (placeholderRes && placeholderRes.groups && placeholderRes.groups.value) {
          const placeholderVal = placeholderRes.groups.value;
          const fixPlaceholderRegex = new RegExp(`placeholder\-${placeholderVal}$`);
          outdated.push([cls, cls.replace(fixPlaceholderRegex, `placeholder:text\-${placeholderVal}`)]);
        }
        return true;
      });

      if (notNeeded.length) {
        let validatedClassNamesValue = filtered.join(isSingleLine ? ' ' : '\n');
        validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;
        context.report({
          node,
          messageId: notNeeded.length === 1 ? 'classnameNotNeeded' : 'classnamesNotNeeded',
          data: {
            classnames: notNeeded.join(', '),
          },
          fix: function (fixer) {
            return fixer.replaceTextRange([start, end], validatedClassNamesValue);
          },
        });
      }

      outdated.forEach((outdatedClass) => {
        let validatedClassNamesValue = filtered.join(isSingleLine ? ' ' : '\n');
        validatedClassNamesValue =
          prefix + validatedClassNamesValue.replace(outdatedClass[0], outdatedClass[1]) + suffix;
        context.report({
          node,
          messageId: 'classnameChanged',
          data: {
            deprecated: outdatedClass[0],
            updated: outdatedClass[1],
          },
          fix: function (fixer) {
            return fixer.replaceTextRange([start, end], validatedClassNamesValue);
          },
        });
      });
      deprecatedBgOpacity.forEach((bgClass) => {
        context.report({
          node,
          messageId: 'classnameOpacityDeprecated',
          data: {
            classname: bgClass[0],
            value: bgClass[1],
          },
        });
      });
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    const attributeVisitor = function (node) {
      if (!astUtil.isValidJSXAttribute(node)) {
        return;
      }
      parseForObsoleteClassNames(node);
    };

    const scriptVisitor = {
      JSXAttribute: attributeVisitor,
      TextAttribute: attributeVisitor,
      CallExpression: function (node) {
        if (callees.findIndex((name) => node.callee.name === name) === -1) {
          return;
        }
        node.arguments.forEach((arg) => {
          parseForObsoleteClassNames(node, arg);
        });
      },
      TaggedTemplateExpression: function (node) {
        if (!tags.includes(node.tag.name)) {
          return;
        }
        parseForObsoleteClassNames(node, node.quasi);
      },
    };

    const templateVisitor = {
      VAttribute: function (node) {
        if (!astUtil.isValidVueAttribute(node)) {
          return;
        }
        parseForObsoleteClassNames(node);
      },
    };

    return parserUtil.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
  },
};
