# In v4 you should place the `!` at the very end of the class name

⚠️ This rule _warns_ in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

As explained in the official documentation about the [important modifier](https://tailwindcss.com/docs/upgrade-guide#the-important-modifier):

> In `v3` you could mark a utility as important by placing an `!` at the beginning of the utility name (but after any variants).
>
> In `v4` you should place the `!` at the very end of the class name instead.

**The old way is still supported for compatibility but is deprecated.**

## Rule Details

Examples of **incorrect** code for this rule:

```html
<h1 class="!block">Demo</h1>
```

Examples of **correct** code for this rule:

```html
<h1 class="block!">Demo</h1>
```

### Why using `!` at the end?

- 🤓 Move **away from deprecated** old way

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
