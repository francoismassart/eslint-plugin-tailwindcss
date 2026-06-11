# eslint-plugin-tailwindcss roadmap

# Next steps

- Support for Vue SFC
- Test daisy UI
- `enforce-single-space` a rule which merge multiple spaces into a single space between the classnames. It should keep the spaces in front of the 1st classname per line too.

# June 2026

- docs: explain why each rule is enhancing the code
- support for ESLint v10
- performances improvements
- docs: set up a public repository demonstrating how to set up the linter

## May 2026

- enhancements:
  - [`classnames-order`](./docs/rules/classnames-order.md) use several errors to only highlight the classnames instead of the entire block
  - [`enforces-shorthand`](./docs/rules/enforces-shorthand.md) use several errors to only highlight the classnames instead of the entire block
- [`no-unnecessary-arbitrary-value`](./docs/rules/no-unnecessary-arbitrary-value.md)
- [`no-arbitrary-value`](./docs/rules/no-arbitrary-value.md)
- [`enforces-negative-arbitrary-values`](./docs/rules/enforces-negative-arbitrary-values.md)
- [`enforces-shorthand`](./docs/rules/enforces-shorthand.md)

## April 2026

- [`no-contradicting-classname`](./docs/rules/no-contradicting-classname.md)

## September 2025

- full rewrite of the code base in TypeScript
- starting with a few rules, demonstrating the possibilities:
  - [`classnames-order`](./docs/rules/classnames-order.md) with autofix
  - [`no-custom-classname`](./docs/rules/no-custom-classname.md) with options, lint messages on specific substrings and suggestions
- including a recommended flat config
- include a playground/ demonstrating the usages and the possible configurations
