# Forbid using arbitrary values in classnames (no-arbitrary-value)

Tailwind CSS 3 is Just In Time, all the time. It brings flexibility, great compilation perfs and arbitrary values.
Arbitrary values are great but can be problematic too if you wish to restrict developer to stick with the values defined in the Tailwind CSS config file.

**By default this rule is turned `off`, if you want to use it set it to `warn` or `error`.**

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="border-[4px]">border width</div>
```

Examples of **correct** code for this rule:

```html
<div class="border-4">border width</div>
```

### Options

```js
...
"tailwindcss/no-arbitrary-value": [<enabled>, {
  "callees": Array<string>,
  "config": <string>|<object>,
  "tags": Array<string>,
}]
...
```

### `callees` (default: `["classnames", "clsx", "ctl"]`)

If you use some utility library like [@netlify/classnames-template-literals](https://github.com/netlify/classnames-template-literals), you can add its name to the list to make sure it gets parsed by this rule.

For best results, gather the declarative classnames together, avoid mixing conditional classnames in between, move them at the end.

### `config` (default: `"tailwind.config.js"`)

By default the plugin will try to load the file `tailwind.config.js` at the root of your project.

This allows the plugin to use your customized `colors`, `spacing`, `screens`...

You can provide another path or filename for your Tailwind CSS config file like `"config/tailwind.js"`.

If the external file cannot be loaded (e.g. incorrect path or deleted file), an empty object `{}` will be used instead.

It is also possible to directly inject a configuration as plain `object` like `{ prefix: "tw-", theme: { ... } }`.

Finally, the plugin will [merge the provided configuration](https://tailwindcss.com/docs/configuration#referencing-in-java-script) with [Tailwind CSS's default configuration](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js).

### `tags` (default: `[]`)

Optional, if you are using tagged templates, you should provide the tags in this array.

### `classRegex` (default: `"^class(Name)?$"`)

Optional, can be used to support custom attribues

## Further Reading

This rule will not fix the issue for you because it cannot guess the correct class candidate.
