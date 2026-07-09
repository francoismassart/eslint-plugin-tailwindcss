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

Prior to `v4.1.0`, this rule _only flagged exact string matches_ between an arbitrary value and a preset. The rule is now smart enough to resolve unit conversions and spacing configurations.

The plugin will now suggest cleaner native alternatives for:

- **Native presets:** Replaces `inset-[1px]` with `inset-px` (previously ignored because `px` preset is not declared in the config, yet it exists).
- **Unitless values:** Replaces `z-[123]` with `z-123`.
- **Spacing-based values:** Replaces `m-[8px]` with `m-2` by intelligently parsing your Tailwind v4's configuration (`--spacing: 0.25rem; /* 4px */`).

### Why avoid unnecessary arbitrary classnames?

- 👯 Eliminate **redundant classes**
- 🔍 Preserve **searchability and refactoring**
- 🌈 Respect your **Design System**
- ⚖️ **Less generated CSS**

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
