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

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-custom-classname", rule, {
  valid: [
    {
      code: `<div class="container box-content lg:box-border max-h-24">Only Tailwind CSS classnames</div>`,
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
  ],

  invalid: [
    {
      code: `<div class="w-12 my-custom">my-custom is not defined in Tailwind CSS!</div>`,
      errors: [
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "my-custom",
          },
        },
      ],
    },
    {
      code: `<div class="hello world">2 classnames are not defined in Tailwind CSS!</div>`,
      errors: [
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "hello",
          },
        },
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "world",
          },
        },
      ],
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
      errors: [
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "hello",
          },
        },
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "world",
          },
        },
      ],
    },
    {
      code: `<div class="hello tw-container tw-box-content lg_tw-box-border world">Only Tailwind CSS classnames</div>`,
      options: [
        {
          config: { prefix: "tw-", separator: "_" },
        },
      ],
      errors: [
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "hello",
          },
        },
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "world",
          },
        },
      ],
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
      errors: [
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "arbitrary-inset-[123px]",
          },
        },
      ],
    },
    {
      code: `<div className={clsx(\`hello-world flex w-full\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
      errors: [
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "hello-world",
          },
        },
      ],
    },
    {
      code: `<div className="flex skin-summer custom-2 custom-not-whitelisted">incomplete whitelist</div>`,
      options: [
        {
          whitelist: ["skin\\-(summer|xmas)", "custom\\-[1-3]"],
        },
      ],
      errors: [
        {
          messageId: "customClassnameDetected",
          data: {
            classname: "custom-not-whitelisted",
          },
        },
      ],
    },
  ],
});
