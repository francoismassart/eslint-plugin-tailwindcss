/**
 * @fileoverview Enforces correct arbitrary value syntax (using square brackets)
 * @author Sweet
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/enforces-arbitrary-value-syntax");
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

var defaultOptions = [
  {
    config: {
      theme: {},
      plugins: [],
      separator: ':',
    },
  },
];

var invalidClassnames = [
  'p-10px',
  'mx-15px',
  'leading-20px',
  'text-60px',
  'w-800px',
  'h-100vh',
  'gap-5rem',
  'm-1em',
  'rotate-10deg',
  'delay-500ms',
  'h-0.5px',
  'w-3.7rem',
  'mt-20rpx',
  'pt-1.25vmin',
  'width-5fr',
];

var invalidClassnamesFixed = [
  'p-[10px]',
  'mx-[15px]',
  'leading-[20px]',
  'text-[60px]',
  'w-[800px]',
  'h-[100vh]',
  'gap-[5rem]',
  'm-[1em]',
  'rotate-[10deg]',
  'delay-[500ms]',
  'h-[0.5px]',
  'w-[3.7rem]',
  'mt-[20rpx]',
  'pt-[1.25vmin]',
  'width-[5fr]',
];

var validClassnames = [
  'p-[10px]',
  'mx-[15px]',
  'leading-[20px]',
  'text-[60px]',
  'w-[800px]',
  'p-2',
  'mx-4',
  'text-lg',
  'rounded-md',
  'bg-blue-500',
  'w-1/2',
  'w-full',
  'w-100%',
  'scale-100',
  'opacity-50',
];

var ruleTester = new RuleTester({ parserOptions });
ruleTester.run("enforces-arbitrary-value-syntax", rule, {
  valid: [
    {
      code: `<div className="${validClassnames.join(' ')}"></div>`,
      options: defaultOptions,
    },
    {
      code: `<div class="${validClassnames.join(' ')}"></div>`,
      options: defaultOptions,
    },
    {
      code: `classnames('${validClassnames.join("', '")}')`,
      options: defaultOptions,
    },
    {
      code: `clsx('${validClassnames.join("', '")}')`,
      options: defaultOptions,
    },
    {
      code: `<div className={\`${validClassnames.join(' ')}\`}></div>`,
      options: defaultOptions,
    },
  ],

  invalid: [
    {
      code: `<div className="${invalidClassnames.join(' ')}"></div>`,
      output: `<div className="${invalidClassnamesFixed.join(' ')}"></div>`,
      options: defaultOptions,
      errors: invalidClassnames.map(className => ({
        messageId: 'invalidArbitraryValueSyntax',
        data: {
          classname: className,
          suggestion: invalidClassnamesFixed[invalidClassnames.indexOf(className)],
        },
      })),
    },
    {
      code: `<div class="${invalidClassnames.join(' ')}"></div>`,
      output: `<div class="${invalidClassnamesFixed.join(' ')}"></div>`,
      options: defaultOptions,
      errors: invalidClassnames.map(className => ({
        messageId: 'invalidArbitraryValueSyntax',
        data: {
          classname: className,
          suggestion: invalidClassnamesFixed[invalidClassnames.indexOf(className)],
        },
      })),
    },
    {
      code: `classnames('${invalidClassnames.join("', '")}')`,
      output: `classnames('${invalidClassnamesFixed.join("', '")}')`,
      options: defaultOptions,
      errors: invalidClassnames.map(className => ({
        messageId: 'invalidArbitraryValueSyntax',
        data: {
          classname: className,
          suggestion: invalidClassnamesFixed[invalidClassnames.indexOf(className)],
        },
      })),
    },
    {
      code: `clsx('${invalidClassnames.join("', '")}')`,
      output: `clsx('${invalidClassnamesFixed.join("', '")}')`,
      options: defaultOptions,
      errors: invalidClassnames.map(className => ({
        messageId: 'invalidArbitraryValueSyntax',
        data: {
          classname: className,
          suggestion: invalidClassnamesFixed[invalidClassnames.indexOf(className)],
        },
      })),
    },
    {
      code: `<div className="p-2 ${invalidClassnames[0]} mx-4 ${invalidClassnames[1]} bg-blue-500"></div>`,
      output: `<div className="p-2 ${invalidClassnamesFixed[0]} mx-4 ${invalidClassnamesFixed[1]} bg-blue-500"></div>`,
      options: defaultOptions,
      errors: [
        {
          messageId: 'invalidArbitraryValueSyntax',
          data: {
            classname: invalidClassnames[0],
            suggestion: invalidClassnamesFixed[0],
          },
        },
        {
          messageId: 'invalidArbitraryValueSyntax',
          data: {
            classname: invalidClassnames[1],
            suggestion: invalidClassnamesFixed[1],
          },
        },
      ],
    },
  ],
}); 