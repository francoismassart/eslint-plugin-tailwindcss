/**
 * @fileoverview Detect unjustified arbitrary values
 * @description You should avoid using arbitrary values if a matching preset exists
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unnecessary-arbitrary-value");
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

var config = [
  {
    config: {
      theme: {
        extend: {
          spacing: {
            spacing: "99px",
          },
          height: {
            zerodotzero: "0.0",
            none: "0",
            custom: "10%",
            zeropx: "0.00px",
          },
        },
      },
    },
  },
];

var generateErrors = (classnamesArr, presetsArr) => {
  const errors = [];
  const fixables = [];
  const fixablesPresets = [];
  classnamesArr.map((classname, idx) => {
    if (presetsArr[idx].length === 1) {
      fixables.push(classname);
      fixablesPresets.push(presetsArr[idx]);
    } else {
      errors.push({
        messageId: "unnecessaryArbitraryValueDetectedMultiple",
        data: {
          classname: classname,
          presets: presetsArr[idx].join("' or '"),
        },
      });
    }
  });
  if (fixables.length) {
    errors.push({
      messageId: "unnecessaryArbitraryValueDetected",
      data: {
        classname: fixables.join("', '"),
        presets: fixablesPresets.join("', '"),
      },
    });
  }
  return errors;
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("arbitrary-values", rule, {
  valid: [
    {
      code: `
      <pre class="h-[123px]">h-[123px]</pre>
      `,
      options: config,
    },
  ],

  invalid: [
    {
      code: `
      <pre class="h-[0]">h-[0]</pre>
      `,
      options: config,
      errors: generateErrors(["h-[0]"], [["h-0", "h-zerodotzero", "h-none", "h-zeropx"]]),
    },
    {
      code: `
      <pre class="sm:h-[10%]">sm:h-[10%]</pre>
      `,
      output: `
      <pre class="sm:h-custom">sm:h-[10%]</pre>
      `,
      options: config,
      errors: generateErrors(["sm:h-[10%]"], [["sm:h-custom"]]),
    },
    {
      code: `
      <pre class="-z-[-10]">z-10</pre>
      `,
      output: `
      <pre class="z-10">z-10</pre>
      `,
      options: config,
      errors: generateErrors(["-z-[-10]"], [["z-10"]]),
    },
    {
      code: `
      <pre class="m-[-1.25rem]">-m-5</pre>
      `,
      output: `
      <pre class="-m-5">-m-5</pre>
      `,
      options: config,
      errors: generateErrors(["m-[-1.25rem]"], [["-m-5"]]),
    },
    {
      code: `
      <pre class="m-[-1.25rem] -z-[-10]">-m-5 z-10</pre>
      `,
      output: `
      <pre class="-m-5 z-10">-m-5 z-10</pre>
      `,
      options: config,
      errors: generateErrors(["m-[-1.25rem]", "-z-[-10]"], [["-m-5"], ["z-10"]]),
    },
    {
      code: `
      <pre class="sm:-m-[2.5rem]">sm:-m-10</pre>
      `,
      output: `
      <pre class="sm:-m-10">sm:-m-10</pre>
      `,
      options: config,
      errors: generateErrors(["sm:-m-[2.5rem]"], [["sm:-m-10"]]),
    },
    {
      code: `
ctl(\`
  \${big ? 'sm:-m-[2.5rem] lg:h-100' : 'h-[60px] md:h-[80px] lg:h-100'}
  group
  w-[160px]
\`)`,
      output: `
ctl(\`
  \${big ? 'sm:-m-10 lg:h-100' : 'h-[60px] md:h-[80px] lg:h-100'}
  group
  w-[160px]
\`)`,
      options: config,
      errors: generateErrors(["sm:-m-[2.5rem]"], [["sm:-m-10"]]),
    },
  ],
});
