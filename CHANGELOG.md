# eslint-plugin-tailwindcss changelog

## `4.0.0-alpha.1`

- feat(typings): native support without using `definitly typed` project using `unbuild`
- feat(rule): [`classnames-order`](./docs/rules/classnames-order.md)
- feat(rule): [`no-custom-classname`](./docs/rules/no-custom-classname.md)
- feat(config): add `recommended` flat config
- fix(rule): underline specific classname instead of the entire node for `no-custom-classname`
- feat(suggestion): primitive suggestion for rule `no-custom-classname`

## `4.0.0-alpha.0`

### About Tailwind CSS 4 support

While the [development of `eslint-plugin-tailwindcss` for Tailwind CSS v4 is ongoing](https://github.com/francoismassart/eslint-plugin-tailwindcss/tree/alpha/v4), you can use the latest version published on the **beta channel** to get partial support of Tailwind CSS v4.

`npm i eslint-plugin-tailwindcss@beta -D`

> NB: As we will focus the effort on the full rewrite of the plugin, this version is available "as is" and you may get errors or false positives like for the rule `no-contradicting-classname `. You can [learn more about these issues on GitHub](https://github.com/hyoban/eslint-plugin-tailwindcss/pull/3).

You can always disable specific rules if necessary.

This version has been made possible thanks to the work of [hyoban](https://github.com/hyoban) and his project [`tailwind-api-utils`](https://github.com/hyoban/tailwind-api-utils).
