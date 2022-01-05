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
      <div class="mt-0 mr-1 mb-3 ml-4">
        No shorthand possible for margin
      </div>
      `,
    },
    {
      code: `
      <div class="top-[0] right-[50%] bottom-[10px] left-[var(--some-value)]">
        No shorthand possible
      </div>`,
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
    // {
    //   code: `
    //   <div class="top-[0] right-[var(--some-value)] bottom-[0] left-[var(--some-value)]">
    //     No shorthand possible
    //   </div>`,
    //   output: `
    //   <div class="inset-y-[0] inset-x-[var(--some-value)]">
    //     No shorthand possible
    //   </div>`,
    //   errors: generateErrors("top-[0] bottom-[0] right-[var(--some-value)] left-[var(--some-value)]"),
    // },
  ],
});
