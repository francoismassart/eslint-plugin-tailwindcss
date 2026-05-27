# Avoid contradicting Tailwind CSS classnames

💼 This rule is enabled in the ✅ `recommended` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

In the same modifier context, you should not declare contradicting [Tailwind CSS](https://tailwindcss.com/) classnames.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="w-full w-1/2">Which width do we want ?</div>
```

Examples of **correct** code for this rule:

```html
<div class="w-full md:w-1/2">
  Full width on smaller screen and half width on medium screens
</div>
```

### Why avoid contradicting classnames?

- ⚠️ This is **clearly a mistake**
- 🪰 **Avoid bugs** & layout conflicts
- 🕸️ **Reduce code clutter**

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
