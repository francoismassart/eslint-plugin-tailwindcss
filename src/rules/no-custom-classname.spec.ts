import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import {
  daisySettings,
  generalSettings,
  prefixedSettings,
  withAngularParser,
  withSvelteParser,
} from "../utils/parser/test-helpers";
import {
  MessageIds,
  noCustomClassname,
  RULE_NAME,
} from "./no-custom-classname";

const suggest = (
  classname: string,
  output: string | undefined = undefined,
): TestCaseError<MessageIds> => {
  return {
    messageId: "issue:unknown-classname",
    suggestions:
      output === undefined
        ? []
        : [
            {
              messageId: "fix:unknown-classname:remove",
              data: { classname: classname },
              output: output,
            },
          ],
  };
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

ruleTester.run(RULE_NAME, noCustomClassname, {
  valid: [
    // Angular / Native HTML + static text
    ...[
      `<h1 class="whitelisted flex">attributeVisitor with TextAttribute (single class gets skipped)</h1>`,
      `<h1 class="  relative ">extra spaces</h1>`,
      `<h1 class=" relative " className=' flex'>Single + double quotes</h1>`,
      `<h1 class="group">group generates no classes</h1>`,
      `<h1 class="group/name">group/name</h1>`,
      `<h1 class="dark">dark generates no classes</h1>`,
      `<h1 class="flex md:block">modifiers</h1>`,
      `<h1 class="flex! md:!block">!modifiers!</h1>`,
      `<h1 class="js-custom">js-</h1>`,
      `<h1 class="peer peer/menu">peer generates no classes</h1>`,
      `<h1 class="i-heroicons:chevron-up-solid">Issue 284</h1>`,
      `<p><span class="text-[min(theme(fontSize.9xl),_var(--font-size))]/none">Issue 239</span><span class="text-7xl/10">Issue 239</span></p>`,
      `<h1 class="text-[rgba(10%,20%,30,50%)]">TODO: only-valid-arbitrary-values</h1>`,
    ].map((testedNgCode) => ({
      code: testedNgCode,
      options: [
        {
          whitelist: [
            "whitelisted",
            "js-[a-z0-9-]+",
            "i-heroicons:chevron-up-solid",
          ],
        },
      ],
      languageOptions: withAngularParser,
    })),
    // React
    ...[
      `<h1 className={\`max-w-full \${isDone ? 'opacity-80 grayscale' : null}\`}>null</h1>`,
      // Issue 252
      `twJoin('h-full', selectedPickupPoint === pickupPoint && 'absolute')`,
      // Issue 291
      `ctl('first:absolute')`,
      // Issue 352
      `ctl('w-full max-w-48')`,
      // Issue 277, we ignore the "dynamic" classnames in this rule
      `<h1 className={\`rounded w-[\${width}] flex\`}>Issue 277</h1>`,
      // Issue 406
      `ctl('@container h-[50cqb] @container-size/name')`,
      `<p className={className || undefined}>alpha7 Identifier bug</p>`,
      `<p className={ctl(\`\${linkClasses} \${isCurrent ? currentPageClasses : clickableLinkClasses}\`)}>alpha7 Identifier bug</p>`,
      // alpha7 Identifier bug
      `ctl(\`
        \${
          activeColor
            ? activeColor
            : 'bg-black'
        }
        \${big ? 'h-full' : 'lg:h-full'}
        text-center
      \`)`,
      // Issue 422
      `tv({
        slots: {
          base: 'flex',
          item: 'data-[active="true"]:text-white',
          prev: '',
          next: ''
        },
        variants: {
          size: {
            xs: {},
            sm: {},
            md: {}
          }
        },
        defaultVariants: {
          size: 'md'
        },
        compoundSlots: [
          // if you dont specify any variant, it will always be applied
          {
            slots: ['item', 'prev', 'next'],
            class: [
              'flex',
              'text-black'
            ] // --> these classes will be applied to all slots
          },
          // if you specify a variant, it will only be applied if the variant is active
          {
            slots: ['item', 'prev', 'next'],
            size: 'xs',
            class: 'w-7 h-7 text-xs' // --> these classes will be applied to all slots if size is xs
          },
          {
            slots: ['item', 'prev', 'next'],
            size: 'sm',
            class: 'w-8 h-8 text-sm' // --> these classes will be applied to all slots if size is sm
          },
          {
            slots: ['item', 'prev', 'next'],
            size: 'md',
            class: 'w-9 h-9 text-base' // --> these classes will be applied to all slots if size is md
          }
        ]
      });`,
    ].map((jsx) => ({
      code: jsx,
    })),
    // Svelte
    ...[
      `
      <script>
        const styles = tw\`block absolute\`;
      </script>
      <section class="p-6">Simple</section>`,
      `
      <script>
        let isExpanded = false;
      </script>
      <div
        class="w-1/2"
        class:hover:w-full={!isExpanded}
      >
        Svelte
      </div>`,
    ].map((svelteCode) => ({
      code: svelteCode,
      languageOptions: withSvelteParser,
    })),
    // Issue 313 prefix in settings
    ...[`ctl('tw:flex tw:@container tw:@lg:hidden')`].map((jsx) => ({
      code: jsx,
      settings: { tailwindcss: { ...prefixedSettings } },
    })),
    // Issue 406 Using external libs such as DaisyUI
    ...[`ctl('modal')`].map((jsx) => ({
      code: jsx,
      settings: { tailwindcss: { ...daisySettings } },
    })),
  ],
  invalid: [
    // Angular / Native HTML + static text
    ...[
      {
        code: `<h1 class="unknown relative">head</h1>`,
        errors: [suggest("unknown", `<h1 class="relative">head</h1>`)],
      },
      {
        code: `<h1 class="relative unknown flex">body</h1>`,
        errors: [suggest("unknown", `<h1 class="relative flex">body</h1>`)],
      },
      {
        code: `<h1 class="relative unknown">tail</h1>`,
        errors: [suggest("unknown", `<h1 class="relative">tail</h1>`)],
      },
    ].map(({ code, errors }) => ({
      code: code,
      errors: errors,
      languageOptions: withAngularParser,
    })),
    // React
    ...[
      {
        code: `<h1 className={"unknownreact relative"}>head</h1>`,
        errors: [
          suggest("unknownreact", `<h1 className={"relative"}>head</h1>`),
        ],
      },
      {
        code: `<h1 className={"yolo:bg-red"}>validate-modifiers</h1>`,
        errors: [
          suggest("yolo:bg-red", `<h1 className={""}>validate-modifiers</h1>`),
        ],
      },
      {
        code: `<h1 className={"last-child:mb-0"}>invalid modifier, Issue 305</h1>`,
        errors: [
          suggest(
            "last-child:mb-0",
            `<h1 className={""}>invalid modifier, Issue 305</h1>`,
          ),
        ],
      },
      {
        code: "<h1 className={`unknown:flex relative`}>Invalid modifier</h1>",
        errors: [
          suggest(
            "unknown:flex",
            "<h1 className={`relative`}>Invalid modifier</h1>",
          ),
        ],
      },
      {
        code: `ctl(\`unknownreact relative\`)`,
        errors: [suggest("unknownreact", `ctl(\`relative\`)`)],
      },
      {
        code: `ctl("unknown-first flex"); ctl("unknown-second block");`,
        errors: [
          suggest("unknown-first", `ctl("flex"); ctl("unknown-second block");`),
          suggest("unknown-second", `ctl("unknown-first flex"); ctl("block");`),
        ],
      },
      {
        code: `
        ctl(\`
          unknownreact
          relative
        \`)`,
        errors: [
          suggest(
            "unknownreact",
            `
        ctl(\`
          relative
        \`)`,
          ),
        ],
      },
      {
        code: `
        ctl(\`
          absolute
          unknown-react
          relative
        \`)`,
        errors: [
          suggest(
            "unknown-react",
            `
        ctl(\`
          absolute
          relative
        \`)`,
          ),
        ],
      },
      {
        code: `<h1 class="relative unknown">tail</h1>`,
        errors: [suggest("unknown", `<h1 class="relative">tail</h1>`)],
      },
    ].map(({ code, errors }) => ({
      code: code,
      errors: errors,
    })),
    // clsx()
    ...[
      {
        // Issue 264 Strings (variadic)
        code: `clsx('flex', true && 'unknown', 'unknown-bis');`,
        errors: [
          suggest("unknown", `clsx('flex', true && '', 'unknown-bis');`),
          suggest("unknown-bis", `clsx('flex', true && 'unknown', '');`),
        ],
      },
      {
        // Issue 264 Objects
        code: `clsx({ foo:true, absolute:false, baz:isTrue() });`,
        errors: [
          // An identifier node is not fixable, we only report
          suggest("foo"),
          // An identifier node is not fixable, we only report
          suggest("baz"),
        ],
      },
      {
        // Issue 264 Objects (variadic)
        code: `clsx({ foo:true }, { bar:false }, null, { '--foobar':'hello' });`,
        errors: [
          // An identifier node is not fixable, we only report
          suggest("foo"),
          // An identifier node is not fixable, we only report
          suggest("baz"),
          // An identifier node is not fixable, we only report
          suggest(
            "--foobar",
            `clsx({ foo:true }, { bar:false }, null, { '':'hello' });`,
          ),
        ],
      },
      {
        // Issue 264 Arrays
        code: `clsx(['foo', 0, false, 'bar']);`,
        errors: [
          suggest("foo", `clsx(['', 0, false, 'bar']);`),
          suggest("bar", `clsx(['foo', 0, false, '']);`),
        ],
      },
      {
        // Issue 264 Arrays (variadic)
        code: `clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]]);`,
        errors: [
          suggest(
            "foo",
            `clsx([''], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]]);`,
          ),
          suggest(
            "bar",
            `clsx(['foo'], ['', 0, false, ''], [['baz', [['hello'], 'there']]]);`,
          ),
          suggest(
            "baz",
            `clsx(['foo'], ['', 0, false, 'bar'], [['', [['hello'], 'there']]]);`,
          ),
          suggest(
            "hello",
            `clsx(['foo'], ['', 0, false, 'bar'], [['baz', [[''], 'there']]]);`,
          ),
          suggest(
            "there",
            `clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], '']]]);`,
          ),
        ],
      },
      {
        // Issue 264 Kitchen sink (with nesting)
        code: `clsx('foo', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya');`,
        errors: [
          suggest(
            "foo",
            `clsx('', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], 'cya');`,
          ),
          suggest(
            "bar",
            `clsx('foo', [1 && '', { baz:false, bat:null }, ['hello', ['world']]], 'cya');`,
          ),
          suggest("baz"),
          suggest("bat"),
          suggest(
            "hello",
            `clsx('foo', [1 && 'bar', { baz:false, bat:null }, ['', ['world']]], 'cya');`,
          ),
          suggest(
            "world",
            `clsx('foo', [1 && 'bar', { baz:false, bat:null }, ['hello', ['']]], 'cya');`,
          ),
          suggest(
            "cya",
            `clsx('foo', [1 && 'bar', { baz:false, bat:null }, ['hello', ['world']]], '');`,
          ),
        ],
      },
    ].map(({ code, errors }) => ({
      code: code,
      errors: errors,
    })),
    // tv()
    ...[
      {
        // Issue 422
        code: `
          tv({
            slots: {
              base: 'flex unknown-base',
              item: 'data-[active="true"]:text-white',
            },
            variants: {
              size: {
                xs: 'absolute',
                sm: 'unknown-sm',
              }
            },
            defaultVariants: {
              size: 'xs'
            },
            compoundSlots: [
              // if you dont specify any variant, it will always be applied
              {
                slots: ['item', 'prev', 'next'],
                class: [
                  'unknown-compound block',
                  'text-black'
                ] // --> these classes will be applied to all slots
              },
              // if you specify a variant, it will only be applied if the variant is active
              {
                slots: ['item', 'prev', 'next'],
                size: 'xs',
                class: 'unknown-multiple' // --> these classes will be applied to all slots if size is xs
              },
            ]
          });`,
        errors: [
          suggest(
            "unknown-base",
            `
          tv({
            slots: {
              base: 'flex',
              item: 'data-[active="true"]:text-white',
            },
            variants: {
              size: {
                xs: 'absolute',
                sm: 'unknown-sm',
              }
            },
            defaultVariants: {
              size: 'xs'
            },
            compoundSlots: [
              // if you dont specify any variant, it will always be applied
              {
                slots: ['item', 'prev', 'next'],
                class: [
                  'unknown-compound block',
                  'text-black'
                ] // --> these classes will be applied to all slots
              },
              // if you specify a variant, it will only be applied if the variant is active
              {
                slots: ['item', 'prev', 'next'],
                size: 'xs',
                class: 'unknown-multiple' // --> these classes will be applied to all slots if size is xs
              },
            ]
          });`,
          ),
          suggest(
            "unknown-sm",
            `
          tv({
            slots: {
              base: 'flex unknown-base',
              item: 'data-[active="true"]:text-white',
            },
            variants: {
              size: {
                xs: 'absolute',
                sm: '',
              }
            },
            defaultVariants: {
              size: 'xs'
            },
            compoundSlots: [
              // if you dont specify any variant, it will always be applied
              {
                slots: ['item', 'prev', 'next'],
                class: [
                  'unknown-compound block',
                  'text-black'
                ] // --> these classes will be applied to all slots
              },
              // if you specify a variant, it will only be applied if the variant is active
              {
                slots: ['item', 'prev', 'next'],
                size: 'xs',
                class: 'unknown-multiple' // --> these classes will be applied to all slots if size is xs
              },
            ]
          });`,
          ),
          suggest(
            "unknown-compound",
            `
          tv({
            slots: {
              base: 'flex unknown-base',
              item: 'data-[active="true"]:text-white',
            },
            variants: {
              size: {
                xs: 'absolute',
                sm: 'unknown-sm',
              }
            },
            defaultVariants: {
              size: 'xs'
            },
            compoundSlots: [
              // if you dont specify any variant, it will always be applied
              {
                slots: ['item', 'prev', 'next'],
                class: [
                  'block',
                  'text-black'
                ] // --> these classes will be applied to all slots
              },
              // if you specify a variant, it will only be applied if the variant is active
              {
                slots: ['item', 'prev', 'next'],
                size: 'xs',
                class: 'unknown-multiple' // --> these classes will be applied to all slots if size is xs
              },
            ]
          });`,
          ),
          suggest(
            "unknown-multiple",
            `
          tv({
            slots: {
              base: 'flex unknown-base',
              item: 'data-[active="true"]:text-white',
            },
            variants: {
              size: {
                xs: 'absolute',
                sm: 'unknown-sm',
              }
            },
            defaultVariants: {
              size: 'xs'
            },
            compoundSlots: [
              // if you dont specify any variant, it will always be applied
              {
                slots: ['item', 'prev', 'next'],
                class: [
                  'unknown-compound block',
                  'text-black'
                ] // --> these classes will be applied to all slots
              },
              // if you specify a variant, it will only be applied if the variant is active
              {
                slots: ['item', 'prev', 'next'],
                size: 'xs',
                class: '' // --> these classes will be applied to all slots if size is xs
              },
            ]
          });`,
          ),
        ],
      },
    ].map(({ code, errors }) => ({
      code: code,
      errors: errors,
    })),
    // Svelte
    ...[
      {
        code: `
        <script>
          const styles = tw\`unknown\`;
        </script>
        <section class="p-6 foo">Simple</section>`,
        errors: [
          suggest(
            "unknown",
            `
        <script>
          const styles = tw\`\`;
        </script>
        <section class="p-6 foo">Simple</section>`,
          ),
          suggest(
            "foo",
            `
        <script>
          const styles = tw\`unknown\`;
        </script>
        <section class="p-6">Simple</section>`,
          ),
        ],
      },
      {
        code: `
        <script>
          let isExpanded = false;
        </script>
        <div
          class="block z-1/2 relative {isExpanded ? 'foo' : 'baz'}"
          class:hover:x-full={!isExpanded}
        >
          Svelte
        </div>`,
        errors: [
          suggest(
            "z-1/2",
            `
        <script>
          let isExpanded = false;
        </script>
        <div
          class="block relative {isExpanded ? 'foo' : 'baz'}"
          class:hover:x-full={!isExpanded}
        >
          Svelte
        </div>`,
          ),
          suggest(
            "foo",
            `
        <script>
          let isExpanded = false;
        </script>
        <div
          class="block z-1/2 relative {isExpanded ? '' : 'baz'}"
          class:hover:x-full={!isExpanded}
        >
          Svelte
        </div>`,
          ),
          suggest(
            "baz",
            `
        <script>
          let isExpanded = false;
        </script>
        <div
          class="block z-1/2 relative {isExpanded ? 'foo' : ''}"
          class:hover:x-full={!isExpanded}
        >
          Svelte
        </div>`,
          ),
          suggest("hover:x-full"),
        ],
      },
    ].map(({ code, errors }) => ({
      code: code,
      errors: errors,
      languageOptions: withSvelteParser,
    })),
    /*/
    {
      // At this moment, no possibility to read the custom dark variant from the config
      code: "<h1 className={`dark`}>Custom dark class in config (.dark-theme)</h1>",
      errors: [
        suggest(
          "dark",
          "<h1 className={``}>Custom dark class in config (.dark-theme)</h1>",
        ),
      ],
    },
    //*/
  ],
});
