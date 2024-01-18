/**
 * @fileoverview Forbid using arbitrary values in classnames
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-internal-style");
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

const options = [
  {
    classRegex: "^classes$",
    externalCallees: ["externcss"],
  },
];

var generateErrors = (classnames) => {
  const errors = [];
  if (typeof classnames === "string") {
    classnames = classnames.split(" ");
  }
  classnames.map((classname) => {
    errors.push({
      messageId: "internalStyleDetected",
      data: {
        classname: classname,
      },
    });
  });
  return errors;
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-internal-style", rule, {
  valid: [
    {
      code: `<Component class="pt-2">Not using internal style property</Component>`,
      options,
    },
    {
      code: `<Component className="pt-2">Not using internal style property</Component>`,
      options,
    },
    {
      code: `<Component className={classnames("pt-2")}>Not using internal style property</Component>`,
      options,
    },
    {
      code: `<Component classes="mt-1 top-0 absolute">No internal styles</Component>`,
      options,
    },
  ],

  invalid: [
    {
      code: `<Component classes="pt-2">Padding is an internal style!</Component>`,
      errors: generateErrors("pt-2"),
      options,
    },
    {
      code: `<Component className={externcss("mt-2", "pt-2")}>Padding is an internal style!</Component>`,
      errors: generateErrors("pt-2"),
      options,
    },
  ],
});
