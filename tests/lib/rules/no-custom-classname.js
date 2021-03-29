/**
 * @fileoverview Detect classnames which do not belong to Tailwind CSS
 * @author no-custom-classname
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-custom-classname');
var RuleTester = require('eslint').RuleTester;


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

ruleTester.run('no-custom-classname', rule, {

  valid: [
    {
      code: `<div class="container box-content lg:box-border">Only Tailwind CSS classnames</div>`,
    },
  ],

  invalid: [
    {
      code: `<div class="w-12 my-custom">my-custom is not defined in Tailwind CSS!</div>`,
      errors: [{
        messageId: 'customClassnameDetected',
        data: {
          classname: 'my-custom'
        }
      }]
    },
    {
      code: `<div class="hello world">2 classnames are not defined in Tailwind CSS!</div>`,
      errors: [
        {
          messageId: 'customClassnameDetected',
          data: {
            classname: 'hello'
          }
        },
        {
          messageId: 'customClassnameDetected',
          data: {
            classname: 'world'
          }
        },
      ]
    },
  ]
});
