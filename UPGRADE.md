# Upgrade guide

## `eslint-plugin-tailwindcss` from `v3` to `v4`

Version 4 of the `eslint-plugin-tailwindcss` was rewritten entirely in TypeScript and it is exclusively compatible with Tailwind CSS v4.

If you are using Tailwind CSS v4, you should use the v4 of the plugin.

## Changes from v3

### Requirements

Your project must:

- use Tailwind CSS v4
- use node v20.19.0 or higher

### Shared settings

In v3, you were able to use different settings for different rules.

In v4, most of the settings can only be defined within the [shared settings](./README.md#settings).

You can read more about the available options of each rule in the docs. (e.g. [`no-unnecessary-arbitrary-value` which has no dedicated options](./docs/rules/no-unnecessary-arbitrary-value.md#options) or [`no-custom-classname` which uses a specific option](./docs/rules/no-custom-classname.md#options))

The most important setting is the `cssConfigPath` which expects a path pointing to the main CSS file used by Tailwind CSS. If the provided path is absolute, it is used as is. If the path is relative the plugin will attempt to convert it into an absolute path.

#### Modified settings

- `callees` is renamed `functions`
- `config`
  - renamed `cssConfigPath`
  - pointing to the main css file
- `cssFiles` is not used in v4
- `cssFilesRefreshRate` is not used in v4
- `removeDuplicates` is not used in v4
- `skipClassAttribute` is not used in v4
- `whitelist` is set in [`no-custom-classname`'s options](./docs/rules/no-custom-classname.md#options)
- `tags` is renamed `functions`
- `classRegex`
  - renamed `attributes`
  - only accept regular strings

### Removed rule

`migration-from-tailwind-2` rule has not been migrated to v4.

### Do you need help?

If you are experiencing issues setting up the plugin, make sure to read the logs of your ESLint installation to find useful informations.

You may also temporarly disable the caching used internally by the plugin via `cacheMaxSize` and `cacheMaxAge`. Just set them to `0`. Once your project applies our rules successfully, simply remove these settings and it will fallback to the defaults.

Prior to [opening an issue](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues), make sure to browse the existing issues, the solution may be already explained.
