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

var errors = [{
  message: 'Invalid Tailwind CSS classenames order',
}];

ruleTester.run('classnames-order', rule, {

    valid: [
      {
        code: `<div class="container box-content lg:box-border">...</div>`,
      },
    ],

    invalid: [
        {
            code: `<div class="sm:w-6 container w-12">...</div>`,
            output: `<div class="container w-12 sm:w-6">...</div>`,
            errors: errors,
        },
        {
            code: `<div class="sm:py-5 p-4 sm:px-7 lg:p-8">...</div>`,
            output: `<div class="p-4 lg:p-8 sm:py-5 sm:px-7">...</div>`,
            errors: errors,
        },
        {
            code: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16">...</div>`,
            output: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:py-12 md:py-16 sm:px-8">...</div>`,
            errors: errors,
        },
    ],
});
