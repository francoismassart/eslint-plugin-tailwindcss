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
    // Angular / Native HTML + static text
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
      `<h1 class="dark:focus:hover:bg-black md:dark:disabled:focus:hover:bg-gray-400">Stackable variants</h1>`,
      `<h1 class="   unknown  relative   ">Extra spaces</h1>`,
      `<h1 className={\`relative w-full overflow-hidden \${yolo ? "flex flex-col" : "block"}\`}>Issue #131</h1>`,
      `<h1 className={clsx(['unknown relative', { ...fn() }])}>Spread of a function return inside clsx</h1>`,
      `<h1 class>No errors while typing</h1>`,
      "clsx(`absolute bottom-0 flex h-[270px] w-full flex-col`)",
      "ctl('unknown relative')",
      "ctl(`unknown relative ${live && 'unknown bg-black'}`)",
      "ctl(`unknown relative ${extra}`)",
      `
      import tw from 'twin.macro';
      const Input = tw.input\`unknown relative\`;
      const PurpleInput = tw(Input)\`unknown relative\`;
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
    ].map((testedJsxCode) => ({
      code: testedJsxCode,
    })),
    // Vue SFC
    ...[
      `<template><h1 class="unkown relative">vAttributeVisitor static</h1></template>`,
      `<template><h1 v-bind:class="'unkown relative'">vAttributeVisitor binding a string</h1></template>`,
      `<template><h1 :class="'unknown relative'">vAttributeVisitor binding short</h1></template>`,
      `<template><h1 :class="{ 'unknown relative': isActive, 'bg-black': hasError }">vAttributeVisitor Object</h1></template>`,
      `<template><h1 :class="['unkown relative', 'bg-black']">vAttributeVisitor Array</h1></template>`,
      `<template><h1 :class="[isActive ? 'unknown relative' : '', 'bg-black']">Array with ternary</h1></template>`,
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
    // Vue SFC + Disabled attribute
    ...[
      `<template><div class="flex unkown relative">No attribute (skipped)</div></template>`,
      `<template><div :class="tw('unknown relative')">No attribute but via CallExpression</div></template>`,
    ].map((testedVueCode) => ({
      code: testedVueCode,
      settings: { tailwindcss: { ...generalSettings, attributes: [] } },
      languageOptions: withVueParser,
    })),
    {
      code: `<div className={'unknown tw:relative'}>Valid with custom prefix</div>`,
      settings: { tailwindcss: { ...prefixedSettings } },
    },
    // JSX + Custom functions/tag
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
      code:   `<h1 className={'tw:flex unknown tw:relative'}>Error with custom prefix</h1>`,
      output: `<h1 className={'unknown tw:relative tw:flex'}>Error with custom prefix</h1>`,
      settings: { tailwindcss: { ...prefixedSettings } },
      errors: errors,
    },
    // Vue SFC + Disabled attribute
    ...[
      [
        `<template><h1 class="relative unkown">??</h1></template>`,
        `<template><h1 class="unkown relative">??</h1></template>`,
      ],
      [
        `<template><h1 :class="['relative unknown']">??</h1></template>`,
        `<template><h1 :class="['unknown relative']">??</h1></template>`,
      ],
      [
        `<template><h1 class="grid grid-cols-1 sm:grid-cols-2 sm:px-8 sm:py-12 sm:gap-x-8 md:py-16">:)</h1></template>`,
        `<template><h1 class="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:px-8 sm:py-12 md:py-16">:)</h1></template>`,
      ],
      [
        `<template><div :class="ctl(\`p-10 w-full \${some}\`)" /></template>`,
        `<template><div :class="ctl(\`w-full p-10 \${some}\`)" /></template>`,
      ],
      [
        `
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
        `
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
      ],
    ].map(([input, result]) => ({
      code: input,
      output: result,
      languageOptions: withVueParser,
      errors: errors,
    })),
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
  ],
});
