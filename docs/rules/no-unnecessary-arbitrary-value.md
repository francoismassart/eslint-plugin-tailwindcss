# Avoid unjustified arbitrary classnames

⚠️ This rule _warns_ in the ✅ `recommended` config.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Enable this rule if you want to avoid arbitrary classname when a [Tailwind CSS](https://tailwindcss.com/) preset alternative is defined.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<video class="inset-[1px] aspect-[16/9] z-[123] m-[-8px]">player</video>
```

Examples of **correct** code for this rule:

```html
<video class="inset-px aspect-video z-123 -m-2">player</video>
```

Prior to `v4.1.0`, this rule _only flagged exact string matches_ between an arbitrary value and a preset. The rule is now smart enough to resolve unit conversions and spacing configurations (`rem` & `px`).

The plugin will now suggest cleaner native alternatives for:

- **Native presets:** Replaces `inset-[1px]` with `inset-px` (previously ignored).
- **Unitless values:** Replaces `z-[123]` with `z-123`.
- **Spacing-based values:** Replaces `m-[8px]` with `m-2` (`--spacing: 0.25rem; /* 4px */`).

When it comes to [CSS specificity](https://css-tricks.com/specifics-on-css-specificity/), native presets, user presets, arbitrary value classnames, unitless values and spacing-based values all share the same score of `10` (since they are all declared via a single class name selector). Because their scores are identical, the order of declaration determines which style is applied: the CSS rule written last wins.

The cascading order—from strongest (highest priority) to weakest (lowest priority)—is as follows:

1. **Native preset** (e.g. `inset-px`)
2. **User preset** (e.g. `inset-preset`)
3. **Arbitrary value** (e.g. `inset-[20px]`)
4. **Generic** `<number>` (e.g. `inset-10`)

You can see this behavior in action in this [Tailwind CSS Play demo](https://play.tailwindcss.com/qNhD1AZLI6), which illustrates the order of declaration and its effects.

### How fixes are applied:

- The autofix feature will always apply the strongest available fix.
- If multiple fixes are available, alternative options will be provided as suggestions.

### Why avoid unnecessary arbitrary classnames?

- 👯 Eliminate **redundant classes**
- 🔍 Preserve **searchability and refactoring**
- 🌈 Respect your **Design System**
- ⚖️ **Less generated CSS**

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
