# Forbid passing styles affecting component internals (no-internal-style)

Tailwind recommends reusing styles by creating components using your favorite front-end framework (e.g. React). Such components almost always need to expose a way to set classes so that users can specify layout styles (e.g. margins, size, positioning). For example, in React, `<Button className="mt-5" ... />`. However, exposing the "put any style you want" string sometimes leads to developers customizing the internal appearance of the component, not only affecting their external layout. For example, the following overrides internal component styling which should really be controlled using a `variant`/`color` property instead of specified through `className`: `<Button className="bg-sky-500 text-semibold" ... />`.

This rule aims to restrict usage of internal properties in components. Unfortunately, detecting if a component should support internal style overrides or just external ones is not possible in the general case, so this rule differentiates these two based on the property name. For example, `class` and `className` would allow internal styles, and `classes` would not. This is configurable.

**By default this rule is turned `off`, if you want to use it set it to `warn` or `error`.**

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<Component classes="p-4">Padding is an internal concern</Component>
```

```jsx
<Component classes="flex flex-row">
  Display is an internal concern as well
</Component>
```

Examples of **correct** code for this rule:

```jsx
<Component classes="m-4">Margin is an external concern</Component>
```

```jsx
<Component className="p-4">`className` still allows internal styles</Component>
```

### Options

```js
...
"tailwindcss/no-internal-style": [<enabled>, {
  "externalClassRegex": <string>,
  "externalCallees": Array<string>,
  "skipClassAttribute": <boolean>,
  "tags": Array<string>,
}]
...
```

### `externalCallees` (default: `[]`)

If you use some utility library like [@netlify/classnames-template-literals](https://github.com/netlify/classnames-template-literals), you can add its name to the list to make sure it gets parsed by this rule.

You'll need to differentiate between the function you use for internal and external styles, for example by aliasing it with a different name:

```js
export const externcss = classnames;

// Config
"tailwindcss/no-internal-style": ["error", {
  "externalClassRegex": "^classes$",
  "externalCallees": ["externcss"]
}]

// Code
<Button classes={externcss(..., 'pt-2')}>...</Button>
```

### `ignoredKeys` (default: `["compoundVariants", "defaultVariants"]`)

Using libraries like `cva`, some of its object keys are not meant to contain classnames in its value(s).
You can specify which key(s) won't be parsed by the plugin using this setting.
For example, `cva` has `compoundVariants` and `defaultVariants`.
NB: As `compoundVariants` can have classnames inside its `class` property, you can also use a callee to make sure this inner part gets parsed while its parent is ignored.

### `skipClassAttribute` (default: `false`)

Set `skipClassAttribute` to `true` if you only want to lint the classnames inside one of the `callees`.
While, this will avoid linting the `class` and `className` attributes, it will still lint matching `callees` inside of these attributes.

### `tags` (default: `[]`)

Optional, if you are using tagged templates, you should provide the tags in this array.

### `externalClassRegex` (default: `"^class(Name)?$"`)

Optional, can be used to support custom attributes
