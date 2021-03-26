# Detect classnames which do not belong to Tailwind CSS (no-custom-classname)

Enable this rule if you do not want to accept using classnames that are not defined in [Tailwind CSS](https://tailwindcss.com/).

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="w-12 my-custom">my-custom is not defined in Tailwind CSS!</div>
```

Examples of **correct** code for this rule:

```html
<div class="container box-content lg:box-border">Only Tailwind CSS classnames</div>
```
