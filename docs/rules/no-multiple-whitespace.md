# Removes unnecessary whitespaces between classnames (no-multiple-whitespace)

Removes any unnecessary whitespaces between Tailwind CSS classnames, keeping only one space between each class.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<span class=" bg-red-50   text-xl "></span>
```

Examples of **correct** code for this rule:

```html
<span class="bg-red-50 text-xl"></span>
```

## Further Reading

This rule automatically fixes the issue by removing the unnecessary whitespaces.
