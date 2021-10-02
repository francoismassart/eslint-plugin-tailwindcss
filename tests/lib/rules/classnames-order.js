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

var errors = [
  {
    messageId: "invalidOrder",
  },
];

ruleTester.run("classnames-order", rule, {
  valid: [
    {
      code: `<div class="container box-content lg:box-border custom">Simple, basic</div>`,
    },
    {
      code: "<div className={ctl(`p-10 w-full ${live && 'bg-blue-100 dark:bg-purple-400 sm:rounded-lg'}`)}>div</div>",
    },
    {
      code: "<div className={ctl(`w-48 h-48 bg-blue-500 rounded-full ${className}`)}>div</div>",
    },
    {
      code: "<div className={ctl(`p-10 w-full ${live && 'bg-white dark:bg-black'}`)}>Space trim issue</div>",
    },
    {
      code: `
      ctl(\`
        flex justify-center items-center
        \${variant === SpinnerVariant.OVERLAY && \`px-4 bg-gray-400 rounded border-2 z-60 \${widthClass} \${heightClass}\`}
        \${
          variant === SpinnerVariant.FULLSCREEN &&
          \`fixed top-0 right-0 bottom-0 left-0 px-4 bg-white dark:bg-purple-900 bg-opacity-60 dark:bg-opacity-60 z-60\`
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
      code: `<div class="p-4 rounded sm:p-6 sm:rounded-lg lg:p-8 lg:rounded-2xl">groupByResponsive</div>`,
      options: [
        {
          groupByResponsive: true,
        },
      ],
    },
    {
      code: `<div class="p-5 lg:p-4 md:py-2 sm:px-3 xl:px-6">'p', then 'py' then 'px'</div>`,
    },
    {
      code: `<template><div class="container box-content lg:box-border custom">Simple, basic</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div class='box-content lg:box-border'>Simple quotes</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div class="p-5 lg:p-4 md:py-2 sm:px-3 xl:px-6">'p', then 'py' then 'px'</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<div class="custom another-custom w-12 lg:w-6">prependCustom: true</div>`,
      options: [
        {
          prependCustom: true,
        },
      ],
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
      options: [
        {
          config: { mode: "jit" },
        },
      ],
    },
    {
      code: `<div class="dark:focus:hover:bg-black md:dark:disabled:focus:hover:bg-gray-400">Stackable variants</div>`,
      options: [
        {
          config: {
            mode: "jit",
          },
        },
      ],
    },
    {
      code: `<div className={clsx(\`flex absolute bottom-0 flex-col w-full h-[270px]\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
          config: {
            mode: "jit",
          },
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
    {
      code: `myTag\`
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
    },
  ],
  invalid: [
    {
      code: `<div class="sm:w-6 container w-12">Classnames will be ordered</div>`,
      output: `<div class="container w-12 sm:w-6">Classnames will be ordered</div>`,
      errors: errors,
    },
    {
      code: `<div class="   flex  space-y-0.5   ">Extra spaces</div>`,
      output: `<div class="flex space-y-0.5">Extra spaces</div>`,
      errors: errors,
    },
    {
      code: `<div class="sm:py-5 p-4 sm:px-7 lg:p-8">Enhancing readability</div>`,
      output: `<div class="p-4 lg:p-8 sm:py-5 sm:px-7">Enhancing readability</div>`,
      errors: errors,
    },
    {
      code: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16">:)</div>`,
      output: `<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:py-12 md:py-16 sm:px-8">:)</div>`,
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
      output: `<template><div class="p-4 lg:p-8 sm:py-5 sm:px-7">Enhancing readability</div></template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<template><div class="grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16">:)</div></template>`,
      output: `<template><div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:py-12 md:py-16 sm:px-8">:)</div></template>`,
      errors: errors,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<div class="bg-gradient-to-r from-green-400 to-blue-500 focus:from-pink-500 focus:to-yellow-500"></div>`,
      output: `<div class="bg-gradient-to-r from-green-400 focus:from-pink-500 to-blue-500 focus:to-yellow-500"></div>`,
      errors: errors,
    },
    {
      code: "<div className={ctl(`w-full p-10 ${live && 'bg-white dark:bg-black'}`)}>Space trim issue with fix</div>",
      output: "<div className={ctl(`p-10 w-full ${live && 'bg-white dark:bg-black'}`)}>Space trim issue with fix</div>",
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
      code: `<div class="w-12  lg:w-6   w-12">Multiple spaces</div>`,
      output: `<div class="w-12 lg:w-6">Multiple spaces</div>`,
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
        container
        flex
        w-12
        sm:w-6
        lg:w-4
        invalid
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
      errors: [
        {
          messageId: "invalidOrder",
        },
        {
          messageId: "invalidOrder",
        },
      ],
    },
    {
      code: `<div class="sm:w-12 w-[320px]">Allowed arbitrary value but incorrect order</div>`,
      output: `<div class="w-[320px] sm:w-12">Allowed arbitrary value but incorrect order</div>`,
      options: [
        {
          config: { mode: "jit" },
        },
      ],
      errors: errors,
    },
    {
      code: `<div className='absolute bottom-0 w-full h-[270px] flex flex-col'>clsx</div>`,
      output: `<div className='flex absolute bottom-0 flex-col w-full h-[270px]'>clsx</div>`,
      options: [
        {
          config: {
            mode: "jit",
          },
        },
      ],
      errors: errors,
    },
    {
      code: `clsx(\`absolute bottom-0 w-full h-[70px] flex flex-col\`);`,
      output: `clsx(\`flex absolute bottom-0 flex-col w-full h-[70px]\`);`,
      options: [
        {
          callees: ["clsx"],
          config: {
            mode: "jit",
          },
        },
      ],
      errors: errors,
    },
    {
      code: `clsx(\`absolute bottom-0 w-full h-[270px] flex flex-col\`);`,
      output: `clsx(\`flex absolute bottom-0 flex-col w-full h-[270px]\`);`,
      options: [
        {
          callees: ["clsx"],
          config: {
            mode: "jit",
          },
        },
      ],
      errors: errors,
    },
    {
      code: `<div className={clsx(\`absolute bottom-0 w-full h-[270px] flex flex-col\`)}>clsx</div>`,
      output: `<div className={clsx(\`flex absolute bottom-0 flex-col w-full h-[270px]\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
          config: {
            mode: "jit",
          },
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
            flex
            top-0
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
      errors: [
        {
          messageId: "invalidOrder",
        },
        {
          messageId: "invalidOrder",
        },
        {
          messageId: "invalidOrder",
        },
      ],
    },
    {
      code: `<div className="px-2 flex">...</div>`,
      output: `<div className="flex px-2">...</div>`,
      errors: [
        {
          messageId: "invalidOrder",
        },
      ],
    },
    {
      code: `ctl(\`\${enabled && "px-2 flex"}\`)`,
      output: `ctl(\`\${enabled && "flex px-2"}\`)`,
      errors: [
        {
          messageId: "invalidOrder",
        },
      ],
    },
    {
      code: `ctl(\`px-2 flex\`)`,
      output: `ctl(\`flex px-2\`)`,
      errors: [
        {
          messageId: "invalidOrder",
        },
      ],
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
      errors: [
        {
          messageId: "invalidOrder",
        },
      ],
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
          top-0
          right-0
          bottom-0
          left-0
          transition-all
          transform
        "
      >
        #19
      </div>
      `,
      errors: [
        {
          messageId: "invalidOrder",
        },
      ],
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
          "w-full h-10 rounded",
          name === "white"
            ? "flex ring-black"
            : undefined
        )}
      />
      `,
      errors: [
        {
          messageId: "invalidOrder",
        },
      ],
    },
    {
      code: `
      myTag\`
        invalid
        sm:w-6
        container
        w-12
        flex
        lg:w-4
      \`;`,
      output: `
      myTag\`
        container
        flex
        w-12
        sm:w-6
        lg:w-4
        invalid
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
      const buttonClasses = myTag\`
        \${fullWidth ? "w-12" : "w-6"}
        container
        \${fullWidth ? "sm:w-8" : "sm:w-4"}
        lg:w-9
        flex
        \${hasError && "bg-red"}
      \`;`,
      output: `
      const buttonClasses = myTag\`
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
      const buttonClasses = myTag\`
        \${fullWidth ? "w-12" : "w-6"}
        flex
        container
        \${fullWidth ? "sm:w-7" : "sm:w-4"}
        lg:py-4
        sm:py-6
        \${hasError && "bg-red"}
      \`;`,
      output: `
      const buttonClasses = myTag\`
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
      errors: [
        {
          messageId: "invalidOrder",
        },
        {
          messageId: "invalidOrder",
        },
      ],
    },
  ],
});
