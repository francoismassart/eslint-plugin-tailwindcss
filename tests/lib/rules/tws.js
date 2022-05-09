/**
 * @fileoverview Detect classnames which do not belong to Tailwind CSS
 * @author François Massart
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
  valid: [],

  invalid: [
    {
      code: `
      <div className={tws(\`classes-like this\`, someBoolean && \`more class-es\`)}>
        classes-like this more class-es
      </div>
      `,
      options: [
        {
          callees: ["tws"],
        },
      ],
      errors: generateErrors("classes-like this more class-es"),
    },
    {
      code: `
      <div style={tws(\`classes-like this\`, someBoolean && \`more class-es\`)}>
        classes-like this more class-es
      </div>
      `,
      options: [
        {
          callees: ["tws"],
        },
      ],
      errors: generateErrors("classes-like this more class-es"),
    },
    {
      code: `
      tw\`class-es used he-re\``,
      options: [{ tags: ["tw"] }],
      errors: generateErrors("class-es used he-re"),
    },
  ],
});
