# Replaces multiple Tailwind CSS classnames by their shorthand (enforces-shorthand)

This rule will help you reduce the number of [Tailwind CSS](https://tailwindcss.com/) classnames by using shorthands.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="border-t-4 border-r-4 border-b-4 border-l-4">border shorthand</div>
```

Examples of **correct** code for this rule:

```html
<div class="border-4">border shorthand</div>
```

#### Limitations

At the moment, the rule will not merge mixed classnames (e.g. using regular values AND arbitrary values).

```html
<div class="border-t-[0] border-r-0 border-b-0 border-l-[0]">
  won't be converted to border-0 shorthand
</div>
```

Also, unless you are using the `classnames-order` rule, the order of your classnames may be affected by the fix.
If indeed, you are using the `classnames-order` rule, then it'll be automatically re-ordered during the next lint process (depending on your autofix preferences) and you won't notice any order issue.

### Options

```js
...
"tailwindcss/enforces-shorthand": [<enabled>, {
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

This rule will fix the issue for you.
