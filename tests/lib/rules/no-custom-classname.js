/**
 * @fileoverview Detect classnames which do not belong to Tailwind CSS
 * @author no-custom-classname
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
  valid: [
    {
      code: `<div class="container box-content lg:box-border max-h-24 self-end">Only Tailwind CSS classnames</div>`,
    },
    {
      code: `<template><div class="container box-content lg:box-border max-h-24 self-end">Only Tailwind CSS classnames</div></template>`,
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      ctl(\`
        sm:w-6
        w-8
        container
        w-12
        flex
        lg:w-4
      \`);`,
    },
    {
      code: `<div class="tw-container tw-box-content lg_tw-box-border">Only Tailwind CSS classnames</div>`,
      options: [
        {
          config: { prefix: "tw-", separator: "_" },
        },
      ],
    },
    {
      code: `<div class="!arbitrary-inset-[123px]">Allow arbitrary value support + Built-in important modifier</div>`,
      options: [
        {
          config: {
            mode: "jit",
            prefix: "arbitrary-",
          },
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
      code: `<div class="bg-custom-color">Using dash in custom color name</div>`,
      options: [
        {
          config: {
            theme: {
              colors: {
                "custom-color": "#B4D4AA",
              },
            },
          },
        },
      ],
    },
    {
      code: `<div className={clsx(\`flex w-full\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
    },
    {
      code: `<div className="flex skin-summer custom-2">whitelisted</div>`,
      options: [
        {
          whitelist: ["skin\\-(summer|xmas)", "custom\\-[1-3]"],
        },
      ],
    },
    {
      code: `<div className="text-foo border-bar">defined in textColor</div>`,
      options: [
        {
          config: { theme: { textColor: { foo: "#123456" }, borderColor: { bar: "#654321" } } },
        },
      ],
    },
    {
      code: `<div className="dark">dark should be allowed in class mode</div>`,
      options: [
        {
          config: { darkMode: "class" },
        },
      ],
    },
    {
      code: `
      <div class="group border-indigo-500 hover:bg-white hover:shadow-lg hover:border-transparent">
      <p class="text-indigo-600 group-hover:text-gray-900">New Project</p>
      <p class="text-indigo-500 group-hover:text-gray-500">Create a new project from a variety of starting templates.</p>
      </div>`,
    },
    {
      code: `
      <div class="some base white-listed classnames">
        from css file
      </div>`,
      options: [
        {
          cssFiles: ["./tests/**/*.css"],
        },
      ],
    },
    {
      code: `
      myTag\`
        sm:w-6
        w-8
        container
        w-12
        flex
        lg:w-4
      \`;`,
      options: [{ tags: ["myTag"] }],
    },
    {
      code: `
      <div class="flex flex-row-reverse space-x-4 space-x-reverse">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </div>`,
    },
    {
      code: `
      <div class="text-red-700 border-2 border-current bg-current p-10">
        <input class="bg-gray-500 text-white placeholder-current" placeholder="placeholder-current" />
        <div class="text-yellow-400">
          <div class="divide-current divide-y-4">
            <button class="ring-2 p-2 focus:ring-current ring-offset-current ring-offset-2 outline-none">button with ringColor</button>
            <div>2</div>
            <div class="text-current">3</div>
          </div>
        </div>
        <svg class="stroke-current text-yellow-400 stroke-2">
          <circle cx="50" cy="50" r="20" />
        </svg>
        <svg class="fill-current text-yellow-400 stroke-0">
          <circle cx="50" cy="50" r="20" />
        </svg>
        <div class="bg-gradient-to-r from-red-500 to-current text-green-300 h-20 w-full"></div>
        <div class="bg-gradient-to-l from-current to-black text-green-300 h-20 w-full"></div>
      </div>
      `,
    },
    {
      code: `
      <div class="bg-red-600 p-10">
        <p class="text-yellow-400 border-2 border-green-600 border-t-current p-2">border-t-current</p>
      </div>
      `,
      options: [
        {
          config: {
            mode: "jit",
          },
        },
      ],
    },
    {
      code: `
      <div class="aspect-none">
        aspect-none is a valid classname
      </div>`,
    },
    {
      code: `
      <div class="font-mono">
        font-mono is a valid classname
      </div>`,
    },
    {
      code: `<div class="tw-inset-0">with prefix</div>`,
      options: [
        {
          config: {
            prefix: "tw-",
          },
        },
      ],
    },
    {
      code: `<div class="tw/inset-0">with prefix</div>`,
      options: [
        {
          config: {
            prefix: "tw/",
          },
        },
      ],
    },
    {
      code: `<div class="[tw]inset-0">with prefix</div>`,
      options: [
        {
          config: {
            prefix: "[tw]",
          },
        },
      ],
    },
    {
      code: `<div class="[tw!]inset-0">with prefix</div>`,
      options: [
        {
          config: {
            prefix: "[tw!]",
          },
        },
      ],
    },
    {
      code: `<div class="[.tw!]inset-0">with prefix</div>`,
      options: [
        {
          config: {
            prefix: "[.tw!]",
          },
        },
      ],
    },
    {
      code: `<div class="[-tw!-]inset-0">with prefix</div>`,
      options: [
        {
          config: {
            prefix: "[-tw!-]",
          },
        },
      ],
    },
    {
      code: `<div class="p/r[e].f!-x_inset-0">with prefix</div>`,
      options: [
        {
          config: {
            prefix: "p/r[e].f!-x_",
          },
        },
      ],
    },
    {
      code: `<div class="p/r[e].f!-x_grid p/r[e].f!-x_block p/r[e].f!-x_flex">Nasty prefix</div>`,
      options: [
        {
          config: {
            prefix: "p/r[e].f!-x_",
          },
        },
      ],
    },
    {
      code: `
      <div class="transform-none">Using</div>
      <div class="flex flex-col">HTML</div>`,
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    {
      code: `
      <div class="p/r[e].f!-x_flex">Using HTML</div>
      <div class="p/r[e].f!-x_block">With nasty prefix</div>`,
      options: [
        {
          config: {
            prefix: "p/r[e].f!-x_",
          },
        },
      ],
      parser: require.resolve("@angular-eslint/template-parser"),
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
            <h1 className={"w-12 my-custom"}>Welcome {name}</h1>
            <p>Bye {name}</p>
          </>
        );
      }
      
      export default Fake;
      `,
      parser: require.resolve("@typescript-eslint/parser"),
      errors: generateErrors("my-custom"),
    },
    {
      code: `<div class="w-12 my-custom">my-custom is not defined in Tailwind CSS!</div>`,
      errors: generateErrors("my-custom"),
    },
    {
      code: `<template><div class="w-12 my-custom">my-custom is not defined in Tailwind CSS!</div></template>`,
      errors: generateErrors("my-custom"),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<div class="hello world">2 classnames are not defined in Tailwind CSS!</div>`,
      errors: generateErrors("hello world"),
    },
    {
      code: `
      ctl(\`
        sm:w-6
        hello
        w-8
        container
        w-12
        world
        flex
        lg:w-4
      \`);`,
      errors: generateErrors("hello world"),
    },
    {
      code: `<div class="hello tw-container tw-box-content lg_tw-box-border world">Only Tailwind CSS classnames</div>`,
      options: [
        {
          config: { prefix: "tw-", separator: "_" },
        },
      ],
      errors: generateErrors("hello world"),
    },
    {
      code: `<div class="arbitrary-inset-[123px]">No arbitrary value support without JIT</div>`,
      options: [
        {
          config: {
            prefix: "arbitrary-",
            theme: { inset: {} },
          },
        },
      ],
      errors: generateErrors("arbitrary-inset-[123px]"),
    },
    {
      code: `<div className={clsx(\`hello-world flex w-full\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
      errors: generateErrors("hello-world"),
    },
    {
      code: `
      ctl(\`
        px-4
        custom-1
        py-1
        \${
          !isDisabled &&
          \`
            lg:focus:ring-1
            custom-2
            focus:ring-2
          \`
        }
        \${
          isDisabled &&
          \`
            lg:opacity-25
            custom-3
            opacity-50
          \`
        }
      \`)
      `,
      errors: generateErrors("custom-2 custom-3 custom-1"),
    },
    {
      code: `<div className="flex skin-summer custom-2 custom-not-whitelisted">incomplete whitelist</div>`,
      options: [
        {
          whitelist: ["skin\\-(summer|xmas)", "custom\\-[1-3]"],
        },
      ],
      errors: generateErrors("custom-not-whitelisted"),
    },
    {
      code: `ctl(\`\${enabled && "px-2 yo flex"}\`)`,
      errors: generateErrors("yo"),
    },
    {
      code: `
      <div
        className={clsx(
          "w-full h-10 rounded",
          name === "white"
            ? "ring-black azerty flex"
            : undefined
        )}
      />
      `,
      errors: generateErrors("azerty"),
    },
    {
      code: `<div className="dark">dark is invalid without darkMode in class</div>`,
      options: [
        {
          config: { darkMode: "media" },
        },
      ],
      errors: generateErrors("dark"),
    },
    {
      code: `
      myTag\`
        sm:w-6
        hello
        w-8
        container
        w-12
        world
        flex
        lg:w-4
      \`;`,
      options: [{ tags: ["myTag"] }],
      errors: generateErrors("hello world"),
    },
    {
      code: `
      myTag\`
        px-4
        custom-1
        py-1
        \${
          !isDisabled &&
          \`
            lg:focus:ring-1
            custom-2
            focus:ring-2
          \`
        }
        \${
          isDisabled &&
          \`
            lg:opacity-25
            custom-3
            opacity-50
          \`
        }
      \`
      `,
      options: [{ tags: ["myTag"] }],
      errors: generateErrors("custom-2 custom-3 custom-1"),
    },
    {
      code: `
      <div class="bg-red-600 p-10">
        <p class="text-yellow-400 border-2 border-green-600 border-t-current p-2">border-t-current</p>
      </div>
      `,
      errors: generateErrors("border-t-current"),
    },
  ],
});
