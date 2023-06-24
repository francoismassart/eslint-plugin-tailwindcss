# eslint-plugin-tailwindcss

![npm latest version](https://img.shields.io/npm/v/eslint-plugin-tailwindcss?style=for-the-badge) ![license](https://img.shields.io/npm/l/eslint-plugin-tailwindcss?style=for-the-badge) ![downloads](https://img.shields.io/npm/dt/eslint-plugin-tailwindcss?style=for-the-badge)

![eslint-plugin-tailwindcss logo](.github/logo.png)

Rules enforcing best practices and consistency using [Tailwind CSS](https://tailwindcss.com/).

While you can use the official plugin [`prettier-plugin-tailwindcss`](https://www.npmjs.com/package/prettier-plugin-tailwindcss) for ordering your classnames...

**`eslint-plugin-tailwindcss` offers more than 5 other rules, that you can benefit from on top of `prettier-plugin-tailwindcss`. Sounds good ? Keep reading 👇**

## Supported Rules

Learn more about each supported rules by reading their documentation:

- [`classnames-order`](docs/rules/classnames-order.md): order classnames for consistency and it makes merge conflict a bit easier to resolve
- [`enforces-negative-arbitrary-values`](docs/rules/enforces-negative-arbitrary-values.md): make sure to use negative arbitrary values classname without the negative classname e.g. `-top-[5px]` should become `top-[-5px]`
- [`enforces-shorthand`](docs/rules/enforces-shorthand.md): merge multiple classnames into shorthand if possible e.g. `mx-5 my-5` should become `m-5`
- [`migration-from-tailwind-2`](docs/rules/migration-from-tailwind-2.md) for easy upgrade from Tailwind CSS `v2` to `v3`.
  Warning: at the moment you should [temporary turn off the `no-custom-classname`](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/88) rule if you want to see the warning from `migration-from-tailwind-2`
- [`no-arbitrary-value`](docs/rules/no-arbitrary-value.md): forbid using arbitrary values in classnames (turned off by default)
- [`no-custom-classname`](docs/rules/no-custom-classname.md): only allow classnames from Tailwind CSS and the values from the `whitelist` option
- [`no-contradicting-classname`](docs/rules/no-contradicting-classname.md): e.g. avoid `p-2 p-3`, different Tailwind CSS classnames (`pt-2` & `pt-3`) but targeting the same property several times for the same variant.

Using ESLint extension for Visual Studio Code, you will get these messages
![detected-errors](.github/output.png)

You can can the same information on your favorite command line software as well.

## 🤝 Support `eslint-plugin-tailwindcss`

| 🥰 How you can support us?                                                                                                                                                                                                            | 💪 They did it!                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Premium Sponsors** <br /> Support us by becoming a sponsor. <br /> [Become a recurring sponsor](https://github.com/sponsors/francoismassart?frequency=recurring)                                                                    | <a href="https://daily.dev/" target="_blank"><img width="150" src="https://raw.githubusercontent.com/francoismassart/eslint-plugin-tailwindcss/master/sponsors/daily.dev.jpg"></a>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Current Sponsors** <br /> Any amount is appreciated.                                                                                                                                                                                | <a href="https://github.com/theMosaad" target="_blank"><img src="https://avatars.githubusercontent.com/u/48773133?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@theMosaad"></a> <a href="https://github.com/acewf" target="_blank"><img src="https://avatars.githubusercontent.com/u/4835572?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@acewf"></a> <a href="https://github.com/charkour" target="_blank"><img src="https://avatars.githubusercontent.com/u/33156025?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@charkour"></a> <a href="https://github.com/dailydotdev" target="_blank"><img class="avatar" src="https://avatars.githubusercontent.com/u/41463883?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@dailydotdev"></a> |
| **Past sponsors** <br /> Even if this is just a one-time thing. <br /> [Become a backer](https://github.com/sponsors/francoismassart?frequency=one-time)                                                                              | <a href="https://github.com/aniravi24" target="_blank"><img src="https://avatars.githubusercontent.com/u/5902976?s=100&amp;v=4" width="50" height="50" style="border-radius:100%;" alt="@aniravi24"></a> <a href="https://github.com/mongolyy" target="_blank"><img src="https://avatars.githubusercontent.com/u/10972787?s=100&amp;v=4" width="50" height="50" style="border-radius:100%;" alt="@mongolyy"></a> <a href="https://github.com/t3dotgg" target="_blank"><img src="https://avatars.githubusercontent.com/u/6751787?s=100&amp;v=4" width="50" height="50" style="border-radius:100%;" alt="@t3dotgg"></a>                                                                                                                                                                                                                           |
| **Contributors** <br /> This project can evolve thanks to all the people who contribute. <br /> You are welcome to [contribute](CONTRIBUTING.md) to this project by reporting issues, feature requests or even opening Pull Requests. | <a href="https://github.com/francoismassart/eslint-plugin-tailwindcss/graphs/contributors"><img src="https://contrib.rocks/image?repo=francoismassart/eslint-plugin-tailwindcss&width=300&columns=4" /></a>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Supporters** <br /> Talk about the plugin on your social networks                                                                                                                                                                   | <a href="https://twitter.com/search?q=eslint-plugin-tailwindcss&src=recent_search_click" target="_blank">eslint-plugin-tailwindcss on Twitter</a>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Latest changelog

- feat: [support enforcing truncate shorthand](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/255) (by [bezbac](https://github.com/bezbac) 🙏)
- fix: [parsing spreads in object expressions](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/251) (by [bezbac](https://github.com/bezbac) 🙏)
- fix: [do not handle non-ASCII whitespace as separator](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/246) (by [uhyo](https://github.com/uhyo) 🙏)
- fix: [prefix support for named group/peer syntax](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/244) (by [bezbac](https://github.com/bezbac) 🙏)
- feat: [support tailwind config in typescript](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/242) (by [quesabe](https://github.com/quesabe) 🙏)
  **You may have to upgrade your Tailwind CSS version to `3.3.2`**
- feat: [add `ignoredKeys` in settings](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/232) used for `cva` or similar
- fix: [callees with dot](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/227)
- fix: [`no-custom-classname` doesn't work with hyphenated group names](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/226)
- fix: [default settings conflict](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/212)
- fix: [`classRegex` ignored in vuejs](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/216)
- chore: fix dependency vulnerability (mocha)
- feat: [support named group/peer syntax](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/215) (by [hampustagerud](https://github.com/hampustagerud) 🙏)
- feat: add [support for Vue `v-bind:class`](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/168)
- docs: recommended parsers
- revert: removing default parsers from `recommended` preset and `dependencies`
- fix: [using `vue-eslint-parser` as default parser for `*.vue` files](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/203)
- fix: [default parsers in the `recommended` preset](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/165)
- fix: [move `tailwindcss` to `peerDependencies`](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/201) (by [xeho91](https://github.com/xeho91) 🙏)
- feat: [Lint values in a object](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/135)
- feat: [Support for Object syntax in custom callees beside `classnames`](https://github.com/francoismassart/eslint-plugin-tailwindcss/pull/185)(by [dipsaus9](https://github.com/dipsaus9) 🙏)
- feat: [New option `skipClassAttribute`](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/154) you can turn on to only lint the `callees`
- FIX: support for Tailwind CSS version `3.2.3`

[View all releases on github](https://github.com/francoismassart/eslint-plugin-tailwindcss/releases)

## Screencasts on our YouTube Channel

| <a href="https://www.youtube.com/@eslint-plugin-tailwind-css"><img src=".github/youtube-eslint-plugin-tailwindcss-round.png" width="80" height="80" alt="YouTube Channel" /></a> | <span style="font-size:18px">[ESLint plugin Tailwind CSS](https://www.youtube.com/@eslint-plugin-tailwind-css)</span><br>youtube.com/@eslint-plugin-tailwindcss |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Installation

### 1. Install `eslint`

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i -D eslint
```

Then, create you `.eslintrc.js` file

```js
module.exports = {
  root: true,
};
```

### 2. Install `eslint-plugin-tailwindcss`

```
$ npm i -D eslint-plugin-tailwindcss
```

Edit your `.eslintrc` file to use our [`recommended` preset](https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/lib/index.js#L24) to get reasonable defaults:

```js
module.exports = {
  root: true,
  extends: ["plugin:tailwindcss/recommended"],
};
```

> If you do not use our preset you will need to specify individual rules and add extra configuration...

Learn more about [Configuring Rules in ESLint](https://eslint.org/docs/user-guide/configuring/rules).

### 3. Configure ESLint parsers

Depending on the languages you are using in your project you must tell which parser will analyze your source files.

Our recommendations:

- For `js[x]`, `react`, `ts[x]`:
  - Install the parser: `npm i -D @typescript-eslint/parser`
  - Assign it to your files in `eslintrc`:
    ```json5
    overrides: [
      {
        files: ['*.ts', '*.tsx', '*.js'],
        parser: '@typescript-eslint/parser',
      },
    ],
    ```
- For `vue.js`:
  - Install the parser: `npm i -D vue-eslint-parser`
  - Assign it to your files in `eslintrc`:
    ```json5
    overrides: [
      {
        files: ['*.vue'],
        parser: 'vue-eslint-parser',
      },
    ],
    ```
- For `HTML` and similar:
  - Install the parser: `npm i -D @angular-eslint/template-parser`
  - Assign it to your files in `eslintrc`:
    ```json5
    overrides: [
      {
        files: ['*.html', '*.blade.php'],
        parser: '@angular-eslint/template-parser',
      },
    ],
    ```

> We removed the default parsers which were added to `v3.8.2` because it created negative impact on dependencies resolution, bundle size increase and possible conflicts with existing configurations.

### 4. Add a npm script

In your `package.json` add one or more script(s) to run eslint targeting your source files:

```json5
"scripts": {
  "lint": "eslint ./src",
  "lint:debug": "eslint ./src --debug",
  "lint:fix": "eslint ./src --fix"
},
```

### 5. Run the linting task

`npm run lint` can do the job on demand but you can also get live feedback using [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), **just make sure you restart VS Code** as it can be required for the plugin to work as expected.

## More settings

The rules accept settings meant to fit your own choices, make sure to read the [documentation of each rule](https://github.com/francoismassart/eslint-plugin-tailwindcss/tree/master/docs/rules).

### Optional shared settings

Most rules share the same settings, instead of duplicating the options all over the place...

You should define the [shared settings](https://eslint.org/docs/user-guide/configuring#adding-shared-settings) that will be shared across all the plugin rules.

All these settings already have nice default values that are explained in the documentation.

FYI, here are the `default` values:

```json5
{
  settings: {
    tailwindcss: {
      // These are the default values but feel free to customize
      callees: ["classnames", "clsx", "ctl"],
      config: "tailwind.config.js", // returned from `loadConfig()` utility if not provided
      cssFiles: [
        "**/*.css",
        "!**/node_modules",
        "!**/.*",
        "!**/dist",
        "!**/build",
      ],
      cssFilesRefreshRate: 5_000,
      removeDuplicates: true,
      skipClassAttribute: false,
      whitelist: [],
      tags: [],
      classRegex: "^class(Name)?$", // can be modified to support custom attributes. E.g. "^tw$" for `twin.macro`
    },
  },
}
```

The plugin will look for each setting in this order and stops searching as soon as it finds the settings:

1. In the rule option argument (rule level)
2. In the shared settings (plugin level)
3. Default value of the requested setting (plugin level)...

## Upcoming Rules

- `validate-modifiers`: I don't know if possible, but I'd like to make sure all the modifiers prefixes of a classname are valid e.g. `yolo:bg-red` should throw an error...

- `no-redundant-variant`: e.g. avoid `mx-5 sm:mx-5`, no need to redefine `mx` in `sm:` variant as it uses the same value (`5`)

- `only-valid-arbitrary-values`:
  - e.g. avoid `top-[42]`, only `0` value can be unitless.
  - e.g. avoid `text-[rgba(10%,20%,30,50%)]`, can't mix `%` and `0-255`.
