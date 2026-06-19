# eslint-plugin-tailwindcss roadmap

# Next steps

- Support for Vue SFC
- Test with external `*.module.css` files
- `no-dynamic-classname` rule:
  - Don’t construct class names dynamically, Always use complete class names
- `no-redundant-variant`: e.g. avoid mx-5 sm:mx-5, no need to redefine mx in sm: variant as it uses the same value (5)
- `only-valid-arbitrary-values`:
  - e.g. avoid `top-[42]`, only `0` value can be unitless.
  - e.g. avoid `text-[rgba(10%,20%,30,50%)]`, can't mix `%` and `0-255`.
- `no-style-attribute` rule:
  - detecting `style` attribute and raising a warn/error
  - reading the style properties and suggest classname alternatives
- `enforce-single-space` rule:
  - which merge multiple spaces into a single space between the classnames. It should keep the spaces in front of the 1st classname per line too.
- `no-arbitrary-value` rule:
  - option or new rule to disallow number values like `border-1` in favor of `border-preset1`
  - detect `z-[0]` and suggest `z-0` even if not explicitly defined in the theme
  - it should also apply to the other `prop-<number>`
- `format-whitespaces` rule:
  - merge multiple spaces into one
  - have one classname per line
- `remove-duplicates` rule
- `remove-unecessary-font-props` rule:
  - Example
  ```js
  // --text-tiny: 0.625rem; /* text-tiny */
  // /* https://tailwindcss.com/docs/font-size#customizing-your-theme */
  // --text-tiny--line-height: 1.5rem; /* text-tiny-line-height */
  // --text-tiny--letter-spacing: 0.125rem; /* text-tiny-letter-spacing */
  // --text-tiny--font-weight: 500; /* text-tiny-font-weight */
  // check for unnecessary line-height, letter-spacing and font-weight classnames
  ```
- `no-unnecessary-arbitrary-value` rule:
  - enhance the rule in order to work with the `spacing` based values instead of an exact match in the config

# June 2026

- Expose the typings of the SharedSettings
- `parseKeyFunctions` new setting indicating on which function we should use the keys instead of the values
- Test with external library such as daisy UI
- docs: explain why each rule is enhancing the code
- support for ESLint v10
- performances improvements
- docs: set up a public repository demonstrating how to set up the linter
- fix: issue applying fixer in `TemplateLiteral`

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
