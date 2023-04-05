# Avoid contradicting Tailwind CSS classnames (e.g. "w-3 w-5") (no-contradicting-classname)

The majority of the Tailwind CSS classes only affect a single CSS property.
Using two or more classnames which affect the same property for the same variant means trouble and confusion.

## Rule Details

The rule aims to warn you about contradictions in the classnames you are attaching to an element.

Examples of **incorrect** code for this rule:

```html
<div class="container w-1 w-2">which is the correct width ?</div>
```

Examples of **correct** code for this rule:

```html
<div class="container p-1 lg:p-4">padding is defined once per variant max.</div>
```

### Options

```js
...
"tailwindcss/no-contradicting-classname": [<enabled>, {
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

## Further Reading

This rule will not fix the issue but will let you know about the issue.
