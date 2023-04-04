# Use a consistent orders for the Tailwind CSS classnames, based on the official order (tailwindcss/classnames-order)

Enforces a consistent order of the Tailwind CSS classnames and its variants.

> **Note**: Since version `3.6.0`, the ordering is solely done using the [order process from the official `prettier-plugin-tailwindcss`](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted)

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="p-3 border-gray-300 m-4 h-24 lg:p-4 flex border-2 lg:m-4"></div>
```

Examples of **correct** code for this rule:

```html
<div class="m-4 flex h-24 border-2 border-gray-300 p-3 lg:m-4 lg:p-4"></div>
```

### Options

```js
...
"tailwindcss/classnames-order": [<enabled>, {
  "callees": Array<string>,
  "config": <string>|<object>,
  "removeDuplicates": <boolean>,
  "skipClassAttribute": <boolean>,
  "tags": Array<string>,
}]
...
```

### `callees` (default: `["classnames", "clsx", "ctl", "cva"]`)

If you use some utility library like [@netlify/classnames-template-literals](https://github.com/netlify/classnames-template-literals), you can add its name to the list to make sure it gets parsed by this rule.

For best results, gather the declarative classnames together, avoid mixing conditional classnames in between, move them at the end.

### `ignoredKeys` (default: `["compoundVariants", "defaultVariants"]`)

Using libraries like `cva`, some of its object keys are not meant to contain classnames in its value(s).
You can specify which key(s) won't be parsed by the plugin using this setting.
For example, `cva` has `compoundVariants` and `defaultVariants`.
NB: As `compoundVariants` can have classnames inside its `class` property, you can also use a callee to make sure this inner part gets parsed while its parent is ignored.

### `config` (default: `"tailwind.config.js"`)

By default the plugin will try to load the file `tailwind.config.js` at the root of your project.

This allows the plugin to use your customized `colors`, `spacing`, `screens`...

You can provide another path or filename for your Tailwind CSS config file like `"config/tailwind.js"`.

If the external file cannot be loaded (e.g. incorrect path or deleted file), an empty object `{}` will be used instead.

It is also possible to directly inject a configuration as plain `object` like `{ prefix: "tw-", theme: { ... } }`.

Finally, the plugin will [merge the provided configuration](https://tailwindcss.com/docs/configuration#referencing-in-java-script) with [Tailwind CSS's default configuration](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js).

### `removeDuplicates` (default: `true`)

Duplicate classnames are automatically removed but you can always disable this behavior by setting `removeDuplicates` to `false`.

### `skipClassAttribute` (default: `false`)

Set `skipClassAttribute` to `true` if you only want to lint the classnames inside one of the `callees`.
While, this will avoid linting the `class` and `className` attributes, it will still lint matching `callees` inside of these attributes.

### `tags` (default: `[]`)

Optional, if you are using tagged templates, you should provide the tags in this array.

### `classRegex` (default: `"^class(Name)?$"`)

Optional, can be used to support custom attribues
