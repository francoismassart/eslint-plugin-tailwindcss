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
  valid: [],
  invalid: [
    {
      code: `
      <div class="flex-col cursor-pointer flex">
        <div class="m-0 lg:m-2 md:m-1"></div>
      </div>`,
      output: `
      <div class="flex flex-col cursor-pointer">
        <div class="m-0 md:m-1 lg:m-2"></div>
      </div>`,
      errors: [...errors, ...errors],
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    {
      code: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16">:)</div>`,
      output: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:py-12 sm:px-8 md:py-16">:)</div>`,
      errors: errors,
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    {
      code: `
      <div class="
        flex-col
        cursor-pointer
        flex
      ">
        :)
      </div>`,
      output: `
      <div class="
        flex
        flex-col
        cursor-pointer
      ">
        :)
      </div>`,
      errors: errors,
      parser: require.resolve("@angular-eslint/template-parser"),
      options: [
        {
          groupByResponsive: false,
        },
      ],
    },
  ],
});
