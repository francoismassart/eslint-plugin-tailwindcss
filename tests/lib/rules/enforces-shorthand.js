/**
 * @fileoverview Detect classname candidates for shorthand replacement
 * @description E.g. `mx-4 my-4` can be replaced by `m-4`
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/enforces-shorthand");
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

const incompleteCustomWidthHeightOptions = [
  {
    config: {
      theme: {
        extend: {
          width: { custom: "100px" },
          height: { custom: "100px" },
        },
      },
      plugins: [],
    },
  },
];

const customSpacingOnlyOptions = [
  {
    config: {
      theme: {
        extend: {
          spacing: { custom: "100px" },
        },
      },
      plugins: [],
    },
  },
];

const customSizeOnlyOptions = [
  {
    config: {
      theme: {
        extend: {
          size: { size: "100px" },
        },
      },
      plugins: [],
    },
  },
];

const ambiguousOptions = [
  {
    config: {
      theme: {
        extend: {
          width: { ambiguous: "75px" },
          height: { ambiguous: "120px" },
          size: { ambiguous: "100px" },
        },
      },
      plugins: [],
    },
  },
];

var generateError = (classnames, shorthand) => {
  return {
    messageId: "shorthandCandidateDetected",
    data: {
      classnames: classnames.join(", "),
      shorthand: shorthand,
    },
  };
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("shorthands", rule, {
  valid: [
    {
      code: `
      <div class="overflow-x-auto overflow-y-scroll">
        No shorthand possible for overflow
      </div>
      `,
    },
    {
      code: `
      <div class="overscroll-x-auto overscroll-y-none">
        No shorthand possible for overscroll
      </div>
      `,
    },
    {
      code: `
      <div class="mt-0 mr-1 mb-3 ml-4">
        No shorthand possible for margin
      </div>
      `,
    },
    {
      code: `
      <div class="top-[0] right-[50%] bottom-[10px] left-[var(--some-value)]">
        No shorthand possible for inset
      </div>`,
    },
    {
      code: `
      <div class="top-[0] right-0 bottom-0 left-[0]">
        Cannot merge mixed values (arbitrary + regular)
      </div>`,
    },
    {
      code: `
      <div class="grid gap-x-8 gap-y-4 grid-cols-3">
        No shorthand possible for gap
      </div>`,
    },
    {
      code: `<img class="scale-x-75 -scale-y-75" />`,
    },
    {
      code: `<div class="px-16 pt-48 pb-16"></div>`,
    },
    {
      code: `<div className="py-2.5 md:py-3 pl-2.5 md:pl-4 font-medium uppercase">issue #91</div>`,
    },
    {
      code: `<div class>No errors while typing</div>`,
    },
    {
      code: `
      <div className={"px-0 py-[0]"}>skipClassAttribute</div>
      `,
      options: skipClassAttributeOptions,
    },
    {
      code: `
      <div class="group/name:rounded-r-full rounded-l-full">
        support named group/peer syntax
      </div>
      `,
    },
    {
      code: `
      <div class="overflow-hidden text-ellipsis hover:whitespace-nowrap">
        Possible shorthand available for truncate, but some of the classes have modifiers
      </div>
      `,
    },
    {
      code: `
      <div class="overflow-hidden text-ellipsis !whitespace-nowrap">
        Possible shorthand available for truncate, but some of the classes have important
      </div>
      `,
    },
    {
      code: "<div className={`absolute inset-y-0 left-0 w-1/3 rounded-[inherit] shadow-lg ${className}`}>issue #312</div>",
    },
    {
      code: "<div className={'w-screen h-screen'}>issue #307</div>",
    },
    {
      code: `<div class="h-custom w-custom">Incomplete config should not use size-*</div>`,
      options: incompleteCustomWidthHeightOptions,
    },
    {
      code: `<div class="h-custom w-custom">Ambiguous cannot size-*</div>`,
      options: ambiguousOptions,
    },
    {
      code: `<div class="h-custom w-custom">h-custom & w-custom don't exist... no size-*</div>`,
      options: customSizeOnlyOptions,
    },
  ],

  invalid: [
    {
      code: `
      <div class="overflow-x-auto overflow-y-auto block md:p-0 px-0 py-[0]">
        Possible shorthand for overflow
      </div>
      `,
      output: `
      <div class="overflow-auto block md:p-0 px-0 py-[0]">
        Possible shorthand for overflow
      </div>
      `,
      errors: [generateError(["overflow-x-auto", "overflow-y-auto"], "overflow-auto")],
    },
    {
      code: `
      <div class="overscroll-x-contain overscroll-y-contain block md:p-0 px-0 py-[0]">
        Possible shorthand for overscroll
      </div>
      `,
      output: `
      <div class="overscroll-contain block md:p-0 px-0 py-[0]">
        Possible shorthand for overscroll
      </div>
      `,
      errors: [generateError(["overscroll-x-contain", "overscroll-y-contain"], "overscroll-contain")],
    },
    {
      code: `
      <div class="mt-0 mr-0 mb-0 ml-1">
        Possible shorthand for margin
      </div>
      `,
      output: `
      <div class="my-0 mr-0 ml-1">
        Possible shorthand for margin
      </div>
      `,
      errors: [generateError(["mt-0", "mb-0"], "my-0")],
    },
    {
      code: `
      <div class="-mt-1 -mr-1 -mb-1 ml-0">
        Possible shorthand for negative margin
      </div>
      `,
      output: `
      <div class="-my-1 -mr-1 ml-0">
        Possible shorthand for negative margin
      </div>
      `,
      errors: [generateError(["-mt-1", "-mb-1"], "-my-1")],
    },
    {
      code: `
      <div class="mt-0 mr-0 mb-0 ml-1 md:mx-2 md:my-2 py-0 px-0 block">
        Possible shorthand for margin
      </div>
      `,
      output: `
      <div class="my-0 mr-0 ml-1 md:m-2 p-0 block">
        Possible shorthand for margin
      </div>
      `,
      errors: [
        generateError(["mt-0", "mb-0"], "my-0"),
        generateError(["md:mx-2", "md:my-2"], "md:m-2"),
        generateError(["py-0", "px-0"], "p-0"),
      ],
    },
    {
      code: `
      <div class="rounded-tl-sm rounded-tr-sm rounded-br-lg rounded-bl-xl md:rounded-t-md md:rounded-b-md">
        Possible shorthand for border-radius
      </div>
      `,
      output: `
      <div class="rounded-t-sm rounded-br-lg rounded-bl-xl md:rounded-md">
        Possible shorthand for border-radius
      </div>
      `,
      errors: [
        generateError(["rounded-tl-sm", "rounded-tr-sm"], "rounded-t-sm"),
        generateError(["md:rounded-t-md", "md:rounded-b-md"], "md:rounded-md"),
      ],
    },
    {
      code: `
      <div class="rounded-tl rounded-tr rounded-b">
        Possible shorthand for border-radius
      </div>
      `,
      output: `
      <div class="rounded">
        Possible shorthand for border-radius
      </div>
      `,
      errors: [generateError(["rounded-tl", "rounded-tr", "rounded-b"], "rounded")],
    },
    {
      code: `
      <div class="rounded-tl-sm rounded-tr-sm rounded-b-sm">
        Possible shorthand for border-radius
      </div>
      `,
      output: `
      <div class="rounded-sm">
        Possible shorthand for border-radius
      </div>
      `,
      errors: [generateError(["rounded-tl-sm", "rounded-tr-sm", "rounded-b-sm"], "rounded-sm")],
    },
    {
      code: `
      <div class="rounded-tl-sm rounded-tr-sm rounded-br-lg rounded-bl-xl">
        Possible shorthand for border-radius
      </div>
      `,
      output: `
      <div class="rounded-t-sm rounded-br-lg rounded-bl-xl">
        Possible shorthand for border-radius
      </div>
      `,
      errors: [generateError(["rounded-tl-sm", "rounded-tr-sm"], "rounded-t-sm")],
    },
    {
      code: `
      <div class="rounded-tl-sm rounded-tr-sm rounded-br-lg rounded-bl-xl md:rounded-t-md md:rounded-b-md">
        Possible shorthand for border-radius
      </div>
      `,
      output: `
      <div class="rounded-t-sm rounded-br-lg rounded-bl-xl md:rounded-md">
        Possible shorthand for border-radius
      </div>
      `,
      errors: [
        generateError(["rounded-tl-sm", "rounded-tr-sm"], "rounded-t-sm"),
        generateError(["md:rounded-t-md", "md:rounded-b-md"], "md:rounded-md"),
      ],
    },
    {
      code: `
      <div class="border-t-4 border-r-4 border-b-4 border-l-0 md:border-t-0 md:border-b-0 md:border-r-0 lg:border-y lg:border-l lg:border-r">
        Possible shorthand for border-width
      </div>
      `,
      output: `
      <div class="border-y-4 border-r-4 border-l-0 md:border-y-0 md:border-r-0 lg:border">
        Possible shorthand for border-width
      </div>
      `,
      errors: [
        generateError(["border-t-4", "border-b-4"], "border-y-4"),
        generateError(["md:border-t-0", "md:border-b-0"], "md:border-y-0"),
        generateError(["lg:border-y", "lg:border-l", "lg:border-r"], "lg:border"),
      ],
    },
    {
      code: `
      <div class="border-t-4 border-r-4 border-b-4 border-l-0">
        Possible shorthand for border-width
      </div>
      `,
      output: `
      <div class="border-y-4 border-r-4 border-l-0">
        Possible shorthand for border-width
      </div>
      `,
      errors: [generateError(["border-t-4", "border-b-4"], "border-y-4")],
    },
    {
      code: `
      <div class="top-[0] right-[var(--some-value)] bottom-[0] left-[var(--some-value)]">
        No shorthand possible
      </div>`,
      output: `
      <div class="inset-y-[0] inset-x-[var(--some-value)]">
        No shorthand possible
      </div>`,
      errors: [
        generateError(["top-[0]", "bottom-[0]"], "inset-y-[0]"),
        generateError(["right-[var(--some-value)]", "left-[var(--some-value)]"], "inset-x-[var(--some-value)]"),
      ],
    },
    {
      code: `
      <div class="rounded-tr-sm border-r-4 block rounded-br-lg rounded-bl-xl md:rounded-b-md border-t-4 rounded-tl-sm border-b-4 border-l-0 md:rounded-t-md">
        Randomized classnames order
      </div>
      `,
      output: `
      <div class="rounded-t-sm border-r-4 block rounded-br-lg rounded-bl-xl md:rounded-md border-y-4 border-l-0">
        Randomized classnames order
      </div>
      `,
      errors: [
        generateError(["rounded-tr-sm", "rounded-tl-sm"], "rounded-t-sm"),
        generateError(["md:rounded-b-md", "md:rounded-t-md"], "md:rounded-md"),
        generateError(["border-t-4", "border-b-4"], "border-y-4"),
      ],
    },
    {
      code: `
      <div class="grid gap-x-4 gap-y-4 grid-cols-3">
        Possible shorthand for gap
      </div>`,
      output: `
      <div class="grid gap-4 grid-cols-3">
        Possible shorthand for gap
      </div>`,
      errors: [generateError(["gap-x-4", "gap-y-4"], "gap-4")],
    },
    {
      code: `
      <div class="border-4 border-t-indigo-200/50 border-x-indigo-200/50 border-b-indigo-200/50">
        Possible shorthand for border-color
      </div>`,
      output: `
      <div class="border-4 border-indigo-200/50">
        Possible shorthand for border-color
      </div>`,
      errors: [
        generateError(
          ["border-t-indigo-200/50", "border-x-indigo-200/50", "border-b-indigo-200/50"],
          "border-indigo-200/50"
        ),
      ],
    },
    {
      code: `<img class="scale-x-75 scale-y-75" />`,
      output: `<img class="scale-75" />`,
      errors: [generateError(["scale-x-75", "scale-y-75"], "scale-75")],
    },
    {
      code: `<img className={\`scale-x-75 scale-y-75\`} />`,
      output: `<img className={\`scale-75\`} />`,
      errors: [generateError(["scale-x-75", "scale-y-75"], "scale-75")],
    },
    {
      code: `<img class="-scale-x-50 -scale-y-50" />`,
      output: `<img class="-scale-50" />`,
      errors: [generateError(["-scale-x-50", "-scale-y-50"], "-scale-50")],
    },
    {
      code: `
      <div className={ctl(\`
        py-8
        px-8
        w-48
        h-48
        text-white
        bg-black/50
        hover:bg-black/70
        rounded-full
        border-2
        border-white
        transition
        cursor-pointer
      \`)}>
        Multilines
      </div>`,
      output: `
      <div className={ctl(\`
        p-8
        size-48
        text-white
        bg-black/50
        hover:bg-black/70
        rounded-full
        border-2
        border-white
        transition
        cursor-pointer
      \`)}>
        Multilines
      </div>`,
      errors: [generateError(["w-48", "h-48"], "size-48"), generateError(["py-8", "px-8"], "p-8")],
    },
    {
      code: `classnames(['py-8 px-8 w-48 h-48 text-white'])`,
      output: `classnames(['p-8 size-48 text-white'])`,
      errors: [generateError(["w-48", "h-48"], "size-48"), generateError(["py-8", "px-8"], "p-8")],
    },
    {
      code: `classnames({'py-8 px-8 text-white': true})`,
      output: `classnames({'p-8 text-white': true})`,
      errors: [generateError(["py-8", "px-8"], "p-8")],
    },
    {
      code: `classnames({'!py-8 !px-8 text-white': true})`,
      output: `classnames({'!p-8 text-white': true})`,
      errors: [generateError(["!py-8", "!px-8"], "!p-8")],
    },
    {
      code: `classnames({'!pt-8 !pb-8 pr-8 !pl-8': true})`,
      output: `classnames({'!py-8 pr-8 !pl-8': true})`,
      errors: [generateError(["!pt-8", "!pb-8"], "!py-8")],
    },
    {
      code: `classnames({'!pt-8 !pb-8 !pr-8 !pl-8': true})`,
      output: `classnames({'!p-8': true})`,
      errors: [generateError(["!pt-8", "!pb-8", "!pr-8", "!pl-8"], "!p-8")],
    },
    {
      code: `classnames({'!pt-8 pb-8 pr-8 pl-8': true})`,
      output: `classnames({'!pt-8 pb-8 px-8': true})`,
      errors: [generateError(["pr-8", "pl-8"], "px-8")],
    },
    {
      code: `classnames({'md:!rounded-tr block md:rounded-tl md:rounded-br md:rounded-bl': true})`,
      output: `classnames({'md:!rounded-tr block md:rounded-tl md:rounded-b': true})`,
      errors: [generateError(["md:rounded-br", "md:rounded-bl"], "md:rounded-b")],
    },
    {
      code: `
      <div class="rounded-r-full rounded-l-full">
        Issue #120
      </div>
      `,
      output: `
      <div class="rounded-full">
        Issue #120
      </div>
      `,
      errors: [generateError(["rounded-r-full", "rounded-l-full"], "rounded-full")],
    },
    {
      code: `classnames('sfc-border-l-0 sfc-border-r-0')`,
      output: `classnames('sfc-border-x-0')`,
      options: [
        {
          config: { prefix: "sfc-" },
        },
      ],
      errors: [generateError(["sfc-border-l-0", "sfc-border-r-0"], "sfc-border-x-0")],
    },
    {
      code: `classnames('md_sfc-border-l-0 md_sfc-border-r-0')`,
      output: `classnames('md_sfc-border-x-0')`,
      options: [
        {
          config: { prefix: "sfc-", separator: "_" },
        },
      ],
      errors: [generateError(["md_sfc-border-l-0", "md_sfc-border-r-0"], "md_sfc-border-x-0")],
    },
    {
      code: `
      <div class="border-spacing-x-px border-spacing-y-px">
        Issue #148
      </div>
      `,
      output: `
      <div class="border-spacing-px">
        Issue #148
      </div>
      `,
      errors: [generateError(["border-spacing-x-px", "border-spacing-y-px"], "border-spacing-px")],
    },
    {
      code: `
      <div className={\`mr-px ml-px \${ctl('mt-0 mb-0')}\`}>skipClassAttribute</div>
      `,
      output: `
      <div className={\`mr-px ml-px \${ctl('my-0')}\`}>skipClassAttribute</div>
      `,
      options: skipClassAttributeOptions,
      errors: [generateError(["mt-0", "mb-0"], "my-0")],
    },
    {
      code: `
      <div class="p-2 pl-2 pr-2">
        Issue #182
      </div>
      `,
      output: `
      <div class="p-2">
        Issue #182
      </div>
      `,
      errors: [generateError(["p-2", "pl-2", "pr-2"], "p-2")],
    },
    {
      code: `cva({
          primary: ["border-l-0 border-r-0"],
        });`,
      output: `cva({
          primary: ["border-x-0"],
        });`,
      options: [
        {
          callees: ["cva"],
        },
      ],
      errors: [generateError(["border-l-0", "border-r-0"], "border-x-0")],
    },
    {
      code: `
      <template>
        <div class="overflow-x-auto overflow-y-auto block md:p-0 px-0 py-[0]">
          Possible shorthand for overflow
        </div>
      </template>
      `,
      output: `
      <template>
        <div class="overflow-auto block md:p-0 px-0 py-[0]">
          Possible shorthand for overflow
        </div>
      </template>
      `,
      errors: [generateError(["overflow-x-auto", "overflow-y-auto"], "overflow-auto")],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
        <div :class="['overscroll-x-contain overscroll-y-contain block', 'md:p-0 px-0 py-[0]']">
          Possible shorthand for overscroll
        </div>
      </template>
      `,
      output: `
      <template>
        <div :class="['overscroll-contain block', 'md:p-0 px-0 py-[0]']">
          Possible shorthand for overscroll
        </div>
      </template>
      `,
      errors: [generateError(["overscroll-x-contain", "overscroll-y-contain"], "overscroll-contain")],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
        <div :class="{'mt-0 mr-0 mb-0 ml-1': true}">
          Possible shorthand for margin
        </div>
      </template>
      `,
      output: `
      <template>
        <div :class="{'my-0 mr-0 ml-1': true}">
          Possible shorthand for margin
        </div>
      </template>
      `,
      errors: [generateError(["mt-0", "mb-0"], "my-0")],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
        <div :class="ctl('-mt-1 -mr-1 -mb-1 ml-0')">
          Possible shorthand for negative margin
        </div>
      </template>
      `,
      output: `
      <template>
        <div :class="ctl('-my-1 -mr-1 ml-0')">
          Possible shorthand for negative margin
        </div>
      </template>
      `,
      errors: [generateError(["-mt-1", "-mb-1"], "-my-1")],
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <div class="group/name:rounded-r-full group/name:rounded-l-full">
        support named group/peer syntax
      </div>
      `,
      output: `
      <div class="group/name:rounded-full">
        support named group/peer syntax
      </div>
      `,
      errors: [generateError(["group/name:rounded-r-full", "group/name:rounded-l-full"], "group/name:rounded-full")],
    },
    {
      code: `
      <div class="overflow-hidden text-ellipsis whitespace-nowrap">
        Possible shorthand when using truncate
      </div>
      `,
      output: `
      <div class="truncate">
        Possible shorthand when using truncate
      </div>
      `,
      errors: [generateError(["overflow-hidden", "text-ellipsis", "whitespace-nowrap"], "truncate")],
    },
    {
      code: `
      <div class="md:overflow-hidden md:text-ellipsis md:whitespace-nowrap">
        Possible shorthand when using truncate with breakpoint
      </div>
      `,
      output: `
      <div class="md:truncate">
        Possible shorthand when using truncate with breakpoint
      </div>
      `,
      errors: [generateError(["md:overflow-hidden", "md:text-ellipsis", "md:whitespace-nowrap"], "md:truncate")],
    },
    {
      code: `
      <div class="hover:overflow-hidden hover:text-ellipsis hover:whitespace-nowrap">
        Possible shorthand when using truncate with hover
      </div>
      `,
      output: `
      <div class="hover:truncate">
        Possible shorthand when using truncate with hover
      </div>
      `,
      errors: [
        generateError(["hover:overflow-hidden", "hover:text-ellipsis", "hover:whitespace-nowrap"], "hover:truncate"),
      ],
    },
    {
      code: `
      <div class="hover:sm:!tw-overflow-hidden hover:sm:!tw-text-ellipsis hover:sm:!tw-whitespace-nowrap">
        Possible shorthand when using truncate with hover, breakpoint, important and prefix
      </div>
      `,
      output: `
      <div class="hover:sm:!tw-truncate">
        Possible shorthand when using truncate with hover, breakpoint, important and prefix
      </div>
      `,
      errors: [
        generateError(
          ["hover:sm:!tw-overflow-hidden", "hover:sm:!tw-text-ellipsis", "hover:sm:!tw-whitespace-nowrap"],
          "hover:sm:!tw-truncate"
        ),
      ],
      options: [
        {
          config: { prefix: "tw-" },
        },
      ],
    },
    {
      code: `
      <div class="overflow-hidden text-ellipsis whitespace-nowrap text-white text-xl">
        Possible shorthand when using truncate, tested with additional classnames
      </div>
      `,
      output: `
      <div class="truncate text-white text-xl">
        Possible shorthand when using truncate, tested with additional classnames
      </div>
      `,
      errors: [generateError(["overflow-hidden", "text-ellipsis", "whitespace-nowrap"], "truncate")],
    },
    {
      code: "<div className={ctl(`${live && 'bg-white'} w-full px-10 py-10`)}>Leading space trim issue with fix</div>",
      output: "<div className={ctl(`${live && 'bg-white'} w-full p-10`)}>Leading space trim issue with fix</div>",
      errors: [generateError(["px-10", "py-10"], "p-10")],
    },
    {
      code: "<div className={ctl(`${live && 'bg-white'} w-full px-10 py-10 `)}>Leading space trim issue with fix (2)</div>",
      output: "<div className={ctl(`${live && 'bg-white'} w-full p-10 `)}>Leading space trim issue with fix (2)</div>",
      errors: [generateError(["px-10", "py-10"], "p-10")],
    },
    {
      code: "<div className={ctl(`w-full px-10 py-10 ${live && 'bg-white'}`)}>Trailing space trim issue with fix</div>",
      output: "<div className={ctl(`w-full p-10 ${live && 'bg-white'}`)}>Trailing space trim issue with fix</div>",
      errors: [generateError(["px-10", "py-10"], "p-10")],
    },
    {
      code: "<div className={ctl(` w-full px-10 py-10 ${live && 'bg-white'}`)}>Trailing space trim issue with fix (2)</div>",
      output: "<div className={ctl(` w-full p-10 ${live && 'bg-white'}`)}>Trailing space trim issue with fix (2)</div>",
      errors: [generateError(["px-10", "py-10"], "p-10")],
    },
    {
      code: `<div class="h-10 w-10">New size-* utilities</div>`,
      output: `<div class="size-10">New size-* utilities</div>`,
      errors: [generateError(["h-10", "w-10"], "size-10")],
    },
    {
      code: `<div class="h-10 md:h-5 md:w-5 lg:w-10">New size-* utilities</div>`,
      output: `<div class="h-10 md:size-5 lg:w-10">New size-* utilities</div>`,
      errors: [generateError(["md:h-5", "md:w-5"], "md:size-5")],
    },
    {
      code: `<div class="h-custom w-custom">size-*</div>`,
      output: `<div class="size-custom">size-*</div>`,
      errors: [generateError(["h-custom", "w-custom"], "size-custom")],
      options: customSpacingOnlyOptions,
    },
    ...["myTag", "myTag.subTag", "myTag(SomeComponent)"].map((tag) => ({
      code: `${tag}\`overflow-hidden text-ellipsis whitespace-nowrap text-white text-xl\``,
      output: `${tag}\`truncate text-white text-xl\``,
      errors: [generateError(["overflow-hidden", "text-ellipsis", "whitespace-nowrap"], "truncate")],
      options: [
        {
          tags: ["myTag"],
        },
      ],
    })),
    {
      code: `<div class="pfx-h-5 pfx-w-5 sm:pfx-h-10 sm:pfx-w-10">New size-* utilities</div>`,
      output: `<div class="pfx-size-5 sm:pfx-size-10">New size-* utilities</div>`,
      errors: [
        generateError(["pfx-h-5", "pfx-w-5"], "pfx-size-5"),
        generateError(["sm:pfx-h-10", "sm:pfx-w-10"], "sm:pfx-size-10"),
      ],
      options: [
        {
          config: { prefix: "pfx-" },
        },
      ],
    },
    {
      code: `<div class="content-center justify-center sm:items-start sm:justify-items-start md:self-end md:justify-self-end lg:self-start lg:justify-self-center">issue #376</div>`,
      output: `<div class="place-content-center sm:place-items-start md:place-self-end lg:self-start lg:justify-self-center">issue #376</div>`,
      errors: [
        generateError(["content-center", "justify-center"], "place-content-center"),
        generateError(["sm:items-start", "sm:justify-items-start"], "sm:place-items-start"),
        generateError(["md:self-end", "md:justify-self-end"], "md:place-self-end"),
      ],
    },
  ],
});
