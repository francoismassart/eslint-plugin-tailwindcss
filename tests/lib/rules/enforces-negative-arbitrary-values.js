/**
 * @fileoverview Warns about `-` prefixed classnames using arbitrary values
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/enforces-negative-arbitrary-values");
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

var generateErrors = (classes) => {
  const errors = [];
  classes.split(" ").forEach((cls) =>
    errors.push({
      messageId: "negativeArbitraryValue",
      data: {
        classname: cls,
      },
    })
  );
  return errors;
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("enforces-negative-arbitrary-values", rule, {
  valid: [
    {
      code: `<div class="top-[-50px]">top-[-50px]</div>`,
    },
    {
      code: `<div class={ctl(\`top-[-50px]\`)}>top-[-50px]</div>`,
    },
    {
      code: `<div className={\`top-[-50px]\`}>top-[-50px]</div>`,
    },
    {
      code: `<div className>No errors while typing</div>`,
    },
    {
      code: `
      <div className={\`-top-[-50px] \${ctl('inset-y-[-1px]')}\`}>skipClassAttribute</div>
      `,
      options: skipClassAttributeOptions,
    },
  ],
  invalid: [
    {
      code: `<div class="-inset-[1px] -inset-y-[1px] -inset-x-[1px] -top-[1px] -right-[1px] -bottom-[1px] -left-[1px] -top-[1px] -z-[2] -order-[2] -m-[1px] -my-[1px] -mx-[1px] -mt-[1px] -mr-[1px] -mb-[1px] -ml-[1px] -mt-[1px] -space-y-[1px] -space-x-[1px] -tracking-[1px] -indent-[1px] -hue-rotate-[50%] -backdrop-hue-rotate-[50%] -scale-[50%] -scale-y-[50%] -scale-x-[50%] -rotate-[45deg] -translate-x-[1px] -translate-y-[1px] -skew-x-[45deg] -skew-y-[45deg] -scroll-m-[1px] -scroll-my-[1px] -scroll-mx-[1px] -scroll-mt-[1px] -scroll-mr-[1px] -scroll-mb-[1px] -scroll-ml-[1px] -scroll-mt-[1px]">all</div>`,
      errors: generateErrors(
        "-inset-[1px] -inset-y-[1px] -inset-x-[1px] -top-[1px] -right-[1px] -bottom-[1px] -left-[1px] -top-[1px] -z-[2] -order-[2] -m-[1px] -my-[1px] -mx-[1px] -mt-[1px] -mr-[1px] -mb-[1px] -ml-[1px] -mt-[1px] -space-y-[1px] -space-x-[1px] -tracking-[1px] -indent-[1px] -hue-rotate-[50%] -backdrop-hue-rotate-[50%] -scale-[50%] -scale-y-[50%] -scale-x-[50%] -rotate-[45deg] -translate-x-[1px] -translate-y-[1px] -skew-x-[45deg] -skew-y-[45deg] -scroll-m-[1px] -scroll-my-[1px] -scroll-mx-[1px] -scroll-mt-[1px] -scroll-mr-[1px] -scroll-mb-[1px] -scroll-ml-[1px] -scroll-mt-[1px]"
      ),
    },
    {
      code: `
      <div className={\`-top-[-50px] \${ctl('-inset-y-[1px]')}\`}>skipClassAttribute</div>
      `,
      options: skipClassAttributeOptions,
      errors: generateErrors("-inset-y-[1px]"),
    },
    {
      code: `cva({
        primary: ["-inset-[1px] -inset-y-[1px] -inset-x-[1px] -top-[1px] -right-[1px] -bottom-[1px] -left-[1px] -top-[1px] -z-[2] -order-[2] -m-[1px] -my-[1px] -mx-[1px] -mt-[1px] -mr-[1px] -mb-[1px] -ml-[1px] -mt-[1px] -space-y-[1px] -space-x-[1px] -tracking-[1px] -indent-[1px] -hue-rotate-[50%] -backdrop-hue-rotate-[50%] -scale-[50%] -scale-y-[50%] -scale-x-[50%] -rotate-[45deg] -translate-x-[1px] -translate-y-[1px] -skew-x-[45deg] -skew-y-[45deg] -scroll-m-[1px] -scroll-my-[1px] -scroll-mx-[1px] -scroll-mt-[1px] -scroll-mr-[1px] -scroll-mb-[1px] -scroll-ml-[1px] -scroll-mt-[1px]"]
      });`,
      options: [
        {
          callees: ["cva"],
        },
      ],
      errors: generateErrors(
        "-inset-[1px] -inset-y-[1px] -inset-x-[1px] -top-[1px] -right-[1px] -bottom-[1px] -left-[1px] -top-[1px] -z-[2] -order-[2] -m-[1px] -my-[1px] -mx-[1px] -mt-[1px] -mr-[1px] -mb-[1px] -ml-[1px] -mt-[1px] -space-y-[1px] -space-x-[1px] -tracking-[1px] -indent-[1px] -hue-rotate-[50%] -backdrop-hue-rotate-[50%] -scale-[50%] -scale-y-[50%] -scale-x-[50%] -rotate-[45deg] -translate-x-[1px] -translate-y-[1px] -skew-x-[45deg] -skew-y-[45deg] -scroll-m-[1px] -scroll-my-[1px] -scroll-mx-[1px] -scroll-mt-[1px] -scroll-mr-[1px] -scroll-mb-[1px] -scroll-ml-[1px] -scroll-mt-[1px]"
      ),
    },
    {
      code: `
      <template>
        <div class="-inset-[1px] -inset-y-[1px]" />
      </template>
      `,
      errors: generateErrors("-inset-[1px] -inset-y-[1px]"),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
        <div :class="['-top-[1px]', '-bottom-[1px]']" />
      </template>
      `,
      errors: generateErrors("-top-[1px] -bottom-[1px]"),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
        <div :class="{'-left-[1px]': false, '-top-[1px]': true}" />
      </template>
      `,
      errors: generateErrors("-left-[1px] -top-[1px]"),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
        <div :class="ctl('-my-[1px] -mx-[1px]')" />
      </template>
      `,
      errors: generateErrors("-my-[1px] -mx-[1px]"),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<div class="group/edit:-inset-[1px] group/edit:top-[-1px]">support named group/peer syntax</div>`,
      errors: generateErrors("group/edit:-inset-[1px]"),
    },
    ...(['myTag', 'myTag.subTag', 'myTag(SomeComponent)'].map(tag => ({
      code: `${tag}\`-my-[1px] -mx-[1px]\``,
      errors: generateErrors("-my-[1px] -mx-[1px]"),
      options: [
        {
          tags: ["myTag"],
        },
      ],
    }))),
  ],
});
