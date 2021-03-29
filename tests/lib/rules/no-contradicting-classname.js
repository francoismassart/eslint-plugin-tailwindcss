/**
 * @fileoverview Avoid contradicting Tailwind CSS classnames (e.g. 'w-3 w-5')
 * @author François Massart
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-contradicting-classname'),

  RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var parserOptions = {
  ecmaVersion: 2019,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run('no-contradicting-classname', rule, {

  valid: [
    {
      code: '<div class="overflow-auto overflow-x-hidden lg:overflow-x-auto lg:dark:overflow-x-visible lg:dark:active:overflow-x-visible active:overflow-auto"></div>',
    },
    {
      code: '<div class="p-1 px-2 sm:px-3 sm:pt-0">Accepts shorthands</div>',
    },
  ],

  invalid: [
    {
      code: '<div class="container w-1 w-2"></div>',
      errors: [
        {
          messageId: 'conflictingClassnames',
          data: {
            classnames: 'w-1, w-2'
          }
        }
      ]
    },
    {
      code: '<div class="flex-1 order-first order-11 sm:order-last flex-none "></div>',
      errors: [
        {
          messageId: 'conflictingClassnames',
          data: {
            classnames: 'flex-1, flex-none'
          }
        },
        {
          messageId: 'conflictingClassnames',
          data: {
            classnames: 'order-first, order-11'
          }
        },
      ]
    },
  ]
});
