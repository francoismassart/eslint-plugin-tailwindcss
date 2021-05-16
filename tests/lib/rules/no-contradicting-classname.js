/**
 * @fileoverview Avoid contradicting Tailwind CSS classnames (e.g. 'w-3 w-5')
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-contradicting-classname");
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

ruleTester.run("no-contradicting-classname", rule, {
  valid: [
    {
      code: '<div class="overflow-auto overflow-x-hidden lg:overflow-x-auto lg:dark:overflow-x-visible lg:dark:active:overflow-x-visible active:overflow-auto"></div>',
    },
    {
      code: '<div class="p-1 px-2 sm:px-3 sm:pt-0">Accepts shorthands</div>',
    },
    {
      code: '<div class="p-1 px-2 sm_px-3 sm_pt-0">Still works with different separator</div>',
      options: [
        {
          config: { separator: "_" },
        },
      ],
    },
    {
      code: '<div class="p-[10px] px-2 sm:px-3 sm:pt-[5%]">Still works with different separator</div>',
      options: [
        {
          config: { mode: "jit" },
        },
      ],
    },
    {
      code: '<div class="grid grid-cols-3"></div>',
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
    },
    {
      code: '<div class="container sm_w-3 sm_w-4 lg_w-6"></div>',
      options: [
        {
          config: { separator: "_" },
        },
      ],
      errors: [
        {
          messageId: "conflictingClassnames",
          data: {
            classnames: "sm_w-3, sm_w-4",
          },
        },
      ],
    },
    {
      code: '<div class="flex-1 order-first order-11 sm:order-last flex-none"></div>',
      errors: [
        {
          messageId: "conflictingClassnames",
          data: {
            classnames: "flex-1, flex-none",
          },
        },
        {
          messageId: "conflictingClassnames",
          data: {
            classnames: "order-first, order-11",
          },
        },
      ],
    },
    {
      code: `
      ctl(\`
        invalid bis
        sm:w-6
        w-8
        container
        w-12
        flex
        lg:w-4
      \`);`,
      errors: [
        {
          messageId: "conflictingClassnames",
          data: {
            classnames: "w-8, w-12",
          },
        },
      ],
    },
    {
      code: '<div class="container sm:w-3 sm:w-[40%] lg:w-6"></div>',
      options: [
        {
          config: { mode: "jit" },
        },
      ],
      errors: [
        {
          messageId: "conflictingClassnames",
          data: {
            classnames: "sm:w-3, sm:w-[40%]",
          },
        },
      ],
    },
    {
      code: `<div className={clsx(\`container sm:w-3 sm:w-2 lg:w-6\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
      errors: [
        {
          messageId: "conflictingClassnames",
          data: {
            classnames: "sm:w-3, sm:w-2",
          },
        },
      ],
    },
  ],
});
