/**
 * @fileoverview Rules enforcing best practices while using Tailwind CSS
 * @author François Massart
 */
'use strict';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
var base = __dirname + '/rules/';
module.exports = {
  rules: {
    'classnames-order': require(base + 'classnames-order'),
    'no-contradicting-classname': require(base + 'no-contradicting-classname'),
    'no-custom-classname': require(base + 'no-custom-classname'),
  },
  configs: {
    recommended: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'tailwindcss/classnames-order': 'warn',
        'tailwindcss/no-custom-classname': 'warn',
        'tailwindcss/no-contradicting-classname': 'error',
      },
    },
  },
};
