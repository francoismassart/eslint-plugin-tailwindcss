/**
 * @fileoverview Detect whether invalid string interpolation is used to generate Tailwind classnames.
 * @author Angelos Athanasakos
 */
'use strict';


const docsUrl = require('../util/docsUrl');


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const INVALID_STRING_INTERPOLATION_MESSAGE = 'Dynamic Tailwind class construction is not allowed. Use conditional classnames instead.';

module.exports = {
  meta: {
    type: 'problem',
    category: 'Best Practices',
    recommended: false,
    url: docsUrl('no-string-interpolation'),
    docs: {
      description: 'Disallow dynamic Tailwind class construction inside class attributes',
    },
    schema: [],
    messages: {
      noInterpolation: INVALID_STRING_INTERPOLATION_MESSAGE,
    },
  },

  create(context) {
    function isClassAttribute(name) {
      return name === 'class' || name === 'className';
    }
    function hasDynamicTailwindConstruction(templateLiteral) {
      const { quasis, expressions } = templateLiteral;

      if (!expressions.length) return false;

      for (let i = 0; i < expressions.length; i++) {
        const before = quasis[i].value.raw;
        const after = quasis[i + 1].value.raw;

        const beforeEndsWithSpace = /\s$/.test(before);
        const afterStartsWithSpace = /^\s/.test(after);

        if (!beforeEndsWithSpace && before !== '') return true;
        if (!afterStartsWithSpace && after !== '') return true;
      }

      return false;
    }

    return {
      JSXAttribute(node) {
        const name = node.name?.name;
        if (!isClassAttribute(name)) return;
        if (!node.value) return;

        if (node.value.type === 'JSXExpressionContainer' && node.value.expression.type === 'TemplateLiteral') {
          if (hasDynamicTailwindConstruction(node.value.expression)) {
            context.report({
              node,
              messageId: 'noInterpolation',
            });
          }
        }
      },
    };
  },
};
