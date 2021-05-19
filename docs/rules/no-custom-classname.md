# Detect classnames which do not belong to Tailwind CSS (no-custom-classname)

Enable this rule if you do not want to accept using classnames that are not defined in [Tailwind CSS](https://tailwindcss.com/).

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="w-12 my-custom">my-custom is not defined in Tailwind CSS!</div>
```

Examples of **correct** code for this rule:

```html
<div class="container box-content lg:box-border">
  Only Tailwind CSS classnames
</div>
```

### Options

```js
...
"tailwindcss/classnames-order": [<enabled>, {
  "callees": Array<string>,
  "config": <string>|<object>,
  "whitelist": Array<string>
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

### `whitelist` (default: `[]`)

The `whitelist` is empty by default but you can add custom regular expressions to this array to avoid getting warnings or errors while using your custom classes.

For example, imagine we are using the following custom classnames: `skin-summer`, `skin-xmas`, `custom-1`, `custom-2`, `custom-3`.

The `whitelist` options should be set to:

- `['skin\\-(summer|xmas)', 'custom\\-[1-3]']`
- or if you don't like regular expressions (but you should):
  `['skin\\-summer', 'skin\\-xmas', 'custom\\-1', 'custom\\-2', 'custom\\-3']`

## Further Reading

This rule will not fix the issue but will let you know about the issue.
