# Changelog

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
