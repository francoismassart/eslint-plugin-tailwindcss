# Enforces a consistent order for the Tailwind CSS classnames, based on the compiler

⚠️ This rule _warns_ in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

The ordering is solely done using the [order process from the official `prettier-plugin-tailwindcss`](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted).

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div
  class="text-gray-700 shadow-md p-3 border-gray-300 ml-4 h-24 flex border-2"
></div>
```

Examples of **correct** code for this rule:

```html
<div
  class="ml-4 flex h-24 border-2 border-gray-300 p-3 text-gray-700 shadow-md"
></div>
```

### Why the classnames order matters?

- 🤓 Improved **readability**
- 🛠️ **Easier maintenance** & debugging
- 🤝 **Predictable class merging**
- 🙏 **Smoother collaboration**
- 😅 **Less merge conflicts**

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
