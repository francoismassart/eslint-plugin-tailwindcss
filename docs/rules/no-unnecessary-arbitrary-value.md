# Avoid unjustified arbitrary classnames

⚠️ This rule _warns_ in the ✅ `recommended` config.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Enable this rule if you want to avoid arbitrary classname when a [Tailwind CSS](https://tailwindcss.com/) preset alternative is defined.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<video class="aspect-[16/9]">player</video>
```

Examples of **correct** code for this rule:

```html
<video class="aspect-video">player</video>
```

### Why avoid unnecessary arbitrary classnames?

- 👯 Eliminate **redundant classes**
- 🔍 Preserve **searchability and refactoring**
- 🌈 Respect your **Design System**
- ⚖️ **Less generated CSS**

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
