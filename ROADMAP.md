# eslint-plugin-tailwindcss roadmap

- enhancements:
  - `classnames-order` use several errors to only highlight the classnames instead of the entire block
  - `enforces-negative-arbitrary-values` use several errors to only highlight the classnames instead of the entire block
- docs: explain why each rule is enhancing the code
- support for ESLint v10
- performances improvements

## May 2026

- [no-unnecessary-arbitrary-value](https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/HEAD/docs/rules/no-unnecessary-arbitrary-value.md)
- [no-arbitrary-value](https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/HEAD/docs/rules/no-arbitrary-value.md)
- [enforces-negative-arbitrary-values](https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/HEAD/docs/rules/enforces-negative-arbitrary-values.md)
- `enforces-shorthand`

## April 2026

- `no-contradicting-classname`

## September 2025

- full rewrite of the code base in TypeScript
- starting with a few rules, demonstrating the possibilities:
  - `classnames-order` with autofix
  - `no-custom-classname` with options, lint messages on specific substrings and suggestions
- including a recommended flat config
- include a playground/ demonstrating the usages and the possible configurations
