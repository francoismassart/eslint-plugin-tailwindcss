# Forbid using arbitrary values in classnames

🚫 This rule is _disabled_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

This rule will shout at you if you use any arbitrary value in your classnames.

Only enable this rule if you want to stricly stick with your Tailwind
 CSS config's presets.

It will not complain if you are using classnames like `border-<number>`.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="w-[20rem]">Custom width</div>
```

Examples of **correct** code for this rule:

```html
<div class="w-custom-preset">Custom width</div>
```

with a config such as:

```css
@import "tailwindcss";

@theme {
  --width-custom-preset: 20rem;
}
```

### Why avoid arbitrary values?

- 📐 Enforced **design consistency**
- 🌈 Respect your **Design System**
- 🧹 **Cleaner**, more readable markup

### When to use arbitrary values?

- 🧬 For **truly unique**, one-off instances

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
