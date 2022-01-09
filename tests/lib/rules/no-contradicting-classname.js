/**
 * @fileoverview Avoid contradicting Tailwind CSS classnames (e.g. 'w-3 w-5')
 * @author François Massart
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-contradicting-classname");
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
        aspectRatio: {
          1: "1",
          9: "9",
          16: "16",
        },
      },
    },
  },
];

var generateErrors = (classnames) => {
  const errors = [];
  if (typeof classnames === "string") {
    classnames = [classnames];
  }
  classnames.map((classname) => {
    const cls = classname.split(" ").join(", ");
    errors.push({
      messageId: "conflictingClassnames",
      data: {
        classnames: cls,
      },
    });
  });
  return errors;
};

var ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-contradicting-classname", rule, {
  valid: [
    {
      code: '<div class="overflow-auto overflow-x-hidden lg:overflow-x-auto lg:dark:overflow-x-visible lg:dark:active:overflow-x-visible active:overflow-auto"></div>',
    },
    {
      code: '<div class="p-1 px-2 sm:px-3 sm:pt-0">Accepts shorthands</div>',
    },
    {
      code: '<div class="ring-2 ring-pink-300 ring-inset">Ring</div>',
    },
    {
      code: '<template><div class="overflow-auto overflow-x-hidden lg:overflow-x-auto lg:dark:overflow-x-visible lg:dark:active:overflow-x-visible active:overflow-auto"></div></template>',
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: '<template><div class="p-1 px-2 sm:px-3 sm:pt-0">Accepts shorthands</div></template>',
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: '<div class="p-1 px-2 sm_px-3 sm_pt-0">Still works with different separator</div>',
      options: [
        {
          config: { separator: "_" },
        },
      ],
    },
    {
      code: '<div class="p-[10px] px-2 sm:px-3 sm:pt-[5%]">Still works with different separator</div>',
      options: config,
    },
    {
      code: '<div class="grid grid-cols-3"></div>',
    },
    {
      code: `
      ctl(\`
        text-white
        rounded-md
        py-5
        px-10
        text-sm
        \${
          type === 'primary' &&
          \`
            bg-black
            hover:bg-blue
          \`
        }
        \${
          type === 'secondary' &&
          \`
            bg-transparent
            hover:bg-green
          \`
        }
        disabled:cursor-not-allowed
      \`)
      `,
    },
    {
      code: `
      <div class="text-[11px] text-[#b3b3b3]">
        same prefix, different arbitrary values
      </div>`,
      options: config,
    },
    {
      code: `
      myTag\`
        text-white
        rounded-md
        py-5
        px-10
        text-sm
        \${
          type === 'primary' &&
          \`
            bg-black
            hover:bg-blue
          \`
        }
        \${
          type === 'secondary' &&
          \`
            bg-transparent
            hover:bg-green
          \`
        }
        disabled:cursor-not-allowed
      \`
      `,
      options: [
        {
          tags: ["myTag"],
        },
      ],
    },
    {
      code: `
      <div class="flex flex-row-reverse space-x-4 space-x-reverse">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </div>`,
    },
    {
      code: `
      <div class="text-[11px] text-[#b3b3b3] border-[length:var(--foo)] border-[color:var(--bar)] ring-[0.5px] ring-[rgb(48,151,255)] ring-offset-[#1234] ring-offset-[length:var(--guess-who)] stroke-[red] stroke-[2vh] bg-[color:var(--donno)]">
        Same class prefix, type prefix may be required for resolving ambiguous values
      </div>`,
    },
    {
      code: `
      <div class="scale-75 translate-x-4 skew-y-3 motion-reduce:transform-none">
        Legit transform-none
      </div>`,
    },
    {
      code: `
      <div class="snap-mandatory snap-x">
        <div class="snap-center">
          <img src="https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80" />
        </div>
      </div>`,
    },
  ],

  invalid: [
    {
      code: `
      export interface FakePropsInterface {
        readonly name?: string;
      }
      
      function Fake({
        name = 'yolo'
      }: FakeProps) {
      
        return (
          <>
            <h1 className={"container w-1 w-2"}>Welcome {name}</h1>
            <p>Bye {name}</p>
          </>
        );
      }
      
      export default Fake;
      `,
      parser: require.resolve("@typescript-eslint/parser"),
      errors: generateErrors("w-1 w-2"),
    },
    {
      code: '<div class="container w-1 w-2"></div>',
      errors: generateErrors("w-1 w-2"),
    },
    {
      code: '<div class="container sm_w-3 sm_w-4 lg_w-6"></div>',
      options: [
        {
          config: { separator: "_" },
        },
      ],
      errors: generateErrors("sm_w-3 sm_w-4"),
    },
    {
      code: '<template><div class="container w-1 w-2"></div></template>',
      errors: generateErrors("w-1 w-2"),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: '<template><div class="container sm_w-3 sm_w-4 lg_w-6"></div></template>',
      options: [
        {
          config: { separator: "_" },
        },
      ],
      errors: generateErrors("sm_w-3 sm_w-4"),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: '<div class="flex-1 order-first order-11 sm:order-last flex-none"></div>',
      errors: generateErrors(["flex-1 flex-none", "order-first order-11"]),
    },
    {
      code: `
      ctl(\`
        invalid bis
        sm:w-6
        w-8
        container
        w-12
        flex
        lg:w-4
      \`);`,
      errors: generateErrors("w-8 w-12"),
    },
    {
      code: '<div class="container sm:w-3 sm:w-[40%] lg:w-6 z-0 z-[var(--some)]"></div>',
      options: config,
      errors: generateErrors(["z-0 z-[var(--some)]", "sm:w-3 sm:w-[40%]"]),
    },
    {
      code: `<div className={clsx(\`container sm:w-3 sm:w-2 lg:w-6\`)}>clsx</div>`,
      options: [
        {
          callees: ["clsx"],
        },
      ],
      errors: generateErrors("sm:w-3 sm:w-2"),
    },
    {
      code: `
      ctl(\`
        px-2
        px-4
        \${
          !isDisabled &&
          \`
            py-1
            py-2
          \`
        }
        \${
          isDisabled &&
          \`
            w-1
            w-2
          \`
        }
      \`)
      `,
      errors: generateErrors(["py-1 py-2", "w-1 w-2", "px-2 px-4"]),
    },
    {
      code: `ctl(\`\${enabled && "px-2 px-0"}\`)`,
      errors: generateErrors("px-2 px-0"),
    },

    {
      code: `
      myTag\`
        invalid bis
        sm:w-6
        w-8
        container
        w-12
        flex
        lg:w-4
      \`;`,
      options: [{ tags: ["myTag"] }],
      errors: generateErrors("w-8 w-12"),
    },
    {
      code: `
      myTag\`
        px-2
        px-4
        \${
          !isDisabled &&
          \`
            py-1
            py-2
          \`
        }
        \${
          isDisabled &&
          \`
            w-1
            w-2
          \`
        }
      \`
      `,
      options: [{ tags: ["myTag"] }],
      errors: generateErrors(["py-1 py-2", "w-1 w-2", "px-2 px-4"]),
    },
    {
      code: `myTag\`\${enabled && "px-2 px-0"}\``,
      options: [{ tags: ["myTag"] }],
      errors: generateErrors("px-2 px-0"),
    },
    {
      code: `
      <div class="shrink shrink-0 shrink-[inherit] shrink-[initial] shrink-[unset] shrink-[var(--some)] shrink-[0.5] shrink-[5]">
        Arbitrary values for positive integers
      </div>
      `,
      options: config,
      errors: generateErrors(
        "shrink shrink-0 shrink-[inherit] shrink-[initial] shrink-[unset] shrink-[var(--some)] shrink-[0.5] shrink-[5]"
      ),
    },
    {
      code: `
      <div class="order-2 -order-1 order-[inherit] order-[initial] order-[unset] order-[var(--some)] order-[2] order-[-3]">
        Arbitrary values for order
      </div>
      `,
      options: config,
      errors: generateErrors(
        "order-2 -order-1 order-[inherit] order-[initial] order-[unset] order-[var(--some)] order-[2] order-[-3]"
      ),
    },
    {
      code: `
      <div class="z-0 -z-10 z-[auto] z-[inherit] z-[initial] z-[unset] z-[var(--some)] z-[2] z-[-3]">
        Arbitrary values for zIndex!
      </div>
      `,
      options: config,
      errors: generateErrors("z-0 -z-10 z-[auto] z-[inherit] z-[initial] z-[unset] z-[var(--some)] z-[2] z-[-3]"),
    },
    {
      code: `
      <div class="flex-auto flex-[2,2,10%] flex-[var(--some)]">
        Arbitrary values for flex
      </div>
      `,
      options: config,
      errors: generateErrors("flex-auto flex-[2,2,10%] flex-[var(--some)]"),
    },
    {
      code: `
      <div class="rounded-xl rounded-[50%/10%] rounded-[10%,30%,50%,70%] rounded-[var(--some)]">
        Arbitrary values for border-radius
      </div>
      `,
      options: config,
      errors: generateErrors("rounded-xl rounded-[50%/10%] rounded-[10%,30%,50%,70%] rounded-[var(--some)]"),
    },
    {
      code: `<div class="aspect-none aspect-w-16 aspect-w-10 aspect-h-9">aspect</div>`,
      options: config,
      errors: generateErrors("aspect-none aspect-w-16"),
    },
    // {
    //   code: `
    //   <div class="scale-75 transform-none">
    //     Conflicting transform-none
    //   </div>`,
    //   errors: generateErrors("scale-75 transform-none"),
    // },
  ],
});
