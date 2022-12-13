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
  ],

  invalid: [
    {
      code: `<div class="w-[10px]">Arbitrary width!</div>`,
      errors: generateErrors("w-[10px]"),
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
        className={cns("flex relative flex-row rounded-lg select-none", {
          "bg-gray-200 p-1": !size,
          "bg-gray-100 p-[3px]": size === "sm",
        })}
      />`,
      options: [
        {
          callees: ["cns"],
        },
      ],
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
      code: `<div className={ctl('w-[10px]')}>Skip class attribute</div>`,
      options: skipClassAttributeOptions,
      errors: generateErrors("w-[10px]"),
    },
  ],
});
