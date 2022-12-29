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
"tailwindcss/no-custom-classname": [<enabled>, {
  "callees": Array<string>,
  "config": <string>|<object>,
  "cssFiles": Array<string>,
  "cssFilesRefreshRate": <number>,
  "skipClassAttribute": <boolean>,
  "tags": Array<string>,
  "whitelist": Array<string>,
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

### `cssFiles` (default: `["**/*.css", "!**/node_modules", "!**/.*", "!**/dist", "!**/build"]`)

By default the plugin will now look for any `css` files while ignoring files in special folders (`node_modules/`, `dist/`, `build/` folders as well as hidden folders prefixed by a dot e.g. `.git/`).

Each `css` files will be processed in order to extract the declared classnames in order to accept them.

> If you are experiencing performance issues with this plugin, make sure to provide this setting and restrict its value to only parse the correct subset of CSS files. Read more about such cases in [PR#92](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/92) and [PR#93](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/93).

### `cssFilesRefreshRate` (default: `5_000`)

The plugin read and parses CSS files which can be a time consuming process depending on your files.

By default, it runs the process if files were updated for at least 5 seconds (`5_000` ms) but you can increase this setting to enhance performances while reducing the update interval.

### `skipClassAttribute` (default: `false`)

Set `skipClassAttribute` to `true` if you only want to lint the classnames inside one of the `callees`.
While, this will avoid linting the `class` and `className` attributes, it will still lint matching `callees` inside of these attributes.

### `tags` (default: `[]`)

Optional, if you are using tagged templates, you should provide the tags in this array.

### `whitelist` (default: `[]`)

The `whitelist` is empty by default but you can add custom regular expressions to this array to avoid getting warnings or errors while using your custom classes.

For example, imagine we are using the following custom classnames: `skin-summer`, `skin-xmas`, `custom-1`, `custom-2`, `custom-3`.

The `whitelist` options should be set to:

- `['skin\\-(summer|xmas)', 'custom\\-[1-3]']`
- or if you don't like regular expressions (but you should):
  `['skin\\-summer', 'skin\\-xmas', 'custom\\-1', 'custom\\-2', 'custom\\-3']`

### Using negative lookahead expression

If you want to **allow the usage of custom classname while checking the existence of specific Tailwind CSS classnames**, you can use negative lookahead expression in the whitelisted regex.

e.g. I want to allow custom classnames while checking the validity of the `text-` and `bg-` classnames:

```js
[
  // white list any classname which does NOT start with `bg-` and `text-`
  "(?!(bg|text)\\-).*",
];
```

### `classRegex` (default: `"^class(Name)?$"`)

Optional, can be used to support custom attribues

## Further Reading

This rule will not fix the issue but will let you know about the issue.
