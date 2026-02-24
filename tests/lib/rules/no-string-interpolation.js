/**
 * @fileoverview Disallow dynamic Tailwind class construction inside class attributes
 * @author Angelos Athanasakos
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var { RuleTester } = require("eslint");
var rule = require("../../../lib/rules/no-string-interpolation");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var RuleTester = require("eslint").RuleTester;

var parserOptions = {
  ecmaVersion: 2019,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-string-interpolation", rule, {
  valid: [
    {
      code: `<div className="bg-red-600 text-lg" />`,
    },

    {
      code: `<div className={color} />`,
    },

    {
      code: `<div className={\`\${color} text-lg\`} />`,
    },

    {
      code: `<div className={\`text-lg \${color}\`} />`,
    },

    {
      code: `<div className={\`\${color}\`} />`,
    },

    {
      code: `
        <div
          className={classNames(containerClassName, 'w-22 text-center', {
            inline: containerClassName.length === 0
          })}
        />
      `,
    },

    {
      code: `
        const Spinner = ({ circlesClassName = 'bg-primary', size }) => (
          <>
            <Bounce size={size} className={circlesClassName} />
            <Bounce size={size} className={\`\${circlesClassName} animation-delay-16\`} />
            <Bounce size={size} className={\`\${circlesClassName} animation-delay-32\`} />
          </>
        );
      `,
    },
  ],

  invalid: [
    {
      code: `<div className={\`bg-\${color}-600\`} />`,
      errors: [{ messageId: "noInterpolation" }],
    },

    {
      code: `<div className={\`text-\${size}\`} />`,
      errors: [{ messageId: "noInterpolation" }],
    },

    {
      code: `<div className={\`p-\${spacing}-4\`} />`,
      errors: [{ messageId: "noInterpolation" }],
    },

    {
      code: `<div className={\`border-\${color}-\${shade}\`} />`,
      errors: [{ messageId: "noInterpolation" }],
    },
  ],
});
