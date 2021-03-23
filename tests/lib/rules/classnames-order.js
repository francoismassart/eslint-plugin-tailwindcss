/**
 * @fileoverview Use a consistent orders for the Tailwind CSS classnames, based on property then on variants
 * @author François Massart
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/classnames-order'),

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

var ruleTester = new RuleTester({parserOptions});

ruleTester.run('classnames-order', rule, {

    valid: [
      {
        code: `<div class="container box-content lg:box-border">...</div>`
      }
    ],

    invalid: [
        {
            code: `<div class="sm:w-6 container w-12">...</div>`,
            output: `<div class="container sm:w-6 w-12">...</div>`,
            errors: [{
                message: 'Invalid Tailwind CSS classenames order',
            }]
        }
    ]
});
