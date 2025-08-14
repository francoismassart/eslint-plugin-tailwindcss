/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as AngularParser from "@angular-eslint/template-parser";
import * as Parser from "@typescript-eslint/parser";
import {
  RuleTester,
  TestCaseError,
  TestLanguageOptions,
} from "@typescript-eslint/rule-tester";
// @ts-ignore
import * as VueParser from "vue-eslint-parser";

import { PluginSettings } from "../utils/parse-plugin-settings";
import { classnamesOrder, RULE_NAME } from "./classnames-order";

const error: TestCaseError<"fix:sort"> = { messageId: "fix:sort" };
const errors = [error];

const withAngularParser: TestLanguageOptions = {
  parser: AngularParser,
};
const withVueParser: TestLanguageOptions = {
  parser: VueParser,
};

const generalSettings: PluginSettings = {
  cssConfigPath:
    // @ts-expect-error The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.ts(1470)
    `${import.meta.dirname}/../../tests/stubs/css/normal.css`,
};

const prefixedSettings: PluginSettings = {
  cssConfigPath:
    // @ts-expect-error The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.ts(1470)
    `${import.meta.dirname}/../../tests/stubs/css/tiny-prefixed.css`,
};

const withTypographySettings: PluginSettings = {
  cssConfigPath:
    // @ts-expect-error The 'import.meta' meta-property is not allowed in files which will build into CommonJS output.ts(1470)
    `${import.meta.dirname}/../../tests/stubs/css/with-typography.css`,
};

const ruleTester = new RuleTester({
  languageOptions: {
    parser: Parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    tailwindcss: {
      ...generalSettings,
    },
  },
});

