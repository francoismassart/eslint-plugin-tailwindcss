# Disallow dynamic Tailwind class construction (no-string-interpolation)

Detect whether invalid string interpolation is used to generate Tailwind classnames.

## Rule Details

This rule reports use of string interpolation in class attributes when the interpolated value is part of the class name string (e.g. `bg-${color}`).
Tailwind CSS scans your source code for class names. If you use string interpolation to construct class names, Tailwind CSS will not find them and will not generate the corresponding CSS.

Examples of **incorrect** code for this rule:

```jsx
<div className={`bg-${color}`}></div>
<div className={`text-${size}`}></div>
```

Examples of **correct** code for this rule:

```jsx
// Use full class names
<div className={color === 'red' ? 'bg-red-500' : 'bg-blue-500'}></div>

// Or use a library like `classnames` or `clsx` (if configured)
<div className={classnames({ 'bg-red-500': isRed, 'bg-blue-500': !isRed })}></div>

// Interpolation is allowed if it's not part of a class name construction
<div className={`text-center ${color}`}></div>
```

## Further Reading

- [Tailwind CSS Documentation - Dynamic class names](https://tailwindcss.com/docs/content-configuration#dynamic-class-names)
