/**
 * @fileoverview Forbid using arbitrary values in classnames
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-arbitrary-value");
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
      messageId: "arbitraryValueDetected",
      data: {
        classname: classname,
      },
    });
  });
  return errors;
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-arbitrary-value", rule, {
  valid: [
    {
      code: `<div class="flex shrink-0 flex-col">No arbitrary value</div>`,
    },
    {
      code: `<div class>No errors while typing</div>`,
    },
    {
      code: `<div class="w-[10px]">Skip class attribute</div>`,
      options: skipClassAttributeOptions,
    },
    {
      code: `<div class="data-[state=open]:pb-8">Issue #318</div>`,
    },
  ],

  invalid: [
    {
      code: `<div class="w-[10px]">Arbitrary width!</div>`,
      errors: generateErrors("w-[10px]"),
    },
    {
      code: `<div class="group/name:w-[10px]">Arbitrary width in named group!</div>`,
      errors: generateErrors("group/name:w-[10px]"),
    },
    {
      code: `<div className={\`w-[10px]\`}>Arbitrary width!</div>`,
      errors: generateErrors("w-[10px]"),
    },
    {
      code: `<div class="bg-[rgba(10,20,30,0.5)] [mask-type:luminance]">Arbitrary values!</div>`,
      errors: generateErrors("bg-[rgba(10,20,30,0.5)] [mask-type:luminance]"),
    },
    {
      code: `ctl(\`
        [mask-type:luminance]
        container
        flex
        bg-[rgba(10,20,30,0.5)]
        w-12
        sm:w-6
        lg:w-4
      \`)`,
      errors: generateErrors("[mask-type:luminance] bg-[rgba(10,20,30,0.5)]"),
    },
    {
      code: `
      <nav
        className={classnames("flex relative flex-row rounded-lg select-none", {
          "bg-gray-200 p-1": !size,
          "bg-gray-100 p-[3px]": size === "sm",
        })}
      />`,
      errors: generateErrors("p-[3px]"),
    },
    {
      code: `
      classnames(
        ["flex text-[length:var(--font-size)]"],
        myFlag && [
          "rounded-[2em]",
          someBoolean ? ["p-[4vw]"] : { "leading-[1]": someOtherFlag },
        ]
      );`,
      errors: generateErrors("text-[length:var(--font-size)] rounded-[2em] p-[4vw] leading-[1]"),
    },
    {
      code: `
      cva({
        primary: ["[mask-type:luminance] container flex bg-[rgba(10,20,30,0.5)] w-12 sm:w-6 lg:w-4"],
      });`,
      options: [
        {
          callees: ["cva"],
        },
      ],
      errors: generateErrors("[mask-type:luminance] bg-[rgba(10,20,30,0.5)]"),
    },
    {
      code: `<div className={ctl('w-[10px]')}>Skip class attribute</div>`,
      options: skipClassAttributeOptions,
      errors: generateErrors("w-[10px]"),
    },
    {
      code: `
      <script>
      export default {
        data() {
          return {
            aClass: 'active',
            bClass: 'text-danger',
            cClass: ctl('w-[0]')
          }
        }
      }
      </script>
      <template>
        <span class="w-[100px]" />
        <span :class="['bg-[red]', 'h-[50%]', aClass]" />
        <span :class="{'w-[0]': true, 'm-[5px] py-[8px]': false}" />
        <span :class="ctl('border-[2px]')" />
      </template>
      `,
      errors: generateErrors("w-[0] w-[100px] bg-[red] h-[50%] w-[0] m-[5px] py-[8px] border-[2px]"),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `<div className={'min-h-[75dvh]'}>Dynamic viewport units</div>`,
      errors: generateErrors(["min-h-[75dvh]"]),
    },
    ...(['myTag', 'myTag.subTag', 'myTag(SomeComponent)'].map(tag => ({
      code: `${tag}\`w-[100px]\``,
      errors: generateErrors("w-[100px]"),
      options: [
        {
          tags: ["myTag"],
        },
      ],
    }))),
  ],
});
