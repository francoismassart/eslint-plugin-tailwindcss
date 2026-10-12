# Enforces the `(--variable)` shorthand over `[--variable]` arbitrary values

⚠️ This rule _warns_ in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

In Tailwind CSS `v3`, an arbitrary value made of a bare CSS variable was implicitly wrapped in `var()`: `bg-[--brand]` generated `background-color: var(--brand)`.

In `v4` this is no longer the case. `bg-[--brand]` now generates `background-color: --brand;`, which is invalid CSS, and the [CSS variable shorthand](https://tailwindcss.com/docs/upgrade-guide#using-variables-in-arbitrary-values) `bg-(--brand)` must be used instead.

This rule reports the arbitrary values which only hold a CSS variable and autofixes them to the shorthand. Variants, the `!` important modifier, the negative `-` prefix, the opacity modifier, a fallback value and a type hint are all preserved.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="border-[--pattern-fg]">Demo</div>

<div class="hover:bg-[--brand]/50 -mt-[--gap]">Demo</div>

<div class="bg-[--brand,red] text-[length:--size]">Demo</div>
```

Examples of **correct** code for this rule:

```html
<div class="border-(--pattern-fg)">Demo</div>

<div class="hover:bg-(--brand)/50 -mt-(--gap)">Demo</div>

<div class="bg-(--brand,red) text-(length:--size)">Demo</div>
```

### Out of scope

- `bg-[var(--brand)]` is valid in `v4`, its shorter spelling `bg-(--brand)` is suggested by [`enforces-canonical-classname`](./enforces-canonical-classname.md).
- Arbitrary properties such as `[--brand:red]` declare a variable and are left untouched.
- CSS variables used inside arbitrary variants, e.g. `max-[--bp]:flex`, are not reported.

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
