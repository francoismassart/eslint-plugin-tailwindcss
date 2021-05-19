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
      code: `<div class='box-content lg:box-border'>Simple quotes</div>`,
    },
    {
      code: `<div class="p-5 lg:p-4 md:py-2 sm:px-3 xl:px-6">'p', then 'py' then 'px'</div>`,
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
  ],
  invalid: [
    {
      code: `<div class="sm:w-6 container w-12">Classnames will be ordered</div>`,
      output: `<div class="container w-12 sm:w-6">Classnames will be ordered</div>`,
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
      code: `<div class="bg-gradient-to-r from-green-400 to-blue-500 focus:from-pink-500 focus:to-yellow-500"></div>`,
      output: `<div class="bg-gradient-to-r from-green-400 focus:from-pink-500 to-blue-500 focus:to-yellow-500"></div>`,
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
        \${fullWidth ? "sm:w-12" : "sm:w-4"}
        lg:w-4
        flex
        \${hasError && "bg-red"}
      \`);`,
      output: `
      const buttonClasses = ctl(\`
        \${fullWidth ? "w-12" : "w-6"}
        container
        \${fullWidth ? "sm:w-12" : "sm:w-4"}
        flex
        lg:w-4
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
        \${fullWidth ? "sm:w-12" : "sm:w-4"}
        lg:py-4
        sm:py-6
        \${hasError && "bg-red"}
      \`);`,
      output: `
      const buttonClasses = ctl(\`
        \${fullWidth ? "w-12" : "w-6"}
        container
        flex
        \${fullWidth ? "sm:w-12" : "sm:w-4"}
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
  ],
});
