# eslint-plugin-tailwindcss

![npm (scoped)](https://img.shields.io/npm/v/eslint-plugin-tailwindcss?style=for-the-badge) ![npm bundle size (scoped)](https://img.shields.io/npm/l/eslint-plugin-tailwindcss?style=for-the-badge)

![eslint-plugin-tailwindcss logo](.github/logo.png)

Rules enforcing best practices and consistency using [Tailwind CSS](https://tailwindcss.com/) v2.1.2

> **🎉 Since v1.5.0, the plugin will parse the `tailwind.config.js` file and use the correct values based on your own settings.**
>
> 👍 Most of [the new JIT mode features](https://tailwindcss.com/docs/just-in-time-mode#new-features) are also supported.

## Latest changelog

- FIX: [Escaping special characters in the `prefix`](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/73)

- FIX: [Formating HTML files](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/85) is now possible using `@angular-eslint/template-parser`

- FIX: [New default for `cssFiles` option used by `no-custom-classname`](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/37)

- Add [`cssFilesRefreshRate` option](docs/rules/no-custom-classname.md#cssfilesrefreshrate-default-5_000) for `no-custom-classname` rule

- FIX: [`GradientColorStops` also support opacity suffixes](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/68)

- FIX: [classname `aspect-none` should be valid](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/63)

- FIX: [Invalid regular expression](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/62)

- Handling `Literal` attribute values (e.g. `className={'...'}` mind the curly brackets) instead of ignoring them

- FIX: issue with trim and `TemplateLiteral` causing unwanted concatenation of classnames

- Support for [per-side border-color in JIT](https://github.com/tailwindlabs/tailwindcss/pull/4404)

- Better support for [JIT mode arbitrary values](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/40)

- Support for [color opacity shorthand](https://tailwindcss.com/docs/just-in-time-mode#color-opacity-shorthand)

[View all releases on github](https://github.com/francoismassart/eslint-plugin-tailwindcss/releases)

## Sponsors

<a href="https://daily.dev/" target="_blank">
  <img width="150px" src="https://raw.githubusercontent.com/francoismassart/eslint-plugin-tailwindcss/master/sponsors/daily.dev.jpg">
</a>

## Supported Rules

Learn more about each supported rules by reading their documentation:

- [`classnames-order`](docs/rules/classnames-order.md): order classnames by target properties then by variants (`[size:][theme:][state:]`)
- [`no-custom-classname`](docs/rules/no-custom-classname.md): only allow classnames from Tailwind CSS and the values from the `whitelist` option
- [`no-contradicting-classname`](docs/rules/no-contradicting-classname.md): e.g. avoid `p-2 p-3`, different Tailwind CSS classnames (`pt-2` & `pt-3`) but targeting the same property several times for the same variant.

Using ESLint extension for Visual Studio Code, you will get these messages
![detected-errors](.github/output.png)

You can can the same information on your favorite command line software as well.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-tailwindcss`:

```
$ npm i eslint-plugin-tailwindcss --save-dev
```

Add `tailwindcss` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["tailwindcss"]
}
```

## Configuration

Use our preset to get reasonable defaults:

```
  "extends": [
    "plugin:tailwindcss/recommended"
  ]
```

If you do not use a preset you will need to specify individual rules and add extra configuration:

Configure the rules you want to use under the rules section.

> The following lines are matching the configuration saved in the `recommended` preset...

```json
{
  "rules": {
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/no-custom-classname": "warn",
    "tailwindcss/no-contradicting-classname": "error"
  }
}
```

Learn more about [Configuring Rules in ESLint](https://eslint.org/docs/user-guide/configuring/rules).

## Optional shared settings

Most rules shares the same settings, instead of duplicating some options...

You should also specify settings that will be shared across all the plugin rules.
[More about eslint shared settings](https://eslint.org/docs/user-guide/configuring#adding-shared-settings).

All these settings have nice default values that are explained in each rules' documentation. I'm listing them in the code below just to show them.

```json5
{
  "settings": {
    "tailwindcss": {
      // These are the default values but feel free to customize
      "callees": ["classnames", "clsx", "ctl"],
      "config": "tailwind.config.js",
      "cssFiles": ["**/*.css", "!**/node_modules", "!**/.*", "!**/dist", "!**/build"],
      "groupByResponsive": false,
      "groups": defaultGroups, // imported from groups.js
      "prependCustom": false,
      "removeDuplicates": true,
      "whitelist": []
    }
  }
}
```

The plugin will look for each setting value in this order and stop looking as soon as it finds the settings:

1. In the rule option argument (rule level)
2. In the shared settings (plugin level)
3. Default value of the requested setting (plugin level)...

## Upcoming Rules

- `no-redundant-variant`: e.g. avoid `mx-5 sm:mx-5`, no need to redefine `mx` in `sm:` variant as it uses the same value (`5`)

- `only-valid-arbitrary-values`:
  - e.g. avoid `top-[42]`, only `0` value can be unitless.
  - e.g. avoid `text-[rgba(10%,20%,30,50%)]`, can't mix `%` and `0-255`.

## Alternatives

I wrote this plugin after searching for existing tools which perform the same task but didn't satisfied my needs:

- [eslint-plugin-tailwind](https://www.npmjs.com/package/eslint-plugin-tailwind), not bad but no support (yet) for variants sorting
- [Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind), only works within Visual Studio Code

## Contributing

You are welcome to contribute to this project by reporting issues, feature requests or even opening Pull Requests.

Learn more about [contributing to ESLint-plugin-TailwindCSS](CONTRIBUTING.md).
