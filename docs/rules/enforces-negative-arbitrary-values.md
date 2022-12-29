# Warns about `-` prefixed classnames using arbitrary values (enforces-negative-arbitrary-values)

There are 2 ways to declare **negative arbitrary values**:

a) Dash prefixed classname with absolute arbitrary value like `-top-[1px]` ❌

b) Unprefixed classname (no dash) with negative value inside the square brackets like `top-[-1px]` ✅

I believe, **we should always prefer the (b) approach "Unprefixed classname"** for few reasons:

- In Tailwind CSS **v2.x.x** the (a) **was not supported** (example: https://play.tailwindcss.com/fsS91hkyKx)
- You can get nasty using (a) like `-top-[-1px]` 🥴
- Using `var()` you simply don't know if you are dealing with a negative or positive value
- [Adam recommends the unprefixed approach 🎉](https://twitter.com/adamwathan/status/1487895306847105038)

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div
  class="-top-[-10px] -right-[var(--my-var)] -left-[5px] -right-[var(--my-var)*-1]"
>
  Negative arbitrary values
</div>
```

`-right-[var(--my-var)*-1]` will generate this non sense: `right: calc(var(--my-var) * -1 * -1);`

Examples of **correct** code for this rule:

```html
<div
  class="top-[10px] right-[var(--my-var)*-1] left-[-5px] right-[var(--my-var)]"
>
  Negative arbitrary values
</div>
```

### Options

```js
...
"tailwindcss/enforces-negative-arbitrary-values": [<enabled>, {
  "callees": Array<string>,
  "config": <string>|<object>,
  "skipClassAttribute": <boolean>,
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

### `skipClassAttribute` (default: `false`)

Set `skipClassAttribute` to `true` if you only want to lint the classnames inside one of the `callees`.
While, this will avoid linting the `class` and `className` attributes, it will still lint matching `callees` inside of these attributes.

### `tags` (default: `[]`)

Optional, if you are using tagged templates, you should provide the tags in this array.

### `classRegex` (default: `"^class(Name)?$"`)

Optional, can be used to support custom attribues
