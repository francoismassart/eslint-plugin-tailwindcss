# Use a consistent orders for the Tailwind CSS classnames, based on property then on variants (tailwindcss/classnames-order)

Enforces a consistent order of the Tailwind CSS classnames and its variants.

> **Note**: By default, it uses the same order as the official [Tailwind CSS documentation](https://tailwindcss.com/docs/container) **v2.1.1**

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="sm:w-6 custom relative w-12"></div>
```

Examples of **correct** code for this rule:

```html
<div class="relative w-12 sm:w-6 custom"></div>
```

### Options

```js
...
"tailwindcss/classnames-order": [<enabled>, {
  "callees": Array<string>,
  "config": <string>|<object>,
  "groupByResponsive": <boolean>,
  "groups": Array<object>,
  "officialSorting": <boolean>,
  "prependCustom": <boolean>,
  "removeDuplicates": <boolean>,
  "tags": Array<string>,
}]
...
```

### `callees` (default: `["classnames", "clsx", "ctl"]`)

If you use some utility library like [@netlify/classnames-template-literals](https://github.com/netlify/classnames-template-literals), you can add its name to the list to make sure it gets parsed by this rule.

For best results, gather the declarative classnames together, avoid mixing conditional classnames in between, move them at the end.

### `config` (default: `"tailwind.config.js"`)

By default the plugin will try to load the file `tailwind.config.js` at the root of your project.

This allows the plugin to use your customized `colors`, `spacing`, `screens`...

You can provide another path or filename for your Tailwind CSS config file like `"config/tailwind.js"`.

If the external file cannot be loaded (e.g. incorrect path or deleted file), an empty object `{}` will be used instead.

It is also possible to directly inject a configuration as plain `object` like `{ prefix: "tw-", theme: { ... } }`.

Finally, the plugin will [merge the provided configuration](https://tailwindcss.com/docs/configuration#referencing-in-java-script) with [Tailwind CSS's default configuration](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js).

### `groupByResponsive` (default: `true`)

When this option was introduced in version 2.x.x of the plugin, this setting was set to `false` to avoid a tsunami of reorder in the classnames.
You had to set it to `true` intentionally.

Since version 3 of the plugin, the default value is now `true`, grouping by responsive modifier in priority vs. grouping by property.

Linting this code:

`<div class="rounded sm:rounded-lg lg:rounded-2xl p-4 sm:p-6 lg:p-8">...</div>`

By default, the ordering process will group the classnames by variants then by properties:

`<div class="p-4 rounded sm:p-6 sm:rounded-lg lg:p-8 lg:rounded-2xl">...</div>`

Set `groupByResponsive` to `false` and the ordering will work by properties, then by variants:

`<div class="p-4 sm:p-6 lg:p-8 rounded sm:rounded-lg lg:rounded-2xl">...</div>`

### `groups` (default defined in [groups.js](../../lib/config/groups.js))

If you really need to, you can write your own configuration.

`groups` is a fairly long configuration array which defines the hierarchical orders to apply to your classnames prior to variants sorting.

I would recommend you to duplicate the `groups.js` file, move it in your own config location and move items as you wish. At its deepest, it is a list of patterns that will be used inside a regular expression.

```js
// custom-groups.js
module.exports.groups = [
  {
    type: 'Layout',
    members: [
      {
        type: 'Floats',
        members: 'float\\-(right|left|none)',
      },
      {
        type: 'Box Sizing',
        members: 'box\\-(border|content)',
      },
      ...
    ],
  },
  ...
];
```

Import your own file then set it in your rules config.

```js
// .eslintrc.js
...
const customGroups = require('custom-groups').groups;
...
"tailwindcss/classnames-order": [2, {
  "groups": customGroups
}]
...
```

### `officialSorting` (default: `false`)

Set `officialSorting` to `true` if you want to use the same ordering rules as the official plugin `prettier-plugin-tailwindcss`. Enabling this settings will cause `groupByResponsive`, `groups`, `prependCustom` and `removeDuplicates` options to be ignored.

### `prependCustom` (default: `false`)

By default, classnames which doesn't belong to Tailwind CSS will be pushed at the end. Set `prependCustom` to `true` if you prefer to move them at the beginning.

### `removeDuplicates` (default: `true`)

Duplicate classnames are automatically removed but you can always disable this behavior by setting `removeDuplicates` to `false`.

### `tags` (default: `[]`)

Optional, if you are using tagged templates, you should provide the tags in this array.

## Further Reading

### How it works

1. Groups classnames by property
2. Sorts each group based on configuration
3. Within each group, it sorts the variants:
   1. Responsive (e.g. `sm:` ... `2xl:`, the order is based on the breakpoints defined in `theme.screens`)
   2. Theme
      1. (empty)
      2. `dark:`
   3. State (e.g. `hover:`... the order is based on `variantOrder`)

### Default groups

The [default `groups` configuration](../../lib/config/groups.js) will apply the following order, as in the official [Tailwind CSS documentation](https://tailwindcss.com/docs/container).

Each line represents a group (based on property).

```
Core Concepts
  Hover, Focus, & Other States
  Dark Mode
  Arbitrary properties
Layout
  Aspect Ratio
  Container
  Columns
  Break After
  Break Before
  Break Inside
  Box Decoration Break
  Box Sizing
  Display
  Floats
  Clear
  Isolation
  Object Fit
  Object Position
  Overflow
  Overscroll Behavior
  Position
  Top / Right / Bottom / Left
  Visibility
  Z-Index
Flexbox & Grid
  Flex Basis
  Flex Direction
  Flex Wrap
  Flex
  Flex Grow
  Flex Shrink
  Order
  Grid Template Columns
  Grid Column Start / End
  Grid Template Rows
  Grid Row Start / End
  Grid Auto Flow
  Grid Auto Columns
  Grid Auto Rows
  Gap
  Justify Content
  Justify Items
  Justify Self
  Align Content
  Align Items
  Align Self
  Place Content
  Place Items
  Place Self
Spacing
  Padding
  Margin
  Space Between
Sizing
  Width
  Min-Width
  Max-Width
  Height
  Min-Height
  Max-Height
Typography
  Font Family
  Font Size
  Font Smoothing
  Font Style
  Font Weight
  Font Variant Numeric
  Letter Spacing
  Line Height
  List Style Type
  List Style Position
  Text Alignment
  Text Color
  Text Decoration
  Text Decoration Color
  Text Decoration Style
  Text Decoration Thickness
  Text Underline Offset
  Text Transform
  Text Overflow
  Text Indent
  Vertical Alignment
  Whitespace
  Word Break
  Content
Backgrounds
  Background Attachment
  Background Clip
  Background Color
  Background Origin
  Background Position
  Background Repeat
  Background Size
  Background Image
  Gradient Color Stops
Borders
  Border Radius
  Border Width
  Border Color
  Border Style
  Divide Width
  Divide Color
  Divide Style
  Outline Width
  Outline Color
  Outline Style
  Outline Offset
  Ring Width
  Ring Inset
  Ring Color
  Ring Offset Width
  Ring Offset Color
Effects
  Box Shadow
  Box Shadow Color
  Opacity
  Mix Blend Mode
  Background Blend Mode
Filters
  Blur
  Brightness
  Contrast
  Drop Shadow
  Grayscale
  Hue Rotate
  Invert
  Saturate
  Sepia
  Backdrop Blur
  Backdrop Brightness
  Backdrop Contrast
  Backdrop Grayscale
  Backdrop Hue Rotate
  Backdrop Invert
  Backdrop Opacity
  Backdrop Saturate
  Backdrop Sepia
Tables
  Border Collapse
  Table Layout
Transitions & Animation
  Transition Property
  Transition Duration
  Transition Timing Function
  Transition Delay
  Animation
Transforms
  Transform GPU
  Scale
  Rotate
  Translate
  Skew
  Transform Origin
Interactivity
  Accent Color
  Appearance
  Cursor
  Caret Color
  Pointer Events
  Resize
  Scroll Behavior
  Scroll Margin
  Scroll Padding
  Scroll Snap Align
  Scroll Snap Stop
  Scroll Snap Type
  Touch Action
  User Select
  Will Change
SVG
  Fill
  Stroke
  Stroke Width
Accessibility
  Screen Readers
Official Plugins
  Typography
  Aspect Ratio
  Line Clamp
```
