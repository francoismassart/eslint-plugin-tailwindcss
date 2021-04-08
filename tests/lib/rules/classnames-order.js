/**
 * @fileoverview Use a consistent orders for the Tailwind CSS classnames, based on property then on variants
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/classnames-order");
var RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var parserOptions = {
  ecmaVersion: 2019,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
};

var ruleTester = new RuleTester({ parserOptions });

var errors = [
  {
    messageId: "invalidOrder",
  },
];

ruleTester.run("classnames-order", rule, {
  valid: [
    {
      code: `<div class="container box-content lg:box-border custom">Simple, basic</div>`,
    },
    {
      code: `<div class='box-content lg:box-border'>Simple quotes</div>`,
    },
    {
      code: `<div class="p-5 lg:p-4 md:py-2 sm:px-3 xl:px-6">'p', then 'py' then 'px'</div>`,
    },
    {
      code: `<div class="custom another-custom w-12 lg:w-6">prependCustom: true</div>`,
      options: [
        {
          prependCustom: true,
        },
      ],
    },
    {
      code: `ctl(\`
        container
        flex
        w-12
        sm:w-6
        lg:w-4
      \`)`,
    },
  ],
  invalid: [
    {
      code: `<div class="sm:w-6 container w-12">Classnames will be ordered</div>`,
      output: `<div class="container w-12 sm:w-6">Classnames will be ordered</div>`,
      errors: errors,
    },
    {
      code: `<div class="sm:py-5 p-4 sm:px-7 lg:p-8">Enhancing readability</div>`,
      output: `<div class="p-4 lg:p-8 sm:py-5 sm:px-7">Enhancing readability</div>`,
      errors: errors,
    },
    {
      code: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16">:)</div>`,
      output: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:py-12 md:py-16 sm:px-8">:)</div>`,
      errors: errors,
    },
    {
      code: `<div class="bg-gradient-to-r from-green-400 to-blue-500 focus:from-pink-500 focus:to-yellow-500"></div>`,
      output: `<div class="bg-gradient-to-r from-green-400 focus:from-pink-500 to-blue-500 focus:to-yellow-500"></div>`,
      errors: errors,
    },
    {
      code: `<div class="md:prose-2xl prose-xl prose sm:prose-sm"></div>`,
      output: `<div class="prose prose-xl sm:prose-sm md:prose-2xl"></div>`,
      errors: errors,
    },
    {
      code: `<div class="sm:line-clamp-3 line-clamp-2"></div>`,
      output: `<div class="line-clamp-2 sm:line-clamp-3"></div>`,
      errors: errors,
    },
    {
      code: `<div class='lg:box-border box-content'>Simple quotes</div>`,
      output: `<div class='box-content lg:box-border'>Simple quotes</div>`,
      errors: errors,
    },
    {
      options: [
        {
          removeDuplicates: false,
        },
      ],
      code: `<div class="w-12 lg:w-6 w-12">removeDuplicates: false</div>`,
      output: `<div class="w-12 w-12 lg:w-6">removeDuplicates: false</div>`,
      errors: errors,
    },
    {
      code: `<div class="w-12  lg:w-6   w-12">Multiple spaces</div>`,
      output: `<div class="w-12 lg:w-6">Multiple spaces</div>`,
      errors: errors,
    },
    {
      code: `ctl(\`
        invalid
        sm:w-6
        container
        w-12
        flex
        lg:w-4
      \`);`,
      output: `ctl(\`
        container
        flex
        w-12
        sm:w-6
        lg:w-4
        invalid
      \`);`,
      errors: errors,
    },
  ],
});
