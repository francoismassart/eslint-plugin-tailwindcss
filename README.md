# eslint-plugin-tailwindcss

![npm (scoped)](https://img.shields.io/npm/v/eslint-plugin-tailwindcss?style=for-the-badge) ![npm bundle size (scoped)](https://img.shields.io/npm/l/eslint-plugin-tailwindcss?style=for-the-badge)

![eslint-plugin-tailwindcss logo](https://user-images.githubusercontent.com/704026/117105634-bd661300-ad7e-11eb-9cf1-a05ba130da34.png)

Rules enforcing best practices and consistency using [Tailwind CSS](https://tailwindcss.com/) v2.1.2

> **🎉 Since v1.5.0, the plugin will parse the `tailwind.config.js` file and use the correct values based on your own settings.**
>
> 👍 Most of [the new JIT mode features](https://tailwindcss.com/docs/just-in-time-mode#new-features) are also supported.

![detected-errors](https://user-images.githubusercontent.com/704026/117103443-ac1b0780-ad7a-11eb-9c17-41f0de3e4dc4.png)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-tailwindcss`:

```
$ npm i eslint-plugin-tailwindcss --save-dev
```

[eslint-plugin-tailwindcss on npm](https://www.npmjs.com/package/eslint-plugin-tailwindcss)

## Usage

Add `tailwindcss` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["tailwindcss"]
}
```

Configure the rules you want to use under the rules section.

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

## Supported Rules

Learn more about each supported rules by reading their documentation:

- [`classnames-order`](docs/rules/classnames-order.md): order classnames by target properties then by variants (`[size:][theme:][state:]`)
- [`no-custom-classname`](docs/rules/no-custom-classname.md): only allow classnames from Tailwind CSS and the values from the `whitelist` option
- [`no-contradicting-classname`](docs/rules/no-contradicting-classname.md): e.g. avoid `p-2 p-3`, different Tailwind CSS classnames (`pt-2` & `pt-3`) but targeting the same property several times for the same variant.

## Upcoming Rules

- `no-redundant-variant`: e.g. avoid `mx-5 sm:mx-5`, no need to redefine `mx` in `sm:` variant as it uses the same value (`5`)

## Alternatives

I wrote this plugin after searching for existing tools which perform the same task but didn't satisfied my needs:

- [eslint-plugin-tailwind](https://www.npmjs.com/package/eslint-plugin-tailwind), not bad but no support (yet) for variants sorting
- [Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind), only works within Visual Studio Code

## Contributing

You are welcome to contribute to this project by reporting issues, feature requests or even opening Pull Requests.

Learn more about [contributing to ESLint-plugin-TailwindCSS](CONTRIBUTING.md).
