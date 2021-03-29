# Avoid contradicting Tailwind CSS classnames (e.g. "w-3 w-5") (no-contradicting-classname)

The majority of the Tailwind CSS classes only affect a single CSS property.
Using two or more classnames which affect the same property for the same variant means trouble and confusion.


## Rule Details

The rule aims to warn you about contradictions in the classnames you are attaching to an element.

Examples of **incorrect** code for this rule:

```html
<div class="container w-1 w-2">width ?</div>
```

Examples of **correct** code for this rule:

```html
<div class="container p-1 lg:p-4">padding is defined once per variant max.</div>
```

## Further Reading

This rule will not fix the issue but will let you know about the issue.