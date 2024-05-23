/**
 * @fileoverview Detect obsolete classnames when upgrading to Tailwind CSS v3
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/migration-from-tailwind-2");
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

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("migration-from-tailwind-2", rule, {
  valid: [
    {
      code: `<div class="scale-50 grayscale backdrop-blur-sm">Automatic transforms and filters</div>`,
    },
    {
      code: `<div class="transition-transform">transition-transform</div>`,
    },
    {
      code: `<div class="transition-[var(--transform)]">transition-[var(--transform)]</div>`,
    },
    {
      code: `<div class>No errors while typing</div>`,
    },
  ],
  invalid: [
    {
      code: `<div class="transform scale-50">Automatic transform</div>`,
      output: `<div class="scale-50">Automatic transform</div>`,
      errors: [
        {
          messageId: "classnameNotNeeded",
          data: {
            classnames: "transform",
          },
        },
      ],
    },
    {
      code: `<div class="backdrop-filter backdrop-blur-sm">Automatic transform</div>`,
      output: `<div class="backdrop-blur-sm">Automatic transform</div>`,
      errors: [
        {
          messageId: "classnameNotNeeded",
          data: {
            classnames: "backdrop-filter",
          },
        },
      ],
    },
    {
      code: `<div class="transform scale-50 filter grayscale backdrop-filter backdrop-blur-sm">Automatic transforms and filters</div>`,
      output: `<div class="scale-50 grayscale backdrop-blur-sm">Automatic transforms and filters</div>`,
      errors: [
        {
          messageId: "classnamesNotNeeded",
          data: {
            classnames: "transform, filter, backdrop-filter",
          },
        },
      ],
    },
    {
      code: `<div class="overflow-clip">overflow-clip/ellipsis</div>`,
      output: `<div class="text-clip">overflow-clip/ellipsis</div>`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "overflow-clip",
            updated: "text-clip",
          },
        },
      ],
    },
    {
      code: `<div class="overflow-ellipsis">overflow-clip/ellipsis</div>`,
      output: `<div class="text-ellipsis">overflow-clip/ellipsis</div>`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "overflow-ellipsis",
            updated: "text-ellipsis",
          },
        },
      ],
    },
    {
      code: `<div class="group/name:overflow-ellipsis">support named group/peer syntax</div>`,
      output: `<div class="group/name:text-ellipsis">support named group/peer syntax</div>`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "group/name:overflow-ellipsis",
            updated: "group/name:text-ellipsis",
          },
        },
      ],
    },
    {
      code: `<div class="flex-grow-0">flex-grow/shrink</div>`,
      output: `<div class="grow-0">flex-grow/shrink</div>`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "flex-grow-0",
            updated: "grow-0",
          },
        },
      ],
    },
    {
      code: `<div class="flex-shrink">flex-grow/shrink</div>`,
      output: `<div class="shrink">flex-grow/shrink</div>`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "flex-shrink",
            updated: "shrink",
          },
        },
      ],
    },
    {
      code: `<div class="decoration-clone">decoration-clone/slice</div>`,
      output: `<div class="box-decoration-clone">decoration-clone/slice</div>`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "decoration-clone",
            updated: "box-decoration-clone",
          },
        },
      ],
    },
    {
      code: `<div class="decoration-slice">decoration-clone/slice</div>`,
      output: `<div class="box-decoration-slice">decoration-clone/slice</div>`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "decoration-slice",
            updated: "box-decoration-slice",
          },
        },
      ],
    },
    {
      code: `<div class="bg-opacity-50">bg-opacity</div>`,
      errors: [
        {
          messageId: "classnameOpacityDeprecated",
          data: {
            classname: "bg-opacity-50",
            value: "50",
          },
        },
      ],
    },
    {
      code: `<div class="ring-opacity-50 border-opacity-50">ring-opacity</div>`,
      errors: [
        {
          messageId: "classnameOpacityDeprecated",
          data: {
            classname: "ring-opacity-50",
            value: "50",
          },
        },
        {
          messageId: "classnameOpacityDeprecated",
          data: {
            classname: "border-opacity-50",
            value: "50",
          },
        },
      ],
    },
    {
      code: `<div class="placeholder-red-900"></div>`,
      output: `<div class="placeholder:text-red-900"></div>`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "placeholder-red-900",
            updated: "placeholder:text-red-900",
          },
        },
      ],
    },
    {
      code: `classnames(["placeholder-red-900"])`,
      output: `classnames(["placeholder:text-red-900"])`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "placeholder-red-900",
            updated: "placeholder:text-red-900",
          },
        },
      ],
    },
    {
      code: `classnames({"placeholder-red-900": true})`,
      output: `classnames({"placeholder:text-red-900": true})`,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "placeholder-red-900",
            updated: "placeholder:text-red-900",
          },
        },
      ],
    },
    {
      code: `
      @if (session()->has('status'))
        <p class="flex flex-shrink">
          {{ session('status') }}
        </p>
      @endif`,
      output: `
      @if (session()->has('status'))
        <p class="flex shrink">
          {{ session('status') }}
        </p>
      @endif`,
      parser: require.resolve("@angular-eslint/template-parser"),
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "flex-shrink",
            updated: "shrink",
          },
        },
      ],
    },
    {
      code: `<div className={\`flex flex-shrink \${ctl('placeholder-red-900')}\`}></div>`,
      output: `<div className={\`flex flex-shrink \${ctl('placeholder:text-red-900')}\`}></div>`,
      options: skipClassAttributeOptions,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "placeholder-red-900",
            updated: "placeholder:text-red-900",
          },
        },
      ],
    },
    {
      code: `
      <template>
        <span class="placeholder-red-900" />
      </template>
      `,
      output: `
      <template>
        <span class="placeholder:text-red-900" />
      </template>
      `,
      options: skipClassAttributeOptions,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "placeholder-red-900",
            updated: "placeholder:text-red-900",
          },
        },
      ],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
      <span :class="['flex-shrink']" />
      </template>
      `,
      output: `
      <template>
      <span :class="['shrink']" />
      </template>
      `,
      options: skipClassAttributeOptions,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "flex-shrink",
            updated: "shrink",
          },
        },
      ],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
      <span :class="{'decoration-slice': false}" />
      </template>
      `,
      output: `
      <template>
      <span :class="{'box-decoration-slice': false}" />
      </template>
      `,
      options: skipClassAttributeOptions,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "decoration-slice",
            updated: "box-decoration-slice",
          },
        },
      ],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
      <span :class="ctl('flex-grow-0')" />
      </template>
      `,
      output: `
      <template>
      <span :class="ctl('grow-0')" />
      </template>
      `,
      options: skipClassAttributeOptions,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "flex-grow-0",
            updated: "grow-0",
          },
        },
      ],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    ...(['myTag', 'myTag.subTag', 'myTag(SomeComponent)'].map(tag => ({
      code: `${tag}\`flex-grow-0\``,
      output: `${tag}\`grow-0\``,
      errors: [
        {
          messageId: "classnameChanged",
          data: {
            deprecated: "flex-grow-0",
            updated: "grow-0",
          },
        },
      ],
      options: [
        {
          tags: ["myTag"],
        },
      ],
    }))),
  ],
});
