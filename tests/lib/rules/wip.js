/**
 * @fileoverview Detect classnames which do not belong to Tailwind CSS
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-custom-classname");
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

const skipClassAttributeOptions = [
  {
    skipClassAttribute: true,
    config: {
      theme: {},
      plugins: [],
    },
  },
];
var generateErrors = (classnames) => {
  const errors = [];
  if (typeof classnames === "string") {
    classnames = classnames.split(" ");
  }
  classnames.map((classname) => {
    errors.push({
      messageId: "customClassnameDetected",
      data: {
        classname: classname,
      },
    });
  });
  return errors;
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-custom-classname", rule, {
  valid: [],

  invalid: [
    {
      code: `
      <script>
      export default {
        data() {
          return {
            aClass: 'active',
            bClass: 'text-danger',
            cClass: ctl('tw-c-class')
          }
        }
      }
      </script>
      <template>
        <span class="tw-unknown-class" />
        <span :class="['tw-unknown-class', 'tw-unknown-class-two', aClass]" />
        <span :class="{'tw-unknown-class-key': true, 'tw-unknown-class-key-one tw-unknown-class-key-two': false}" />
        <span :class="ctl('tw-template-ctl')" />
      </template>
      `,
      options: [
        {
          config: {
            prefix: "tw-",
            theme: {
              extend: {},
            },
          },
        },
      ],
      errors: generateErrors(
        "tw-c-class tw-unknown-class tw-unknown-class tw-unknown-class-two tw-unknown-class-key tw-unknown-class-key-one tw-unknown-class-key-two tw-template-ctl"
      ),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
  ],
});
