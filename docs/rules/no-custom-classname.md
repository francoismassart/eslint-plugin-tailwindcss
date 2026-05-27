# Detects classnames which do not belong to Tailwind CSS

⚠️ This rule _warns_ in the ✅ `recommended` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Enable this rule if you do not want to accept using classnames that are not defined in [Tailwind CSS](https://tailwindcss.com/).

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="w-12 my-custom">my-custom is not defined in Tailwind CSS!</div>
```

Examples of **correct** code for this rule:

```html
<div class="container box-content lg:box-border">
  Only Tailwind CSS classnames
</div>
```

### Why avoid custom classnames?

- ⚠️ This is **could be a typo**
- 😎 No more "**Naming Fatigue**"
- ❤️ All in on **Tailwind CSS**
- 💥 Eliminate **file switching**
- 📐 No "Magic Numbers", just **Design Tokens**
- 🕊️ No CSS **specificity wars**
- 🪦 No more **dead code**

## Options

<!-- begin auto-generated rule options list -->

| Name        | Description                                                                  | Type     |
| :---------- | :--------------------------------------------------------------------------- | :------- |
| `whitelist` | List of classnames to ignore (whitelist). Exact match or regular expression. | String[] |

<!-- end auto-generated rule options list -->

This rule also uses the general [settings](../../README.md#settings).
