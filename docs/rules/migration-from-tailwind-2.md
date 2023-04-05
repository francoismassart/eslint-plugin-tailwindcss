# Detect obsolete classnames when upgrading to Tailwind CSS v3 (migration-from-tailwind-2)

This rule helps you upgrade your codebase from [Tailwind CSS](https://tailwindcss.com/) v2 to v3, you can read more about [upgrading your Tailwind CSS projects from v2 to v3](https://tailwindcss.com/docs/upgrade-guide).

## Rule Details

### Obsolete classnames

Examples of **incorrect** code for this rule:

```html
<div
  class="transform scale-50 filter grayscale backdrop-filter backdrop-blur-sm"
>
  Automatic transforms and filters
</div>
```

Examples of **correct** code for this rule:

```html
<div class="scale-50 grayscale backdrop-blur-sm">
  Automatic transforms and filters
</div>
```

The classnames `backdrop-filter`, `filter` & `transform` are [not needed when you are using Tailwind CSS v3](https://tailwindcss.com/docs/upgrade-guide#automatic-transforms-and-filters) because it is always running in JIT mode.

The rule can fix your code by removing these obsolete classnames.

### Renamed classnames

Examples of **incorrect** code for this rule:

```html
<div class="overflow-clip overflow-ellipsis">overflow-clip/ellipsis</div>
```

Examples of **correct** code for this rule:

```html
<div class="text-clip text-ellipsis">overflow-clip/ellipsis</div>
```

The classnames `overflow-clip` & `overflow-ellipsis` [were renamed in v3](https://tailwindcss.com/docs/upgrade-guide#overflow-clip-ellipsis) to avoid confusion with new CSS properties. As said in the official docs:

> The old class names will always work but you’re encouraged to update to the new ones.

This rule can replace the old classnames by the updated classnames, it will work on the following classnames:

- `overflow-clip` => `text-clip`
- `overflow-ellipsis` => `text-ellipsis`
- `flex-grow` => `grow`
- `flex-shrink` => `shrink`
- `decoration-clone` => `box-decoration-clone`
- `decoration-slice` => `box-decoration-slice`
- `placeholder-color` => `placeholder:text-color`

### Removed `bg-opacity`

Examples of **incorrect** code for this rule:

```html
<div class="bg-opacity-50 bg-black">bg-opacity</div>
```

Examples of **correct** code for this rule:

```html
<div class="bg-black/50">bg-opacity</div>
```

While still being supported, the `bg-opacity` utility classname was removed from the docs because you should use a suffix modifier on a `bg-color` to provide an alpha value instead.

This rule will report the issue but **it will not fix it for you**...

### Options

```js
...
"tailwindcss/migration-from-tailwind-2": [<enabled>, {
  "callees": Array<string>,
  "config": <string>|<object>,
  "skipClassAttribute": <boolean>,
  "tags": Array<string>,
}]
...
```

### `callees` (default: `["classnames", "clsx", "ctl", "cva", "tv"]`)

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

### `skipClassAttribute` (default: `false`)

Set `skipClassAttribute` to `true` if you only want to lint the classnames inside one of the `callees`.
While, this will avoid linting the `class` and `className` attributes, it will still lint matching `callees` inside of these attributes.

### `tags` (default: `[]`)

Optional, if you are using tagged templates, you should provide the tags in this array.

### `classRegex` (default: `"^class(Name)?$"`)

Optional, can be used to support custom attribues
