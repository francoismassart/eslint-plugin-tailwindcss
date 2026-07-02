# Changelog

## `4.0.6`

- fix: false positives with `border` and `divide` by `no-contradicting-classname` rule [#461](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/461)

## `4.0.5`

- fix: missing `eslint` as peer dependency [#463](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/463)
- fix: `enforces-shorthand` did not work when prefixed [#462](https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/462)

## `4.0.4`

- minor: add [shadcn ui](https://ui.shadcn.com/)'s `cn` inside `functions` default values of the [settings](https://github.com/francoismassart/eslint-plugin-tailwindcss#settings)
- fix: `peer` & `peer/...` are now [considered valid classnames](https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/v4/src/rules/no-custom-classname.spec.ts#L63)

## `4.0.0`

### Made for Tailwind CSS v4

Version 4 of the `eslint-plugin-tailwindcss` is:

- re-written from scratch
- using TypeScript
- Based as much as possible on internal assets of Tailwind CSS:
  - via the [`prettier-plugin-tailwindcss` plugin](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
  - via [`tailwind-api-utils`](https://github.com/hyoban/tailwind-api-utils)
- only compatible with:
  - Tailwind CSS v4.x.x
  - ESLint flat config format
  - Node >= 20.19.0

This version has been made possible thanks to the work of [hyoban](https://github.com/hyoban) and his project [`tailwind-api-utils`](https://github.com/hyoban/tailwind-api-utils).

The pre-release versions were tested on our Nx monorepo which uses Next.js, react and offcourse Tailwind CSS 4.
