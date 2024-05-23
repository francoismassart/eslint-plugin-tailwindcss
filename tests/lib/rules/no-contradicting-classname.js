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

const skipClassAttributeOptions = [
  {
    skipClassAttribute: true,
    config: {
      theme: {},
      plugins: [],
    },
  },
];

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
    ...(['myTag', 'myTag.subTag', 'myTag(SomeComponent)'].map(tag => ({
      code: `
      ${tag}\`
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
    }))),
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
      <div class="text-left text-lg text-[color:var(--my-var,#ccc)]]">
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
      <div class="group/name:scale-75 scale-50">
        named group
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
    {
      code: `
      <div class="p-1 px-2 sm:px-3 sm:pt-0">Accepts shorthands</div>
      <div class="m-1 mx-2 sm:mx-3">Accepts shorthands</div>`,
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    {
      code: `
      <div className={ctl(\`
        leading-loose
        prose
        lg:prose-lg
        lg:prose-h1:text-36
        lg:prose-h1:leading-[2.75rem]
        lg:prose-h2:text-28
        lg:prose-h2:leading-[2.125rem]
        lg:prose-h3:text-24
        lg:prose-h3:leading-[1.8125rem]
        lg:prose-blockquote:py-60
        lg:prose-blockquote:pr-[5rem]
        lg:prose-blockquote:pl-[6rem]
        lg:prose-p:text-16
        lg:prose-p:leading-32
        dark:prose-headings:text-content-100
        dark:prose-hr:border-navy-blue-800
        dark:prose-code:text-sand-100
        dark:prose-blockquote:text-sand-100
        dark:prose-a:bg-navy-blue-700
        dark:prose-a:text-navy-blue-100
        dark:prose-a:visited:bg-navy-blue-700
        dark:prose-a:visited:text-teal-200
        dark:prose-a:hover:bg-navy-blue-500
        dark:prose-a:hover:text-navy-blue-100
        dark:prose-a:focus:outline-focus
        dark:prose-thead:bg-purple-500
        dark:prose-thead:text-primary
        dark:prose-tr:border-b-purple-500
        dark:prose-pre:bg-[#1f2227]
        dark:prose-pre:text-[#639bee]
        dark:prose-li:before:text-primary
      \`)}>
        https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/97
      </div>`,
      options: [
        {
          config: {
            plugins: [require("@tailwindcss/typography")],
          },
        },
      ],
    },
    {
      code: "<div class>No errors while typing</div>",
    },
    {
      code: '<div class="opacity-100 [&[aria-hidden=true]]:opacity-0">No errors while typing</div>',
    },
    {
      code: `
      <div
        className={clsx(
          "[clip-path:circle(100%_at_center)]",
          "[mask-image:radial-gradient(circle_at_center,transparent_51%,black_54.8%)]",
          "bg-[conic-gradient(transparent,#9e9ab1)]",
          "pointer-events-none h-6 w-6 animate-spin rounded-full"
        )}
      />`,
    },
    {
      code: `
      <div
        className={ctl(\`
          [clip-path:circle(100%_at_center)]
          [mask-image:radial-gradient(circle_at_center,transparent_51%,black_54.8%)]
          lg:[mask-image:radial-gradient(circle_at_center,transparent_10%,black_10%)]
          bg-[conic-gradient(transparent,#ff00ff)]
          lg:bg-[conic-gradient(transparent,#9e9ab1)]
          pointer-events-none
          h-6
          w-6
          animate-spin
          rounded-full
        \`)}
      />`,
    },
    {
      code: `
      <div class="bg-[url('/image.jpg')] bg-center">Issue #186</div>`,
    },
    {
      code: `<section className="bg-[image:var(--bg-small)] bg-center" />`,
    },
    {
      code: `
        <div>
          <div className={'h-svh min-h-svh max-h-svh'}>Dynamic viewport units</div>
          <div className={'h-lvh min-h-lvh max-h-lvh'}>Dynamic viewport units</div>
          <div className={'h-dvh min-h-dvh max-h-dvh'}>Dynamic viewport units</div>
        </div>
      `,
    },
    {
      code: `<div class="diagonal-fractions tabular-nums lining-nums">Font Variant Numeric #316</div>`,
    },
    {
      code: `<div class="shadow-md shadow-[#aabbcc]">Issue #298</div>`,
    },
    {
      code: `<pre class="touch-pan-left touch-pan-y touch-pinch-zoom touch-manipulation">valid combo for issue #293</pre>`,
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
      classnames(
        ["p-2 p-4"],
        myFlag && [
          "w-1 w-2",
          someBoolean ? ["py-1 py-2"] : { "px-2 px-4": someOtherFlag },
        ]
      );`,
      errors: generateErrors(["p-2 p-4", "w-1 w-2", "py-1 py-2", "px-2 px-4"]),
    },
    ...(['myTag', 'myTag.subTag', 'myTag(SomeComponent)'].flatMap(tag => [
      {
        code: `
        ${tag}\`
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
        ${tag}\`
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
        code: `${tag}\`\${enabled && "px-2 px-0"}\``,
        options: [{ tags: ["myTag"] }],
        errors: generateErrors("px-2 px-0"),
      },
      {
        code: `${tag}\`\${enabled ? "px-2 px-0" : ""}\``,
        options: [{ tags: ["myTag"] }],
        errors: generateErrors("px-2 px-0"),
      },
    ])),
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
      code: `
      <div class="text-white text-[color:var(--my-var,#ccc)]">
        Arbitrary values for text color
      </div>
      `,
      errors: generateErrors("text-white text-[color:var(--my-var,#ccc)]"),
    },
    {
      code: `
      <div class="text-lg text-[length:var(--my-var)]">
        Arbitrary values for text font size
      </div>
      `,
      errors: generateErrors("text-lg text-[length:var(--my-var)]"),
    },
    {
      code: `
      <div class="bg-white bg-[color:var(--donno)]">
        Arbitrary values for background color
      </div>
      `,
      errors: generateErrors("bg-white bg-[color:var(--donno)]"),
    },
    {
      code: `<div class="aspect-none aspect-w-16 aspect-w-10 aspect-h-9">aspect</div>`,
      options: config,
      errors: generateErrors("aspect-none aspect-w-16"),
    },
    {
      code: `
      <div class="container w-1 w-2"></div>
      <div class="block flex"></div>`,
      errors: [...generateErrors("w-1 w-2"), ...generateErrors("block flex")],
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    {
      code: `<div class="prose not-prose prose-slate prose-zinc prose-lead:container aspect-w-16 aspect-h-9 aspect-w-4 line-clamp-1 line-clamp-3"></div>`,
      errors: [
        ...generateErrors("prose not-prose"),
        ...generateErrors("prose-slate prose-zinc"),
        ...generateErrors("aspect-w-16 aspect-w-4"),
        ...generateErrors("line-clamp-1 line-clamp-3"),
      ],
      options: [
        {
          config: {
            plugins: [
              require("@tailwindcss/typography"),
              require("@tailwindcss/aspect-ratio"),
              require("@tailwindcss/line-clamp"),
            ],
          },
        },
      ],
    },
    {
      code: `
      <div class="grid-flow-dense grid-flow-row">
        Conflicting grid-flow
      </div>`,
      errors: generateErrors("grid-flow-dense grid-flow-row"),
    },
    {
      code: `
      <div class="border-spacing-y-px border-spacing-y-0">
        Conflicting border-spacing
      </div>`,
      errors: generateErrors("border-spacing-y-px border-spacing-y-0"),
    },
    {
      code: `
      <div className={\`border-spacing-y-px border-spacing-y-0\`}>
        Conflicting border-spacing
      </div>`,
      errors: generateErrors("border-spacing-y-px border-spacing-y-0"),
    },
    {
      code: `
      <div
        className={ctl(\`
          [clip-path:circle(90%_at_center)]
          [clip-path:circle(100%_at_center)]
          [mask-image:radial-gradient(circle_at_center,transparent_10%,black_10%)]
          bg-[conic-gradient(transparent,#ff00ff)]
          lg:bg-[conic-gradient(transparent,#9e9ab1)]
        \`)}
      />`,
      errors: generateErrors("[clip-path:circle(90%_at_center)] [clip-path:circle(100%_at_center)]"),
    },
    {
      code: `
      <div class="fill-white fill-none">
        Conflicting fill
      </div>`,
      errors: generateErrors("fill-white fill-none"),
    },
    {
      code: `
      <div class="stroke-white stroke-none">
        Conflicting stroke
      </div>`,
      errors: generateErrors("stroke-white stroke-none"),
    },
    {
      code: `
      <div class="-outline-offset-2 outline-offset-4">
        Conflicting outline offset
      </div>`,
      errors: generateErrors("-outline-offset-2 outline-offset-4"),
    },
    {
      code: `
      cva({
        primary: ["px-2 px-4"],
      });`,
      options: [
        {
          callees: ["cva"],
        },
      ],
      errors: generateErrors(["px-2 px-4"]),
    },
    {
      /* Issue #135 */
      code: `
      const buttons = cva({
        variants: {
          variant: {
            primary: "bg-white text-black font-bold px-4 bg-black",
            secondary: "bg-black text-white font-semibold px-5 bg-transparent",
          },
        },
      });
      `,
      options: [
        {
          callees: ["cva"],
        },
      ],
      errors: [...generateErrors("bg-white bg-black"), ...generateErrors("bg-black bg-transparent")],
    },
    {
      code: `
      <div className={\`stroke-white stroke-none \${ctl('-outline-offset-2 outline-offset-4')}\`}>
        Conflicting outline offset
      </div>`,
      options: skipClassAttributeOptions,
      errors: generateErrors("-outline-offset-2 outline-offset-4"),
    },
    {
      code: `
      <script>
      export default {
        data() {
          return {
            aClass: 'active',
            bClass: 'text-danger',
            cClass: ctl('text-black text-white')
          }
        }
      }
      </script>
      <template>
        <span class="flex block" />
        <span :class="['p-0 p-px', aClass]" />
        <span :class="['m-0', bClass, 'm-px']" />
        <span :class="{'bg-black': true, 'bg-white': false, 'font-bold font-normal': false}" />
      </template>
      `,
      errors: generateErrors(["text-black text-white", "flex block", "p-0 p-px", "m-0 m-px", "font-bold font-normal"]),
      filename: "test.vue",
      parser: require.resolve("vue-eslint-parser"),
    },
    {
      code: `
      <div class="group/name:scale-75 group/name:scale-50">
        named group
      </div>`,
      errors: generateErrors(["group/name:scale-75 group/name:scale-50"]),
    },
    {
      code: `
      <div class="bg-[url('default.jpg')] sm:bg-[url('foo.jpg')] sm:bg-[url('bar.jpg')]">
        named group
      </div>`,
      errors: generateErrors(["sm:bg-[url('foo.jpg')] sm:bg-[url('bar.jpg')]"]),
    },
    {
      code: `<div className={'h-svh h-lvh h-dvh min-h-svh min-h-lvh min-h-dvh max-h-svh max-h-lvh max-h-dvh'}>Dynamic viewport units</div>`,
      errors: generateErrors(["h-svh h-lvh h-dvh", "min-h-svh min-h-lvh min-h-dvh", "max-h-svh max-h-lvh max-h-dvh"]),
    },
    {
      code: `<div className={'size-5 size-10'}>Dynamic viewport units</div>`,
      errors: generateErrors(["size-5 size-10"]),
    },
    {
      code: `<h1 class="text-wrap text-nowrap">Balanced headlines with text-wrap utilities</h1>`,
      errors: generateErrors(["text-wrap text-nowrap"]),
    },
    {
      code: `<div class="grid grid-rows-4 grid-flow-col gap-4 grid-rows-subgrid">Subgrid support</div>`,
      errors: generateErrors(["grid-rows-4 grid-rows-subgrid"]),
    },
    {
      code: `<div class="lining-nums oldstyle-nums">Font Variant Numeric #316</div>`,
      errors: generateErrors(["lining-nums oldstyle-nums"]),
    },
    {
      code: `<div class="proportional-nums tabular-nums">Font Variant Numeric #316</div>`,
      errors: generateErrors(["proportional-nums tabular-nums"]),
    },
    {
      code: `<div class="diagonal-fractions stacked-fractions">Font Variant Numeric #316</div>`,
      errors: generateErrors(["diagonal-fractions stacked-fractions"]),
    },
    {
      code: `<pre class="touch-auto touch-none touch-pan-x touch-pan-left touch-pan-right touch-pan-y touch-pan-up touch-pan-down touch-pinch-zoom touch-manipulation">KitchenSink with errors for issue #293</pre>`,
      errors: generateErrors([
        "touch-auto touch-none touch-manipulation",
        "touch-pan-x touch-pan-left touch-pan-right",
        "touch-pan-y touch-pan-up touch-pan-down",
      ]),
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
