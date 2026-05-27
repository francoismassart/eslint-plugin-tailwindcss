# Avoid using multiple Tailwind CSS classnames when not required

⚠️ This rule _warns_ in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```html
<section class="mt-10 mb-10 mx-10 pt-5 pb-5 pr-15 pl-15">
  <h1 class="overflow-hidden text-ellipsis whitespace-nowrap">
    This title can be very long, it could get truncated on smaller screens!
  </h1>
</section>
```

Examples of **correct** code for this rule:

```html
<section class="m-10 py-5 px-15">
  <h1 class="truncate">
    This title can be very long, it could get truncated on smaller screens!
  </h1>
</section>
```

### Why using shorthands?

- ⚖️ **Reduce the amount of classnames**
- 🤓 Significantly **better readability**

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