ruleTester.run(RULE_NAME, classnamesOrder, {
  valid: [
    // Angular / Native HTML
    ...[
      `<h1 class="flex">attributeVisitor with TextAttribute (single class gets skipped)</h1>`,
      `<h1 class="unknown  relative ">extra spaces</h1>`,
      `<h1 class="unkown relative" className='unkown relative'>Single + double quotes</h1>`,
    ].map((testedNgCode) => ({
      code: testedNgCode,
      languageOptions: withAngularParser,
    })),
    // JSX
    ...[
      `<h1 className="unkown relative">JSX static string</h1>`,
      "<h1 className={`unkown relative`}>JSXAttribute/JSXExpressionContainer/TemplateLiteral</h1>",
      `<h1 className={ctl('unknown relative')}>CallExpression inside a prop</h1>`,
      "<h1 className={ctl(`unknown relative ${live && 'unknown bg-black'}`)}>CallExpression inside a prop</h1>",
      "<h1 className={ctl(`unknown relative ${extra}`)}>CallExpression inside a prop</h1>",
      `<h1 class="unknown w-12 lg:w-[500px]">Allowed arbitrary value</h1>`,
      `<h1 class="dark:focus:hover:bg-black md:dark:disabled:focus:hover:bg-gray-400">Stackable variants</h1>`,
      `<h1 className={clsx(\`absolute bottom-0 flex h-[270px] w-full flex-col\`)}>clsx</h1>`,
      `
      import tw from 'twin.macro';
      const Input = tw.input\`unknown relative\`;
      const PurpleInput = tw(Input)\`unknown relative\`;
      `,
      `<div class="   unknown  relative   ">Extra spaces</div>`,
      `
      <div class="custom custom2 group peer prose prose-slate aspect-h-9 aspect-w-16 bg-opacity-50 ring-opacity-50 pointer-events-auto visible sr-only sticky inset-0 inset-x-2 inset-y-1 top-3 right-4 bottom-5 left-6 isolate z-auto order-1 col-span-1 col-start-2 col-end-3 row-span-1 row-start-2 row-end-3 float-left clear-both container m-0 mx-1.5 my-px mt-1 mr-2 mb-3 ml-4 box-border line-clamp-2 block aspect-auto h-0 max-h-fit min-h-full w-0 max-w-fit min-w-full flex-none shrink grow basis-0 table-fixed border-collapse origin-bottom-right translate-x-px translate-y-2 scale-0 scale-x-75 scale-y-50 rotate-90 skew-x-2 skew-y-0 transform animate-spin cursor-text touch-auto resize-none snap-x snap-mandatory snap-center snap-always scroll-m-0 scroll-mx-1.5 scroll-my-px scroll-mt-1 scroll-mr-2 scroll-mb-3 scroll-ml-4 scroll-p-0 scroll-px-1.5 scroll-py-px scroll-pt-1 scroll-pr-2 scroll-pb-3 scroll-pl-4 list-outside list-decimal appearance-none columns-1 break-before-avoid-page break-inside-avoid-column break-after-auto auto-cols-min grid-flow-col auto-rows-min grid-cols-1 grid-rows-1 flex-col flex-wrap place-content-between place-items-stretch content-between items-baseline justify-start justify-items-center gap-0 space-y-0 space-y-reverse gap-x-1 space-x-1 space-x-reverse gap-y-2 divide-x-2 divide-y-4 divide-y-reverse divide-dashed divide-black place-self-end self-baseline justify-self-stretch overflow-hidden overflow-x-auto overflow-y-scroll overscroll-auto overscroll-x-contain overscroll-y-none scroll-smooth rounded rounded-t-xl rounded-l-none rounded-tl-xl rounded-r-2xl rounded-tr-2xl rounded-b-sm rounded-br-sm rounded-bl-none border-0 border-x-2 border-y-2 border-t-4 border-r-4 border-b border-l border-solid border-black border-x-slate-50 border-y-transparent border-t-white border-r-transparent border-b-inherit border-l-current bg-current bg-none from-current via-black to-orange-500 decoration-clone bg-auto bg-fixed bg-clip-padding bg-bottom bg-no-repeat bg-origin-border fill-white stroke-white stroke-2 object-contain object-bottom p-0 px-1.5 py-px pt-1 pr-2 pb-3 pl-4 text-left indent-px align-top font-sans text-lg leading-4 font-semibold tracking-normal break-words text-ellipsis whitespace-nowrap text-current uppercase italic ordinal underline decoration-black decoration-double decoration-from-font underline-offset-auto subpixel-antialiased caret-black accent-black opacity-50 bg-blend-lighten mix-blend-darken shadow-lg ring-1 shadow-white ring-white ring-offset-2 ring-offset-current outline-0 outline-offset-1 outline-current blur brightness-50 contrast-100 drop-shadow-xl grayscale hue-rotate-90 invert saturate-100 sepia filter backdrop-blur-lg backdrop-brightness-110 backdrop-contrast-125 backdrop-grayscale backdrop-hue-rotate-90 backdrop-invert backdrop-opacity-30 backdrop-saturate-100 backdrop-sepia transition-all delay-150 duration-1000 ease-linear will-change-scroll content-none outline-dotted select-none [--scroll-offset:56px] divide-x-reverse ring-inset sm:transform-gpu sm:box-decoration-clone sm:overflow-ellipsis md:transform-none">Kitchensink</div>
      `,
      `
      <div className={\`relative w-full overflow-hidden \${yolo ? "flex flex-col" : "block"}\`}>Issue #131</div>
      `,
      `
      <div>
        <h1>Issue #142</h1>
        <div class="unselectable absolute box-content cursor-pointer rounded-full p-1.5 text-center transition-colors duration-300 select-none sm:transition-transform">1</div>
        <div class="dark:after:border-t-blue-dark/40 dark:after:border-l-blue-dark/40 before:border-l-blue-mid before:border-t-blue-mid after:border-t-blue-subtle after:border-l-blue-subtle border-transparent before:border-transparent dark:before:border-transparent">2</div>
        <div class="text-neutral-750 theme-contrast:text-black absolute -top-4 -right-1 cursor-pointer rounded-tr-sm rounded-bl-sm px-2.5 py-2 text-sm opacity-0 transition-opacity group-hover:opacity-50 group-hover:hover:opacity-100">3</div>
        <div class="text-yellow-darker/50 dark:text-yellow-strong/70 hover:text-yellow-darker dark:hover:text-yellow-strong relative flex cursor-pointer items-center justify-center pt-2 pb-2 transition-colors">4</div>
        <div class="text-yellow-darker/50 dark:text-yellow-strong/70 hover:text-yellow-darker dark:hover:text-yellow-strong relative flex cursor-pointer items-center justify-center pt-2 pb-2 transition-colors">5</div>
        <div class="group relative -mx-1.5 my-0 block rounded px-1.5 pt-3.5 pb-4 transition-colors duration-150 hover:text-black active:top-0 dark:hover:text-white">6</div>
        <div class="bg-neutral-70 theme-contrast:bg-white dark:bg-gray-780 pointer-events-none fixed top-0 left-0 h-screen w-screen opacity-70">7</div>
        <div class="dark:before:border-t-blue-dark/40 dark:before:border-l-blue-dark/40 dark:after:border-t-blue-dark/40 dark:after:border-l-blue-dark/40 before:border-t-blue-subtle before:border-l-blue-subtle after:border-t-blue-subtle after:border-l-blue-subtle border-transparent">8</div>
        <div class="dark:bg-blue-dark/40 bg-blue-subtle dark:text-blue-strong border-none text-black">9</div>
        <div class="m-3 inline-block h-4 w-4 rounded-full transition-transform">10</div>
      </div>
      `,
      `<div class>No errors while typing</div>`,
      `
      const func = () => ({ a: 12 });
      <div className={clsx(['unknown relative', {
        ...func()
      }])}>Spread of a function return inside clsx</div>
      `,
      `
      ctl(\`
        unknown
        relative
        \${loaded && \`absolute top-0 \${widthClass} \${heightClass}\`}
        \${
          pending &&
          \`inset-0 hidden\`
        }
      \`)`,
      `
      const tw = (classes) => classes;
      const taggedTemplateExpression = tw\`unkown relative\`;
      `,
      `
      ctl(\`
        container
        flex
        w-12
        sm:w-6
        lg:w-4
      \`)`,
    ].map((testedJsxCode) => ({
      code: testedJsxCode,
    })),
    // Vue SFC
    ...[
      `<template><div class="unkown relative">vAttributeVisitor static</div></template>`,
      `<template><div v-bind:class="'unkown relative'">vAttributeVisitor(VAttribute)</div></template>`,
      `<template><div :class="'unknown relative'">vAttributeVisitor with text</div></template>`,
      `
      <script>const ctl = (str) => str</script>
      <template><p :class="ctl('unknown relative')">{{ greeting }}</p></template>
      `,
      `
      <script>const tw = (str) => str + str;</script>
      <template><div :class="tw('unknown relative')">vAttributeVisitor with CallExpression</div></template>
      `,
      `
      <script>
      const tw = (str) => str + str;
      const called = tw('unknown relative');
      </script>
      <template><div :class="called">Function call inside an Identifier</div></template>
      `,
    ].map((testedVueCode) => ({
      code: testedVueCode,
      languageOptions: withVueParser,
    })),
    // Vue SFC + No attribute
    ...[
      `<template><div class="flex unkown relative">No attribute (skipped)</div></template>`,
      `
      <script>const tw = (str) => str + str;</script>
      <template><div :class="tw('unknown relative')">vAttributeVisitor with CallExpression</div></template>
      `,
    ].map((testedVueCode) => ({
      code: testedVueCode,
      settings: { tailwindcss: { ...generalSettings, attributes: [] } },
      languageOptions: withVueParser,
    })),
    {
      code: `<div className={'unknown tw:relative'}>Valid with custom prefix</div>`,
      settings: { tailwindcss: { ...prefixedSettings } },
    },
    // JSX + Custom functions
    ...[
      `<div className={ctl('flex unknown relative')}>Ignored CallExpression inside a prop</div>`,
      `<div title={myTag('unknown relative')}>Ignored CallExpression inside a prop</div>`,
      `myTag\`unknown relative\``,
      `
      const myTag = {
        subTag: (strings) => {
          return \`$\{strings}\`;
        }
      };
      const classes = myTag.subTag\`unknown relative\`;
      `,
    ].map((testedCode) => ({
      code: testedCode,
      settings: { tailwindcss: { ...generalSettings, functions: ["myTag"] } },
    })),
  ],
  invalid: [
    {
      /* prettier-ignore */
      code:   `<h1 class="relative unkown">attributeVisitor with TextAttribute</h1>`,
      output: `<h1 class="unkown relative">attributeVisitor with TextAttribute</h1>`,
      errors: errors,
      languageOptions: withAngularParser,
    },
    {
      /* prettier-ignore */
      code:   `<h1 yolo="relative unkown">Custom attribute</h1>`,
      output: `<h1 yolo="unkown relative">Custom attribute</h1>`,
      settings: { tailwindcss: { ...generalSettings, attributes: ["yolo"] } },
      errors: errors,
      languageOptions: withAngularParser,
    },
    // JSX
    ...[
      [
        `<h1 className="relative unkown">attributeVisitor with JSXAttribute</h1>`,
        `<h1 className="unkown relative">attributeVisitor with JSXAttribute</h1>`,
      ],
      [
        "<h1 className={`relative unknown`}>TemplateElement#1</h1>",
        "<h1 className={`unknown relative`}>TemplateElement#1</h1>",
      ],
      [
        "<h1 className={`${true && `relative unknown`}`}>TemplateElement#2</h1>",
        "<h1 className={`${true && `unknown relative`}`}>TemplateElement#2</h1>",
      ],
      [
        "ctl(`p-10 w-full ${some} unknown`)",
        "ctl(`w-full p-10 ${some} unknown`)",
      ],
      [
        "ctl(`p-10 w-full ${live && 'bg-white dark:bg-black'}`)",
        "ctl(`w-full p-10 ${live && 'bg-white dark:bg-black'}`)",
      ],
      [
        `<h1 class="flex sm:line-clamp-3 unknown line-clamp-2">native line-clamp support</h1>`,
        `<h1 class="unknown line-clamp-2 flex sm:line-clamp-3">native line-clamp support</h1>`,
      ],
      [
        `<h1 class="w-12 lg:w-6 w-12">keep duplicates</h1>`,
        `<h1 class="w-12 w-12 lg:w-6">keep duplicates</h1>`,
      ],
      [
        `
      ctl(\`
        invalid
        sm:w-6
        container
        invalid
        flex
        container
        w-12
        flex
        container
        lg:w-4
        lg:w-4
      \`);`,
        `
      ctl(\`
        invalid
        invalid
        container
        container
        container
        flex
        flex
        w-12
        sm:w-6
        lg:w-4
        lg:w-4
      \`);`,
      ],
      [
        `cva({ primary: ["bottom-0 w-full h-[70px] flex flex-col"], })`,
        `cva({ primary: ["bottom-0 flex h-[70px] w-full flex-col"], })`,
      ],
      [
        `ctl(\`\${enabled && "relative unknown"}\`)`,
        `ctl(\`\${enabled && "unknown relative"}\`)`,
      ],
      [
        `ctl(\`px-2 unknown flex absolute\`)`,
        `ctl(\`unknown absolute flex px-2\`)`,
      ],
      [
        `
        classnames({
          invalid,
          flex: myFlag,
          'relative unknown': resize
          })`,
        `
        classnames({
          invalid,
          flex: myFlag,
          'unknown relative': resize
          })`,
      ],
      [
        "ctl(`${some} container animate-spin first:flex ${bool ? 'flex-col flex' : ''}`)",
        "ctl(`${some} container animate-spin first:flex ${bool ? 'flex flex-col' : ''}`)",
      ],
      [
        "ctl(`p-3 border-gray-300 m-4 h-24 lg:p-4 flex border-2 lg:m-4`)",
        "ctl(`m-4 flex h-24 border-2 border-gray-300 p-3 lg:m-4 lg:p-4`)",
      ],
      [
        "<Button class={'w-full h-full'}>Single quotes</Button>",
        "<Button class={'h-full w-full'}>Single quotes</Button>",
      ],
      [
        `<h1 class="block group/edit:stroke-0">support named group/peer syntax</h1>`,
        `<h1 class="group/edit:stroke-0 block">support named group/peer syntax</h1>`,
      ],
    ].map(([input, result]) => ({
      code: input,
      output: result,
      errors: errors,
    })),
    {
      /* prettier-ignore */
      code:   "<h1 class={`top-0 ${1 && `flex nope`}`}>TemplateElement#3</h1>",
      output: "<h1 class={`top-0 ${1 && `nope flex`}`}>TemplateElement#3</h1>",
      errors: errors,
    },
    {
      /* prettier-ignore */
      code:   "ctl(`p-0 top-0 ${0 && `left-0 right-0`} ${1 && `flex nope`}`)",
      output: "ctl(`top-0 p-0 ${0 && `right-0 left-0`} ${1 && `nope flex`}`)",
      errors: [error, error, error],
    },
    {
      /* prettier-ignore */
      code:   `<div className={'tw:flex unknown tw:relative'}>Error with custom prefix</div>`,
      output: `<div className={'unknown tw:relative tw:flex'}>Error with custom prefix</div>`,
      settings: { tailwindcss: { ...prefixedSettings } },
      errors: errors,
    },
    {
      /* prettier-ignore */
      code:   `<template><div class="relative unkown">??</div></template>`,
      output: `<template><div class="unkown relative">??</div></template>`,
      errors: errors,
      languageOptions: withVueParser,
    },
    {
      /* prettier-ignore */
      code:   `<template><div :class="['relative unknown']">??</div></template>`,
      output: `<template><div :class="['unknown relative']">??</div></template>`,
      errors: errors,
      languageOptions: withVueParser,
    },
    {
      /* prettier-ignore */
      code:   `<template><div class="grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16">:)</div></template>`,
      output: `<template><div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:px-8 sm:py-12 md:py-16">:)</div></template>`,
      errors: errors,
      languageOptions: withVueParser,
    },
    {
      /* prettier-ignore */
      code:   `<div class="md:prose-2xl prose-xl prose sm:prose-sm"></div>`,
      output: `<div class="prose prose-xl sm:prose-sm md:prose-2xl"></div>`,
      settings: { tailwindcss: { ...withTypographySettings } },
      errors: errors,
    },
    {
      code: `
      const buttonClasses = ctl(\`
        \${fullWidth ? "w-12" : "w-6"}
        flex
        container
        \${fullWidth ? "sm:w-7" : "sm:w-4"}
        lg:py-4
        sm:py-6
        \${hasError && "bg-red"}
      \`);`,
      output: `
      const buttonClasses = ctl(\`
        \${fullWidth ? "w-12" : "w-6"}
        container
        flex
        \${fullWidth ? "sm:w-7" : "sm:w-4"}
        sm:py-6
        lg:py-4
        \${hasError && "bg-red"}
      \`);`,
      errors: [error, error],
    },
    {
      code: `
      ctl(\`
        px-2
        flex
        \${
          !isDisabled &&
          \`
            top-0
            flex
            border-0
          \`
        }
        \${
          isDisabled &&
          \`
            border-0
            mx-0
          \`
        }
      \`)
      `,
      output: `
      ctl(\`
        flex
        px-2
        \${
          !isDisabled &&
          \`
            top-0
            flex
            border-0
          \`
        }
        \${
          isDisabled &&
          \`
            mx-0
            border-0
          \`
        }
      \`)
      `,
      errors: [error, error],
    },
    {
      code: `
      <div
        className={clsx(
          "w-full h-10 rounded",
          name === "white"
            ? "ring-black flex"
            : undefined
        )}
      />
      `,
      output: `
      <div
        className={clsx(
          "h-10 w-full rounded",
          name === "white"
            ? "flex ring-black"
            : undefined
        )}
      />
      `,
      errors: [error, error],
    },
    {
      /* prettier-ignore */
      code:   `myTag\`flex unknown relative\``,
      output: `myTag\`unknown relative flex\``,
      settings: { tailwindcss: { ...generalSettings, functions: ["myTag"] } },
      errors: errors,
    },
    {
      code: `
      const myTag = {
        subTag: (strings) => {
          return \`$\{strings}\`;
        }
      };
      const classes = myTag.subTag\`flex unknown relative\`;
      `,
      output: `
      const myTag = {
        subTag: (strings) => {
          return \`$\{strings}\`;
        }
      };
      const classes = myTag.subTag\`unknown relative flex\`;
      `,
      settings: { tailwindcss: { ...generalSettings, functions: ["myTag"] } },
      errors: errors,
    },
    {
      code: `
      import tw from 'twin.macro';
      const Input = tw.input\`flex unknown relative\`;
      const PurpleInput = tw(Input)\`flex unknown relative\`;
      `,
      output: `
      import tw from 'twin.macro';
      const Input = tw.input\`unknown relative flex\`;
      const PurpleInput = tw(Input)\`unknown relative flex\`;
      `,
      errors: [error, error],
    },
    {
      code: `
      classnames([
        'invalid lg:w-4 sm:w-6',
        ['w-12 flex'],
      ])`,
      output: `
      classnames([
        'invalid sm:w-6 lg:w-4',
        ['flex w-12'],
      ])`,
      errors: [error, error],
    },
    {
      /* prettier-ignore */
      code:   `<template><div :class="ctl(\`p-10 w-full \${some}\`)" /></template>`,
      output: `<template><div :class="ctl(\`w-full p-10 \${some}\`)" /></template>`,
      errors: errors,
      languageOptions: withVueParser,
    },
    {
      code: `
      <template>
        <div v-bind="data" :class="[
          'py-1.5 font-semibold transition',
          {
            'text-white': variant === 'white',
            'text-blue-500 hover:text-blue-400 border-blue-500': variant === 'primary',
            'underline decoration-2 underline-offset-[10px]': active
          }
        ]" />
      </template>`,
      output: `
      <template>
        <div v-bind="data" :class="[
          'py-1.5 font-semibold transition',
          {
            'text-white': variant === 'white',
            'border-blue-500 text-blue-500 hover:text-blue-400': variant === 'primary',
            'underline decoration-2 underline-offset-[10px]': active
          }
        ]" />
      </template>`,
      errors: errors,
      languageOptions: withVueParser,
    },
  ],
});
