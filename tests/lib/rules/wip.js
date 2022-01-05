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
    <div class="top-[0] right-0 bottom-0 left-[0]">
      Cannot merge mixed values
    </div>`,
    },
  ],

  invalid: [
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
        Possible shorthand for border
      </div>
      `,
      output: `
      <div class="border-y-4 border-r-4 border-l-0 md:border-y-0 md:border-r-0 lg:border">
        Possible shorthand for border
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
        Possible shorthand for border
      </div>
      `,
      output: `
      <div class="border-y-4 border-r-4 border-l-0">
        Possible shorthand for border
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
  ],
});
