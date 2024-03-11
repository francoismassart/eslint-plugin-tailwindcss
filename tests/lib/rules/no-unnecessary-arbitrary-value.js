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
  classnamesArr.map((classname, idx) => {
    errors.push({
      messageId: "unnecessaryArbitraryValueDetected",
      data: {
        classname: classname,
        presets: presetsArr[idx].join("' or '"),
      },
    });
  });
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
      errors: generateErrors(["m-[-1.25rem], -z-[-10]"], [["-m-5, z-10"]]),
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
      <pre class={\`m-[0]\`}>...</pre>
      `,
      output: `
      <pre class={\`m-0\`}>...</pre>
      `,
      options: config,
      errors: generateErrors(["m-[0]"], [["m-0"]]),
    },
    {
      code: `
      <pre class={\`m-[0] \${some}\`}>...</pre>
      `,
      output: `
      <pre class={\`m-0 \${some}\`}>...</pre>
      `,
      options: config,
      errors: generateErrors(["m-[0]"], [["m-0"]]),
    },
    {
      code: `
      <pre class={\`m-[0] \${some} p-[0]\`}>...</pre>
      `,
      output: `
      <pre class={\`m-0 \${some} p-0\`}>...</pre>
      `,
      options: config,
      errors: generateErrors(["m-[0]", "p-[0]"], [["m-0"], ["p-0"]]),
    },
    {
      code: `
      <pre class={\`m-[0] \${cellHoverClasses} hidden w-[0px] dark:block\`}>...</pre>
      `,
      output: `
      <pre class={\`m-0 \${cellHoverClasses} hidden w-0 dark:block\`}>...</pre>
      `,
      options: config,
      errors: generateErrors(["m-[0]", "w-[0px]"], [["m-0"], ["w-0"]]),
    },
    {
      code: `
      <pre class={\`\${cellHoverClasses} hidden w-[0px] dark:block\`}>...</pre>
      `,
      output: `
      <pre class={\`\${cellHoverClasses} hidden w-0 dark:block\`}>...</pre>
      `,
      options: config,
      errors: generateErrors(["w-[0px]"], [["w-0"]]),
    },
    {
      code: `
      <pre class={\`block h-[100%] \${logoLargeSize}\`}>...</pre>
      `,
      output: `
      <pre class={\`block h-full \${logoLargeSize}\`}>...</pre>
      `,
      options: config,
      errors: generateErrors(["h-[100%]"], [["h-full"]]),
    },
    {
      code: `
<section
  className={ctl(\`
    fixed h-[100%] lg:top-[116px]
    \${!isStuck && 'hidden'}
  \`)}
>
  section
</section>`,
      output: `
<section
  className={ctl(\`
    fixed h-full lg:top-[116px]
    \${!isStuck && 'hidden'}
  \`)}
>
  section
</section>`,
      options: config,
      errors: generateErrors(["h-[100%]"], [["h-full"]]),
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
