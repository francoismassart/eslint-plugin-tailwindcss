<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="images/logo-light.png">
    <img alt="eslint-plugin-tailwindcss" src="images/logo-dark.png">
  </picture>
</div>
![npm latest version](https://img.shields.io/npm/v/eslint-plugin-tailwindcss?style=for-the-badge) ![license](https://img.shields.io/npm/l/eslint-plugin-tailwindcss?style=for-the-badge) ![downloads](https://img.shields.io/npm/dt/eslint-plugin-tailwindcss?style=for-the-badge)

# `eslint-plugin-tailwindcss`

>

- Best practices & consistency since 2021
- [Made for Tailwind CSS v4](./CHANGELOG.md#made-for-tailwind-css-v4)
- [7 rules available](#rules) and more on the way
- What's new ? [Changelog](./CHANGELOG.md) | [Release notes](https://github.com/francoismassart/eslint-plugin-tailwindcss/releases) | [Roadmap](./ROADMAP.md)

## This project needs your help

<p align="center">
  <a href="https://github.com/sponsors/francoismassart">
      <img alt="Support eslint-plugin-tailwindcss" src="images/support.png">
    </picture>
  </a>
</p>
<p align="center">I spent countless days working on this plugin, and it is available to all for free.<br>If you benefits from my work and if you want to help me keep the project alive, consider becoming a sponsor.</p>

| Premium sponsors                                                                                                                                     | Current sponsors                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :--------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a href="https://www.sent.dm/" target="_blank"><img alt="Sent.dm" width="100" src="https://avatars.githubusercontent.com/u/153308555?s=200&v=4"></a> | <a href="https://github.com/codecov" target="_blank"><img class="avatar" src="https://avatars.githubusercontent.com/u/8226205?s=100&amp;v=4" width="50" height="50" style="border-radius:100%;" alt="@codecov"></a> <a href="https://github.com/getsentry" target="_blank"><img class="avatar" src="https://avatars.githubusercontent.com/u/1396951?s=100&amp;v=4" width="50" height="50" style="border-radius:100%;" alt="@getsentry"></a> |

<p align="center"><a href="https://github.com/sponsors/francoismassart">GitHub Sponsors</a> | <a href="https://thanks.dev/r/gh/francoismassart">thanks.dev Sponsors</a></p>

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                                                   | Description                                                                         | 💼  | ⚠️  | 🔧  | 💡  |
| :------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :-- | :-- | :-- | :-- |
| [classnames-order](docs/rules/classnames-order.md)                                     | Enforces a consistent order for the Tailwind CSS classnames, based on the compiler. |     | ✅  | 🔧  |     |
| [enforces-negative-arbitrary-values](docs/rules/enforces-negative-arbitrary-values.md) | Warns about `-` prefixed classnames using arbitrary values.                         |     | ✅  | 🔧  |     |
| [enforces-shorthand](docs/rules/enforces-shorthand.md)                                 | Avoid using multiple Tailwind CSS classnames when not required.                     |     | ✅  | 🔧  |     |
| [no-arbitrary-value](docs/rules/no-arbitrary-value.md)                                 | Forbid using arbitrary values in classnames.                                        |     |     |     |     |
| [no-contradicting-classname](docs/rules/no-contradicting-classname.md)                 | Avoid contradicting Tailwind CSS classnames.                                        | ✅  |     |     | 💡  |
| [no-custom-classname](docs/rules/no-custom-classname.md)                               | Detects classnames which do not belong to Tailwind CSS.                             |     | ✅  |     | 💡  |
| [no-unnecessary-arbitrary-value](docs/rules/no-unnecessary-arbitrary-value.md)         | Avoid unjustified arbitrary classnames.                                             |     | ✅  | 🔧  | 💡  |

<!-- end auto-generated rules list -->

## Getting started

### 1. Install the plugin

`npm i -D eslint-plugin-tailwindcss`

- As it is a dev dependency, it will not affected your final bundle size 🪶
- It can be installed with other package managers such as `pnpm`
- We support ESLint v10

> If you are still using Tailwind CSS v3 and/or older ESLint versions, you can use `eslint-plugin-tailwindcss@3.x.x`

### 2. Edit your `eslint.config` file

Here is a very basic example:

```js
// 1. import the plugin
import eslintPluginTailwindcss from "eslint-plugin-tailwindcss";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // 2. Optional: extend an existing config preset
    extends: [eslintPluginTailwindcss.configs.recommended],
    settings: {
      // 3. Define the tailwindcss settings with the MANDATORY cssConfigPath
      tailwindcss: {
        cssConfigPath: "./src/styles/tailwind.css",
      },
    },
    // 4. Optional: customize the rules to your needs
    rules: {
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-arbitrary-value": "warn",
      "tailwindcss/no-custom-classname": [
        "warn",
        { whitelist: ["custom\\-*"] },
      ],
      "tailwindcss/no-contradicting-classname": "warn",
    },
  },
]);
```

> `cssConfigPath` can be an absolute or a relative path. If you provide a relative path, the plugin will attempt to convert it into an absolute path.

### 3. Going further

You can also:

- run the linting process inside a pipeline of your hosted repository.
  - I would recommend to run it on your merge requests
  - Not on every single (pre)commit
- autoformat on save in your favorite IDE

## Settings

Most of the rules solely use the shared settings (shared across all the plugin rules). [Learn about eslint shared settings](https://eslint.org/docs/latest/use/configure/configuration-files#configuring-shared-settings) from the official documentation.

Here is a fully detailled example of shared settings:

```js
// eslint.config.mjs
{
  settings: {
    tailwindcss: {
      // Attributes/props that could contain Tailwind CSS classes...
      // Optional, default values: ["class", "className", "ngClass", "@apply"]
      attributes: ["class"],
      // The (absolute or relative) path pointing to you main Tailwind CSS v4 config file.
      // It must be a `.css` file (v4), not a `.js` file (v3)
      // REQUIRED, default value may not help
      cssConfigPath: "./styles/tailwind.css",
      // Functions/tagFunctions that will be parsed by the plugin.
      // Optional, default values: ["classnames", "clsx", "ctl", "cva", "tv", "tw"]
      functions: ["twClasses"],
      // Keys to be ignored in object expressions
      // Optional, default values: ["defaultVariants", "compoundVariants"]
      ignoredKeys: ["defaultVariants", "compoundVariants", "foo"],
      // Max size of the Set or Map objects used for caching
      // Optional, default value: 250_000
      cacheMaxSize: 150_000,
      // Max lifetime of the cache set in ms
      // Optional, default value: 10 * 60 * 1000 (10 minutes)
      cacheMaxAge: 60 * 1000,
    },
  }
}
```

The default settings are exported via the [`DEFAULT_SETTINGS`](src/utils/parse-plugin-settings.ts).

## Contributing

The project is open to all developers, you can [contribute the `eslint-plugin-tailwindcss`](CONTRIBUTING.md).

However, make sure to discuss the issue or the feature you wish to implement prior to getting to work unless you feel adventurous.
