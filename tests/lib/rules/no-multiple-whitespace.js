/**
 * @fileoverview Requires exactly one space between each class
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-multiple-whitespace");
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

var generateError = () => {
  return {
    messageId: "multipleWhitespaceDetected",
  };
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("multiple whitespace", rule, {
  valid: [
    {
      code: `
      <div class="overflow-x-auto overflow-y-scroll"></div>
      `,
    },
    {
      code: `
      <span class="bg-red-50 text-xl"></span>
      `,
    },
    {
      code: `
      ctl(\`
        sm:w-6
        container
        w-12
        flex
        lg:w-4
      \`);`,
    },
  ],

  invalid: [
    {
      code: `
      <div class="overflow-x-auto   overflow-y-auto block md:p-0 px-0 py-[0]"></div>
      `,
      output: `
      <div class="overflow-x-auto overflow-y-auto block md:p-0 px-0 py-[0]"></div>
      `,
      errors: [generateError()],
    },

    {
      code: `
      <div class="bg-red-400 overflow-y-auto  block   md:p-0  px-0  py-[0]"></div>
      `,
      output: `
      <div class="bg-red-400 overflow-y-auto block md:p-0 px-0 py-[0]"></div>
      `,
      errors: [generateError()],
    },

    {
      code: `
      <div class=" overflow-x-auto overflow-y-auto block md:p-0 px-0 py-[0] "></div>
      `,
      output: `
      <div class="overflow-x-auto overflow-y-auto block md:p-0 px-0 py-[0]"></div>
      `,
      errors: [generateError()],
    },

    {
      code: `
      <div class="    bg-red-400 overflow-y-auto  block   md:p-0  px-0  py-[0]     "></div>
      `,
      output: `
      <div class="bg-red-400 overflow-y-auto block md:p-0 px-0 py-[0]"></div>
      `,
      errors: [generateError()],
    },

    {
      code: `
      <span class="  @container  bg-blue-100     text-xl sm:text-lg   md:text-2xl  lg:text-[14px] "></span>
      `,
      output: `
      <span class="@container bg-blue-100 text-xl sm:text-lg md:text-2xl lg:text-[14px]"></span>
      `,
      errors: [generateError()],
    },

    {
      code: `
      <template><div class="bg-red-400  flex     flex-col"></div></template>
      `,
      output: `
      <template><div class="bg-red-400 flex flex-col"></div></template>
      `,
      errors: [generateError()],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },

    {
      code: `
      <template><div :class="[true ? 'bg-red-400  flex     flex-col' : '']"></div></template>
      `,
      output: `
      <template><div :class="[true ? 'bg-red-400 flex flex-col' : '']"></div></template>
      `,
      errors: [generateError()],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },

    {
      code: `
      <template><div :class="{'bg-red-400  flex     flex-col' : true}"></div></template>
      `,
      output: `
      <template><div :class="{'bg-red-400 flex flex-col' : true}"></div></template>
      `,
      errors: [generateError()],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
  ],
});
