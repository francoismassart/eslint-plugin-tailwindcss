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

const generateErrors = (count) => {
  const errors = [];

  for (let i = 0; i < count; i++) {
    errors.push({
      messageId: "invalidOrder",
    });
  }

  return errors;
};

const errors = generateErrors(1);

const sharedOptions = [
  {
    config: {
      theme: {
        extend: {
          fontSize: { large: "20rem" },
          colors: {
            "deque-blue": "#243c5a",
          },
        },
      },
      plugins: [
        require("@tailwindcss/typography"),
        require("@tailwindcss/forms"),
        require("@tailwindcss/aspect-ratio"),
        require("@tailwindcss/line-clamp"),
      ],
    },
  },
];

const skipClassAttributeOptions = [
  {
    skipClassAttribute: true,
    config: {
      theme: {},
      plugins: [],
    },
  },
];

ruleTester.run("classnames-order", rule, {
  valid: [
    {
      code: `<div class="custom container box-content lg:box-border">Simple, basic</div>`,
    },
    {
      code: `<div tw="custom container box-content lg:box-border">Simple, using 'tw' prop</div>`,
      options: [
        {
          classRegex: "^tw$",
        },
      ],
    },
    {
      code: "<div className={ctl(`w-full p-10 ${live && 'bg-blue-100 sm:rounded-lg dark:bg-purple-400'}`)}>ctl + exp</div>",
    },
    {
      code: "<div className={ctl(`h-48 w-48 rounded-full bg-blue-500 ${className}`)}>ctl + var</div>",
    },
    {
      code: "<div className={ctl(`w-full p-10 ${live && 'bg-white dark:bg-black'}`)}>Space trim issue</div>",
    },
    {
      code: `
      ctl(\`
        flex items-center justify-center
        \${variant === SpinnerVariant.OVERLAY && \`z-60 rounded border-2 bg-gray-400 px-4 \${widthClass} \${heightClass}\`}
        \${
          variant === SpinnerVariant.FULLSCREEN &&
          \`z-60 fixed bottom-0 left-0 right-0 top-0 bg-white bg-opacity-60 px-4 dark:bg-purple-900 dark:bg-opacity-60\`
        }
      \`)`,
    },
    {
      code: `<div class='box-content lg:box-border'>Simple quotes</div>`,
    },
    {
      code: `<div class="space-y-0.5 ">Extra space at the end</div>`,
    },
    {
      code: `<div tw="space-y-0.5 ">Extra space at the end, but with 'tw' prop</div>`,
      options: [
        {
          classRegex: "^tw$",
        },
      ],
    },
    {
      code: `<div class="p-5 sm:px-3 md:py-2 lg:p-4 xl:px-6">'p', then 'py' then 'px'</div>`,
    },
    {
      code: `<template><div class="custom container box-content lg:box-border">Simple, basic (via vue)</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div class='box-content lg:box-border'>Simple quotes</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div class="p-5 sm:px-3 md:py-2 lg:p-4 xl:px-6">'p', then 'py' then 'px'</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `ctl(\`
        container
        flex
        w-12
        sm:w-6
        lg:w-4
      \`)`,
    },
    {
      code: `<div class="lorem-w-12 lg_lorem-w-6">Custom prefix and separator</div>`,
      options: [
        {
          config: { prefix: "lorem-", separator: "_" },
        },
      ],
    },
    {
      code: `<div class="w-12 lg:w-[500px]">Allowed arbitrary value</div>`,
    },
    {
      code: `<div class="dark:focus:hover:bg-black md:dark:disabled:focus:hover:bg-gray-400">Stackable variants</div>`,
    },
    {
      code: `<div className={clsx(\`absolute bottom-0 flex h-[270px] w-full flex-col\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
    },
    {
      code: `<div class="opts-w-12 lg:opts-w-6">Options override shared settings</div>`,
      options: [
        {
          config: { prefix: "opts-" },
        },
      ],
      settings: {
        tailwindcss: {
          config: { prefix: "sttgs-" },
        },
      },
    },
    {
      code: `<div class="sttgs-w-12 lg_sttgs-w-6">Use settings</div>`,
      settings: {
        tailwindcss: {
          config: { prefix: "sttgs-", separator: "_" },
        },
      },
    },
    ...(['myTag', 'myTag.subTag', 'myTag(SomeComponent)'].map(tag => ({
      code: `${tag}\`
        container
        flex
        w-12
        sm:w-6
        lg:w-4
      \``,
      options: [
        {
          tags: ["myTag"],
        },
      ],
    }))),
    {
      code: `<div class="z-dialog flex w-12">Number values</div>`,
      settings: {
        tailwindcss: {
          config: { theme: { zIndex: { dialog: 10000 } } },
        },
      },
    },
    {
      code: `<div class="   flex  space-y-0.5   ">Extra spaces</div>`,
    },
    {
      code: `<div class="container animate-spin first:flex">Valid using mode official</div>`,
    },
    {
      code: `<div class="lorem-container lorem-animate-spin first_lorem-flex">Valid using mode official</div>`,
      options: [
        {
          config: { prefix: "lorem-", separator: "_" },
        },
      ],
    },
    {
      // No plugin
      code: `
      <div class="custom custom2 group peer container sr-only pointer-events-auto visible sticky inset-0 inset-x-2 inset-y-1 bottom-5 left-6 right-4 top-3 isolate z-auto order-1 col-span-1 col-start-2 col-end-3 row-span-1 row-start-2 row-end-3 float-left clear-both m-0 mx-1.5 my-px mb-3 ml-4 mr-2 mt-1 box-border block aspect-auto h-0 max-h-fit min-h-full w-0 min-w-full max-w-fit flex-none flex-shrink shrink flex-grow grow basis-0 table-fixed border-collapse origin-bottom-right translate-x-px translate-y-2 rotate-90 skew-x-2 skew-y-0 scale-0 scale-x-75 scale-y-50 transform transform-gpu transform-none animate-spin cursor-text touch-auto select-none resize-none snap-x snap-mandatory snap-center snap-always scroll-m-0 scroll-mx-1.5 scroll-my-px scroll-mb-3 scroll-ml-4 scroll-mr-2 scroll-mt-1 scroll-p-0 scroll-px-1.5 scroll-py-px scroll-pb-3 scroll-pl-4 scroll-pr-2 scroll-pt-1 list-outside list-decimal appearance-none columns-1 break-before-avoid-page break-inside-avoid-column break-after-auto auto-cols-min grid-flow-col auto-rows-min grid-cols-1 grid-rows-1 flex-col flex-wrap place-content-between place-items-stretch content-between items-baseline justify-start justify-items-center gap-0 gap-x-1 gap-y-2 space-x-1 space-y-0 space-y-reverse space-x-reverse divide-x-2 divide-y-4 divide-y-reverse divide-x-reverse divide-dashed divide-black place-self-end self-baseline justify-self-stretch overflow-hidden overflow-x-auto overflow-y-scroll overscroll-auto overscroll-y-none overscroll-x-contain scroll-smooth overflow-ellipsis text-ellipsis whitespace-nowrap break-words rounded rounded-b-sm rounded-l-none rounded-r-2xl rounded-t-xl rounded-bl-none rounded-br-sm rounded-tl-xl rounded-tr-2xl border-0 border-x-2 border-y-2 border-b border-l border-r-4 border-t-4 border-solid border-black border-x-slate-50 border-y-transparent border-b-inherit border-l-current border-r-transparent border-t-white bg-current bg-opacity-50 bg-none from-current via-black to-orange-500 decoration-clone box-decoration-clone bg-auto bg-fixed bg-clip-padding bg-bottom bg-no-repeat bg-origin-border fill-white stroke-white stroke-2 object-contain object-bottom p-0 px-1.5 py-px pb-3 pl-4 pr-2 pt-1 text-left indent-px align-top font-sans text-lg font-semibold uppercase italic ordinal leading-4 tracking-normal text-current underline decoration-black decoration-double decoration-from-font underline-offset-auto subpixel-antialiased caret-black accent-black opacity-50 bg-blend-lighten mix-blend-darken shadow-lg shadow-white outline-dotted outline-0 outline-offset-1 outline-current ring-1 ring-inset ring-white ring-opacity-50 ring-offset-2 ring-offset-current blur brightness-50 contrast-100 drop-shadow-xl grayscale hue-rotate-90 invert saturate-100 sepia filter backdrop-blur-lg backdrop-brightness-110 backdrop-contrast-125 backdrop-grayscale backdrop-hue-rotate-90 backdrop-invert backdrop-opacity-30 backdrop-saturate-100 backdrop-sepia transition-all delay-150 duration-1000 ease-linear will-change-scroll content-none [--scroll-offset:56px]">no plugin</div>
      `,
    },
    {
      code: `
      <div class="bg-deque-blue text-large flex h-9 w-9 items-center justify-center rounded-full border-4 border-solid border-blue-100 text-white">https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/109#issuecomment-1044625260 no config, so bg-deque-blue text-large goes at first position because custom</div>
      `,
    },
    {
      code: `
      <div class="flex h-9 w-9 items-center justify-center rounded-full border-4 border-solid border-blue-100 bg-deque-blue text-large text-white">https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/109#issuecomment-1044625260</div>
      `,
      options: sharedOptions,
    },
    {
      // Kitchensink
      code: `
      <div class="custom custom2 aspect-auto group peer container prose prose-slate aspect-h-9 aspect-w-16 sr-only pointer-events-auto visible sticky inset-0 inset-x-2 inset-y-1 bottom-5 left-6 right-4 top-3 isolate z-auto order-1 col-span-1 col-start-2 col-end-3 row-span-1 row-start-2 row-end-3 float-left clear-both m-0 mx-1.5 my-px mb-3 ml-4 mr-2 mt-1 box-border line-clamp-2 block h-0 max-h-fit min-h-full w-0 min-w-full max-w-fit flex-none flex-shrink shrink flex-grow grow basis-0 table-fixed border-collapse origin-bottom-right translate-x-px translate-y-2 rotate-90 skew-x-2 skew-y-0 scale-0 scale-x-75 scale-y-50 transform transform-gpu transform-none animate-spin cursor-text touch-auto select-none resize-none snap-x snap-mandatory snap-center snap-always scroll-m-0 scroll-mx-1.5 scroll-my-px scroll-mb-3 scroll-ml-4 scroll-mr-2 scroll-mt-1 scroll-p-0 scroll-px-1.5 scroll-py-px scroll-pb-3 scroll-pl-4 scroll-pr-2 scroll-pt-1 list-outside list-decimal appearance-none columns-1 break-before-avoid-page break-inside-avoid-column break-after-auto auto-cols-min grid-flow-col auto-rows-min grid-cols-1 grid-rows-1 flex-col flex-wrap place-content-between place-items-stretch content-between items-baseline justify-start justify-items-center gap-0 gap-x-1 gap-y-2 space-x-1 space-y-0 space-y-reverse space-x-reverse divide-x-2 divide-y-4 divide-y-reverse divide-x-reverse divide-dashed divide-black place-self-end self-baseline justify-self-stretch overflow-hidden overflow-x-auto overflow-y-scroll overscroll-auto overscroll-y-none overscroll-x-contain scroll-smooth overflow-ellipsis text-ellipsis whitespace-nowrap break-words rounded rounded-b-sm rounded-l-none rounded-r-2xl rounded-t-xl rounded-bl-none rounded-br-sm rounded-tl-xl rounded-tr-2xl border-0 border-x-2 border-y-2 border-b border-l border-r-4 border-t-4 border-solid border-black border-x-slate-50 border-y-transparent border-b-inherit border-l-current border-r-transparent border-t-white bg-current bg-opacity-50 bg-none from-current via-black to-orange-500 decoration-clone box-decoration-clone bg-auto bg-fixed bg-clip-padding bg-bottom bg-no-repeat bg-origin-border fill-white stroke-white stroke-2 object-contain object-bottom p-0 px-1.5 py-px pb-3 pl-4 pr-2 pt-1 text-left indent-px align-top font-sans text-lg font-semibold uppercase italic ordinal leading-4 tracking-normal text-current underline decoration-black decoration-double decoration-from-font underline-offset-auto subpixel-antialiased caret-black accent-black opacity-50 bg-blend-lighten mix-blend-darken shadow-lg shadow-white outline-dotted outline-0 outline-offset-1 outline-current ring-1 ring-inset ring-white ring-opacity-50 ring-offset-2 ring-offset-current blur brightness-50 contrast-100 drop-shadow-xl grayscale hue-rotate-90 invert saturate-100 sepia filter backdrop-blur-lg backdrop-brightness-110 backdrop-contrast-125 backdrop-grayscale backdrop-hue-rotate-90 backdrop-invert backdrop-opacity-30 backdrop-saturate-100 backdrop-sepia transition-all delay-150 duration-1000 ease-linear will-change-scroll content-none [--scroll-offset:56px]">Kitchensink</div>
      `,
      options: sharedOptions,
    },
    {
      code: `
      <div className={\`relative w-full overflow-hidden \${yolo ? "flex flex-col" : "block"}\`}>Issue #131</div>
      `,
    },
    {
      code: `
      <div>
        <h1>Issue #142</h1>
        <div class="unselectable absolute box-content cursor-pointer select-none rounded-full p-1.5 text-center transition-colors transition-transform duration-300">1</div>
        <div class="dark:after:border-t-blue-dark/40 dark:after:border-l-blue-dark/40 before:border-l-blue-mid before:border-t-blue-mid after:border-t-blue-subtle after:border-l-blue-subtle border-transparent before:border-transparent dark:before:border-transparent">2</div>
        <div class="text-neutral-750 theme-contrast:text-black absolute -right-1 -top-4 cursor-pointer rounded-bl-sm rounded-tr-sm px-2.5 py-2 text-sm opacity-0 transition-opacity group-hover:opacity-50 group-hover:hover:opacity-100">3</div>
        <div class="text-yellow-darker/50 dark:text-yellow-strong/70 hover:text-yellow-darker dark:hover:text-yellow-strong relative flex cursor-pointer items-center justify-center pb-2 pt-2 transition-colors">4</div>
        <div class="text-yellow-darker/50 dark:text-yellow-strong/70 hover:text-yellow-darker dark:hover:text-yellow-strong relative flex cursor-pointer items-center justify-center pb-2 pt-2 transition-colors">5</div>
        <div class="group relative -mx-1.5 my-0 block rounded px-1.5 pb-4 pt-3.5 transition-colors duration-150 hover:text-black active:top-0 dark:hover:text-white">6</div>
        <div class="bg-neutral-70 theme-contrast:bg-white dark:bg-gray-780 pointer-events-none fixed left-0 top-0 h-screen w-screen opacity-70">7</div>
        <div class="dark:before:border-t-blue-dark/40 dark:before:border-l-blue-dark/40 dark:after:border-t-blue-dark/40 dark:after:border-l-blue-dark/40 before:border-t-blue-subtle before:border-l-blue-subtle after:border-t-blue-subtle after:border-l-blue-subtle border-transparent">8</div>
        <div class="dark:bg-blue-dark/40 bg-blue-subtle dark:text-blue-strong border-none text-black">9</div>
        <div class="m-3 inline-block h-4 w-4 rounded-full transition-transform">10</div>
      </div>
      `,
    },
    {
      code: `<div class>No errors while typing</div>`,
    },
    {
      code: `
      <div className={\`sm:flex block \${ctl('relative w-full overflow-hidden')}\`}>skipClassAttribute</div>
      `,
      options: skipClassAttributeOptions,
    },
    {
      code: `<div class="py-1\u3000px-2 block">Do not treat full width space as class separator</div>`,
    },
    {
      code: `
        const func = () => ({ a: 12 });
        <div className={clsx(['text-sm', {
          ...func()
        }])}>Spread of a function return inside clsx</div>
      `,
    },
  ],
  invalid: [
    {
      code: `
      export interface FakePropsInterface {
        readonly name?: string;
      }
      function Fake({
        name = 'yolo'
      }: FakeProps) {
        return (
          <>
            <h1 className={"absolute bottom-0 w-full flex flex-col"}>Welcome {name}</h1>
            <p>Bye {name}</p>
          </>
        );
      }
      export default Fake;
      `,
      output: `
      export interface FakePropsInterface {
        readonly name?: string;
      }
      function Fake({
        name = 'yolo'
      }: FakeProps) {
        return (
          <>
            <h1 className={"absolute bottom-0 flex w-full flex-col"}>Welcome {name}</h1>
            <p>Bye {name}</p>
          </>
        );
      }
      export default Fake;
      `,
      parser: require.resolve("@typescript-eslint/parser"),
      errors: errors,
    },
    {
      code: `<div class="sm:w-6 container w-12">Classnames will be ordered</div>`,
      output: `<div class="container w-12 sm:w-6">Classnames will be ordered</div>`,
      errors: errors,
    },
    {
      code: `<div class="sm:py-5 p-4 sm:px-7 lg:p-8">Enhancing readability</div>`,
      output: `<div class="p-4 sm:px-7 sm:py-5 lg:p-8">Enhancing readability</div>`,
      errors: errors,
    },
    {
      code: `<div tw="sm:py-5 p-4 sm:px-7 lg:p-8">Enhancing readability with 'tw' prop</div>`,
      output: `<div tw="p-4 sm:px-7 sm:py-5 lg:p-8">Enhancing readability with 'tw' prop</div>`,
      options: [
        {
          classRegex: "^tw$",
        },
      ],
      errors: errors,
    },
    {
      code: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16">:)...</div>`,
      output: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:px-8 sm:py-12 md:py-16">:)...</div>`,
      errors: errors,
    },
    {
      code: `<template><div class="sm:w-6 container w-12">Classnames will be ordered</div></template>`,
      output: `<template><div class="container w-12 sm:w-6">Classnames will be ordered</div></template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div class="sm:py-5 p-4 sm:px-7 lg:p-8">Enhancing readability</div></template>`,
      output: `<template><div class="p-4 sm:px-7 sm:py-5 lg:p-8">Enhancing readability</div></template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div class="grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16">:)</div></template>`,
      output: `<template><div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:px-8 sm:py-12 md:py-16">:)</div></template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: "ctl(`p-10 w-full ${some}`)",
      output: "ctl(`w-full p-10 ${some}`)",
      errors: errors,
    },
    {
      code: "<div className={ctl(`p-10 w-full ${live && 'bg-white dark:bg-black'}`)}>Space trim issue with fix</div>",
      output: "<div className={ctl(`w-full p-10 ${live && 'bg-white dark:bg-black'}`)}>Space trim issue with fix</div>",
      errors: errors,
    },
    {
      code: `<div class="md:prose-2xl prose-xl prose sm:prose-sm"></div>`,
      output: `<div class="prose prose-xl sm:prose-sm md:prose-2xl"></div>`,
      options: [
        {
          config: {
            plugins: [require("@tailwindcss/typography")],
          },
        },
      ],
      errors: errors,
    },
    {
      code: `<div class="sm:line-clamp-3 line-clamp-2"></div>`,
      output: `<div class="line-clamp-2 sm:line-clamp-3"></div>`,
      options: [
        {
          config: {
            plugins: [require("@tailwindcss/line-clamp")],
          },
        },
      ],
      errors: errors,
    },
    {
      code: `<div class='lg:box-border box-content'>Simple quotes</div>`,
      output: `<div class='box-content lg:box-border'>Simple quotes</div>`,
      errors: errors,
    },
    {
      options: [
        {
          removeDuplicates: false,
        },
      ],
      code: `<div class="w-12 lg:w-6 w-12">removeDuplicates: false</div>`,
      output: `<div class="w-12 w-12 lg:w-6">removeDuplicates: false</div>`,
      errors: errors,
    },
    {
      code: `<div class="w-12  lg:w-6   w-12">Single line dups + no head/tail spaces</div>`,
      output: `<div class="w-12   lg:w-6">Single line dups + no head/tail spaces</div>`,
      errors: errors,
    },
    {
      code: `<div class=" w-12  lg:w-6   w-12">Single dups line + head spaces</div>`,
      output: `<div class=" w-12   lg:w-6">Single dups line + head spaces</div>`,
      errors: errors,
    },
    {
      code: `<div class="w-12  lg:w-6   w-12 ">Single line dups + tail spaces</div>`,
      output: `<div class="w-12   lg:w-6 ">Single line dups + tail spaces</div>`,
      errors: errors,
    },
    {
      // Multiline + both head/tail spaces
      code: `
      ctl(\`
        invalid
        sm:w-6
        container
        invalid
        flex
        container
        w-12
        flex
        container
        lg:w-4
        lg:w-4
      \`);`,
      output: `
      ctl(\`
        invalid
        container
        flex
        w-12
        sm:w-6
        lg:w-4
      \`);`,
      errors: errors,
    },
    {
      code: `
      ctl(\`
        invalid
        sm:w-6
        container
        w-12
        flex
        lg:w-4
      \`);`,
      output: `
      ctl(\`
        invalid
        container
        flex
        w-12
        sm:w-6
        lg:w-4
      \`);`,
      errors: errors,
    },
    {
      code: `
      const buttonClasses = ctl(\`
        \${fullWidth ? "w-12" : "w-6"}
        container
        \${fullWidth ? "sm:w-8" : "sm:w-4"}
        lg:w-9
        flex
        \${hasError && "bg-red"}
      \`);`,
      output: `
      const buttonClasses = ctl(\`
        \${fullWidth ? "w-12" : "w-6"}
        container
        \${fullWidth ? "sm:w-8" : "sm:w-4"}
        flex
        lg:w-9
        \${hasError && "bg-red"}
      \`);`,
      errors: errors,
    },
    {
      code: `
      const buttonClasses = ctl(\`
        \${fullWidth ? "w-12" : "w-6"}
        flex
        container
        \${fullWidth ? "sm:w-7" : "sm:w-4"}
        lg:py-4
        sm:py-6
        \${hasError && "bg-red"}
      \`);`,
      output: `
      const buttonClasses = ctl(\`
        \${fullWidth ? "w-12" : "w-6"}
        container
        flex
        \${fullWidth ? "sm:w-7" : "sm:w-4"}
        sm:py-6
        lg:py-4
        \${hasError && "bg-red"}
      \`);`,
      errors: generateErrors(2),
    },
    {
      code: `<div class="sm:w-12 w-[320px]">Allowed arbitrary value but incorrect order</div>`,
      output: `<div class="w-[320px] sm:w-12">Allowed arbitrary value but incorrect order</div>`,
      errors: errors,
    },
    {
      code: `clsx(\`absolute bottom-0 w-full h-[70px] flex flex-col\`);`,
      output: `clsx(\`absolute bottom-0 flex h-[70px] w-full flex-col\`);`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
      errors: errors,
    },
    {
      code: `cva({
          primary: ["absolute bottom-0 w-full h-[70px] flex flex-col"],
        })`,
      output: `cva({
          primary: ["absolute bottom-0 flex h-[70px] w-full flex-col"],
        })`,
      options: [
        {
          callees: ["cva"],
        },
      ],
      errors: errors,
    },
    {
      code: `<div className={clsx(\`absolute bottom-0 w-full h-[270px] flex flex-col\`)}>clsx</div>`,
      output: `<div className={clsx(\`absolute bottom-0 flex h-[270px] w-full flex-col\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
      errors: errors,
    },
    {
      code: `
      ctl(\`
        px-2
        flex
        \${
          !isDisabled &&
          \`
            top-0
            flex
            border-0
          \`
        }
        \${
          isDisabled &&
          \`
            border-0
            mx-0
          \`
        }
      \`)
      `,
      output: `
      ctl(\`
        flex
        px-2
        \${
          !isDisabled &&
          \`
            top-0
            flex
            border-0
          \`
        }
        \${
          isDisabled &&
          \`
            mx-0
            border-0
          \`
        }
      \`)
      `,
      errors: generateErrors(2),
    },
    {
      code: `<div className="px-2 flex">...</div>`,
      output: `<div className="flex px-2">...</div>`,
      errors: errors,
    },
    {
      code: `ctl(\`\${enabled && "px-2 flex"}\`)`,
      output: `ctl(\`\${enabled && "flex px-2"}\`)`,
      errors: errors,
    },
    {
      code: `ctl(\`px-2 flex\`)`,
      output: `ctl(\`flex px-2\`)`,
      errors: errors,
    },
    {
      code: `
      ctl(\`
        px-2
        flex
      \`)
      `,
      output: `
      ctl(\`
        flex
        px-2
      \`)
      `,
      errors: errors,
    },
    {
      code: `
      <div
        className="
          fixed
          right-0
          top-0
          bottom-0
          left-0
          transition-all
          transform
        "
      >
        #19
      </div>
      `,
      output: `
      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          top-0
          transform
          transition-all
        "
      >
        #19
      </div>
      `,
      errors: errors,
    },
    {
      code: `
      <div
        className={clsx(
          "w-full h-10 rounded",
          name === "white"
            ? "ring-black flex"
            : undefined
        )}
      />
      `,
      output: `
      <div
        className={clsx(
          "h-10 w-full rounded",
          name === "white"
            ? "flex ring-black"
            : undefined
        )}
      />
      `,
      errors: generateErrors(2),
    },
    ...(['myTag', 'myTag.subTag', 'myTag(SomeComponent)'].flatMap(tag => ([
      {
        code: `
        ${tag}\`
          invalid
          sm:w-6
          container
          w-12
          flex
          lg:w-4
        \`;`,
        output: `
        ${tag}\`
          invalid
          container
          flex
          w-12
          sm:w-6
          lg:w-4
        \`;`,
        options: [
          {
            tags: ["myTag"],
          },
        ],
        errors: errors,
      },
      {
        code: `
        const buttonClasses = ${tag}\`
          \${fullWidth ? "w-12" : "w-6"}
          container
          \${fullWidth ? "sm:w-8" : "sm:w-4"}
          lg:w-9
          flex
          \${hasError && "bg-red"}
        \`;`,
        output: `
        const buttonClasses = ${tag}\`
          \${fullWidth ? "w-12" : "w-6"}
          container
          \${fullWidth ? "sm:w-8" : "sm:w-4"}
          flex
          lg:w-9
          \${hasError && "bg-red"}
        \`;`,
        options: [
          {
            tags: ["myTag"],
          },
        ],
        errors: errors,
      },
      {
        code: `
        const buttonClasses = ${tag}\`
          \${fullWidth ? "w-12" : "w-6"}
          flex
          container
          \${fullWidth ? "sm:w-7" : "sm:w-4"}
          lg:py-4
          sm:py-6
          \${hasError && "bg-red"}
        \`;`,
        output: `
        const buttonClasses = ${tag}\`
          \${fullWidth ? "w-12" : "w-6"}
          container
          flex
          \${fullWidth ? "sm:w-7" : "sm:w-4"}
          sm:py-6
          lg:py-4
          \${hasError && "bg-red"}
        \`;`,
        options: [
          {
            tags: ["myTag"],
          },
        ],
        errors: generateErrors(2),
      },
    ]))),
    {
      code: `
      classnames([
        'invalid lg:w-4 sm:w-6',
        ['w-12 flex'],
      ])`,
      output: `
      classnames([
        'invalid sm:w-6 lg:w-4',
        ['flex w-12'],
      ])`,
      errors: generateErrors(2),
    },
    {
      code: `
      classnames({
        invalid,
        flex: myFlag,
        'lg:w-4 sm:w-6': resize
      })`,
      output: `
      classnames({
        invalid,
        flex: myFlag,
        'sm:w-6 lg:w-4': resize
      })`,
      errors: errors,
    },
    {
      code: `
      <div class="flex-col cursor-pointer flex"></div>
      <div class="m-0 lg:m-2 md:m-1"></div>`,
      output: `
      <div class="flex cursor-pointer flex-col"></div>
      <div class="m-0 md:m-1 lg:m-2"></div>`,
      errors: [...errors, ...errors],
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    {
      code: `<div class="grid lg:grid-col-4 grid-cols-1 sm:grid-cols-2">:)</div>`,
      output: `<div class="lg:grid-col-4 grid grid-cols-1 sm:grid-cols-2">:)</div>`,
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
        cursor-pointer
        flex-col
      ">
        :)
      </div>`,
      errors: errors,
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    {
      code: `<div class="first:flex animate-spin custom container">Using official sorting</div>`,
      output: `<div class="custom container animate-spin first:flex">Using official sorting</div>`,
      errors: errors,
    },
    {
      code: `ctl(\`\${some} container animate-spin first:flex \${bool ? "flex-col flex" : ""}\`)`,
      output: `ctl(\`\${some} container animate-spin first:flex \${bool ? "flex flex-col" : ""}\`)`,
      errors: errors,
    },
    {
      code: `ctl(\`p-3 border-gray-300 m-4 h-24 lg:p-4 flex border-2 lg:m-4\`)`,
      output: `ctl(\`m-4 flex h-24 border-2 border-gray-300 p-3 lg:m-4 lg:p-4\`)`,
      errors: errors,
    },
    {
      // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/131
      code: "<Button className={'relative w-full h-full overflow-hidden'}>Single quotes</Button>",
      output: "<Button className={'relative h-full w-full overflow-hidden'}>Single quotes</Button>",
      errors: errors,
    },
    {
      // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/131
      code: "<Button className={`relative w-full h-full overflow-hidden`}>{name}</Button>",
      output: "<Button className={`relative h-full w-full overflow-hidden`}>{name}</Button>",
      errors: errors,
    },
    {
      // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/131
      code: `<Button className={\`relative w-full h-full overflow-hidden\`}>{name}</Button>`,
      output: `<Button className={\`relative h-full w-full overflow-hidden\`}>{name}</Button>`,
      errors: errors,
    },
    {
      // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/131
      code: `<Button className={\`relative w-full h-full overflow-hidden\`}>{name}</Button>`,
      output: `<Button className={\`relative h-full w-full overflow-hidden\`}>{name}</Button>`,
      errors: errors,
    },
    {
      code: `
      <div className={\`sm:flex block \${ctl('w-full relative')}\`}>skipClassAttribute</div>
      `,
      output: `
      <div className={\`sm:flex block \${ctl('relative w-full')}\`}>skipClassAttribute</div>
      `,
      options: skipClassAttributeOptions,
      errors: errors,
    },
    {
      code: `<template><div class="sm:w-6 container w-12">Classnames will be ordered</div></template>`,
      output: `<template><div class="container w-12 sm:w-6">Classnames will be ordered</div></template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div :class="['sm:py-5 p-4 sm:px-7 lg:p-8']">Enhancing readability</div></template>`,
      output: `<template><div :class="['p-4 sm:px-7 sm:py-5 lg:p-8']">Enhancing readability</div></template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div v-bind:class="{'grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16': true}">:)...</div></template>`,
      output: `<template><div v-bind:class="{'grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:px-8 sm:py-12 md:py-16': true}">:)...</div></template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div :class="ctl(\`p-10 w-full \${some}\`)" /></template>`,
      output: `<template><div :class="ctl(\`w-full p-10 \${some}\`)" /></template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <template>
        <div v-bind="data" :class="[
          'py-1.5 font-semibold transition',
          {
            'text-white': variant === 'white',
            'text-blue-500 hover:text-blue-400 border-blue-500': variant === 'primary',
            'underline decoration-2 underline-offset-[10px]': active
          }
        ]" />
      </template>`,
      output: `
      <template>
        <div v-bind="data" :class="[
          'py-1.5 font-semibold transition',
          {
            'text-white': variant === 'white',
            'border-blue-500 text-blue-500 hover:text-blue-400': variant === 'primary',
            'underline decoration-2 underline-offset-[10px]': active
          }
        ]" />
      </template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<div class="block group/edit:stroke-0">support named group/peer syntax</div>`,
      output: `<div class="group/edit:stroke-0 block">support named group/peer syntax</div>`,
      errors: errors,
    },
  ],
});
