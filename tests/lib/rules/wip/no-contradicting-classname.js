/**
 * @fileoverview Avoid contradicting Tailwind CSS classnames (e.g. 'w-3 w-5')
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../../lib/rules/no-contradicting-classname");
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

var config = [
  {
    config: {
      mode: "jit",
      theme: {
        aspectRatio: {
          1: "1",
          9: "9",
          16: "16",
        },
        order: {
          "-1": "-1",
          0: "0",
        },
        zIndex: {
          "-1": "-1",
          0: "0",
        },
      },
    },
  },
];

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-contradicting-classname", rule, {
  valid: [
    {
      code: '<div class="p-1 px-2 sm:px-3 sm:pt-0">Accepts shorthands</div>',
      parser: require.resolve("@angular-eslint/template-parser"),
    },
  ],

  invalid: [
    {
      code: '<div class="container w-1 w-2"></div>',
      errors: [
        {
          messageId: "conflictingClassnames",
          data: {
            classnames: "w-1, w-2",
          },
        },
      ],
      parser: require.resolve("@angular-eslint/template-parser"),
    },
  ],
});
