# Enforces the canonical spelling of a classname, as resolved by the Tailwind CSS compiler

⚠️ This rule _warns_ in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Tailwind CSS can express the very same utility in more than one way. An arbitrary variant often has a first-class equivalent, an arbitrary value may match something already declared in your theme, and a few `v3` spellings were renamed in `v4` while remaining supported.

Since `v4.3.0` the compiler can tell you the canonical form of any candidate, so this rule asks it rather than maintaining its own list of equivalences. It reports the classnames whose canonical spelling differs from the one you wrote, and autofixes them.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<!-- Arbitrary variants which have a first-class equivalent -->
<ul class="[&>*]:flex-1 [&_*]:stroke-2 [&:nth-child(n+3)]:hidden">
  <li class="[.dropdown_&]:block">Demo</li>
</ul>

<!-- Arbitrary property which has a first-class equivalent -->
<div class="[transform:rotateY(180deg)]">Demo</div>

<!-- Spellings renamed in v4 -->
<div class="bg-gradient-to-r break-words">Demo</div>

<!-- Arbitrary value matching the theme, or expressible more simply -->
<div class="text-[#123456] -mt-[0.25em] bg-[var(--brand)]">Demo</div>
```

Examples of **correct** code for this rule:

```html
<ul class="*:flex-1 **:stroke-2 nth-[n+3]:hidden">
  <li class="in-[.dropdown]:block">Demo</li>
</ul>

<div class="transform-[rotateY(180deg)]">Demo</div>

<div class="bg-linear-to-r wrap-break-word">Demo</div>

<div class="text-primary mt-[-0.25em] bg-(--brand)">Demo</div>
```

Classnames which do not belong to Tailwind CSS are left untouched, they are the business of [`no-custom-classname`](./no-custom-classname.md).

### Why enforce the canonical classname?

- 👀 **Consistency**: the same utility is spelled the same way everywhere, so it is greppable
- 🤓 Move **away from deprecated** spellings before they are removed
- 🎨 **Reuse the theme** instead of hardcoding a value which already has a name
- 🪶 Shorter, more **idiomatic** classnames

### Requirements

The canonicalization comes from the Tailwind CSS compiler and needs **Tailwind CSS `>=4.3.0`**. On older `v4` releases the rule stays silent instead of failing.

### Relation to the other rules

[`no-unnecessary-arbitrary-value`](./no-unnecessary-arbitrary-value.md) also reports arbitrary values which match a preset, and both rules make the same suggestion in that case. This rule covers a wider range, notably the arbitrary variants and the renamed `v4` spellings, which the compiler resolves on its own.

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
