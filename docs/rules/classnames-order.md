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
  "groups": Array<object>,
  "prependCustom": <boolean>,
  "removeDuplicates": <boolean>
}]
...
```

### `callees` (default: `["ctl"]`)

If you use some utility library like [@netlify/classnames-template-literals](https://github.com/netlify/classnames-template-literals), you can add its name to the list to make sure it gets parsed by this rule.

For best results, gather the declarative classnames together, avoid mixing conditional classnames in between, move them at the end.

### `config` (default: `"tailwind.config.js"`)

By default the plugin will try to load the file `tailwind.config.js` at the root of your project.

This allows the plugin to use your customized `colors`, `spacing`, `screens`...

You can provide another path or filename for your Tailwind CSS config file like `"config/tailwind.js"`.

If the external file cannot be loaded (e.g. incorrect path or deleted file), an empty object `{}` will be used instead.

It is also possible to directly inject a configuration as plain `object` like `{ prefix: "tw-", theme: { ... } }`.

Finally, the plugin will [merge the provided configuration](https://tailwindcss.com/docs/configuration#referencing-in-java-script) with [Tailwind CSS's default configuration](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js).

### `groups` (default defined in [groups.js](../../lib/config/groups.js))

If you really need to, you can write your own configuration.

`groups` is a fairly long configuration array which defines the hierarchical orders to apply to your classnames prior to variants sorting.

I would recommend you to duplicate the `groups.js` file, move it in your own config location and move items as you wish. At its deepest, it is a list of patterns that will be used inside a regular expression.

```js
// custom-groups.js
module.exports.groups = [
  {
    type: 'LAYOUT',
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

### `prependCustom` (default: `false`)

By default, classnames which doesn't belong to Tailwind CSS will be pushed at the end. Set `prependCustom` to `true` if you prefer to move them at the beginning.

### `removeDuplicates` (default: `true`)

Duplicate classnames are automatically removed but you can always disable this behavior by setting `removeDuplicates` to `false`.

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
LAYOUT > Container
LAYOUT > Box Decoration Break
LAYOUT > Box Sizing
LAYOUT > Display
LAYOUT > Floats
LAYOUT > Clear
LAYOUT > Isolation
LAYOUT > Object Fit
LAYOUT > Object Position
LAYOUT > Overflow > overflow
LAYOUT > Overflow > overflow-x
LAYOUT > Overflow > overflow-y
LAYOUT > Overscroll Behavior > overscroll
LAYOUT > Overscroll Behavior > overscroll-x
LAYOUT > Overscroll Behavior > overscroll-y
LAYOUT > Position
LAYOUT > Top / Right / Bottom / Left > inset
LAYOUT > Top / Right / Bottom / Left > inset-y
LAYOUT > Top / Right / Bottom / Left > inset-x
LAYOUT > Top / Right / Bottom / Left > top
LAYOUT > Top / Right / Bottom / Left > right
LAYOUT > Top / Right / Bottom / Left > bottom
LAYOUT > Top / Right / Bottom / Left > left
LAYOUT > Visibility
LAYOUT > Z-Index
FLEXBOX > Flex Direction
FLEXBOX > Flex Wrap
FLEXBOX > Flex
FLEXBOX > Flex Grow
FLEXBOX > Flex Shrink
FLEXBOX > Order
GRID > Grid Template Columns
GRID > Grid Column Start / End > grid-column
GRID > Grid Column Start / End > grid-column-start
GRID > Grid Column Start / End > grid-column-end
GRID > Grid Template Rows
GRID > Grid Row Start / End > grid-row
GRID > Grid Row Start / End > grid-row-start
GRID > Grid Row Start / End > grid-row-end
GRID > Grid Auto Flow
GRID > Grid Auto Columns
GRID > Grid Auto Rows
GRID > Gap > gap
GRID > Gap > column-gap
GRID > Gap > row-gap
BOX ALIGNMENT > Justify Content
BOX ALIGNMENT > Justify Items
BOX ALIGNMENT > Justify Self
BOX ALIGNMENT > Align Content
BOX ALIGNMENT > Align Items
BOX ALIGNMENT > Align Self
BOX ALIGNMENT > Place Content
BOX ALIGNMENT > Place Items
BOX ALIGNMENT > Place Self
SPACING > Padding > p
SPACING > Padding > py
SPACING > Padding > px
SPACING > Padding > pt
SPACING > Padding > pr
SPACING > Padding > pb
SPACING > Padding > pl
SPACING > Margin > m
SPACING > Margin > my
SPACING > Margin > mx
SPACING > Margin > mt
SPACING > Margin > mr
SPACING > Margin > mb
SPACING > Margin > ml
SPACING > Space Between > space-y
SPACING > Space Between > space-x
SIZING > Width
SIZING > Min-Width
SIZING > Max-Width
SIZING > Height
SIZING > Min-Height
SIZING > Max-Height
TYPOGRAPHY > Font Family
TYPOGRAPHY > Font Size
TYPOGRAPHY > Font Smoothing
TYPOGRAPHY > Font Style
TYPOGRAPHY > Font Weight
TYPOGRAPHY > Font Variant Numeric
TYPOGRAPHY > Letter Spacing
TYPOGRAPHY > Line Height
TYPOGRAPHY > List Style Type
TYPOGRAPHY > List Style Position
TYPOGRAPHY > Placeholder Color
TYPOGRAPHY > Placeholder Opacity
TYPOGRAPHY > Text Alignment
TYPOGRAPHY > Text Color
TYPOGRAPHY > Text Opacity
TYPOGRAPHY > Text Decoration
TYPOGRAPHY > Text Transform
TYPOGRAPHY > Text Overflow
TYPOGRAPHY > Vertical Alignment
TYPOGRAPHY > Whitespace
TYPOGRAPHY > Word Break
BACKGROUNDS > Background Attachment
BACKGROUNDS > Background Clip
BACKGROUNDS > Background Color
BACKGROUNDS > Background Opacity
BACKGROUNDS > Background Position
BACKGROUNDS > Background Repeat
BACKGROUNDS > Background Size
BACKGROUNDS > Background Image
BACKGROUNDS > Gradient Color Stops > from
BACKGROUNDS > Gradient Color Stops > via
BACKGROUNDS > Gradient Color Stops > to
BORDERS > Border Radius > border-radius
BORDERS > Border Radius > border-radius-top
BORDERS > Border Radius > border-radius-right
BORDERS > Border Radius > border-radius-bottom
BORDERS > Border Radius > border-radius-left
BORDERS > Border Radius > border-radius-top-left
BORDERS > Border Radius > border-radius-top-right
BORDERS > Border Radius > border-radius-bottom-right
BORDERS > Border Radius > border-radius-bottom-left
BORDERS > Border Width > border-width
BORDERS > Border Width > border-top-width
BORDERS > Border Width > border-right-width
BORDERS > Border Width > border-bottom-width
BORDERS > Border Width > border-left-width
BORDERS > Border Color
BORDERS > Border Opacity
BORDERS > Border Style
BORDERS > Divide Width > divide-y
BORDERS > Divide Width > divide-x
BORDERS > Divide Width > divide-y-reverse
BORDERS > Divide Width > divide-x-reverse
BORDERS > Divide Color
BORDERS > Divide Opacity
BORDERS > Divide Style
BORDERS > Ring Width > ring
BORDERS > Ring Width > ring-inset
BORDERS > Ring Color
BORDERS > Ring Opacity
BORDERS > Ring Offset Width
BORDERS > Ring Offset Color
EFFECTS > Box Shadow
EFFECTS > Opacity
EFFECTS > Mix Blend Mode
EFFECTS > Background Blend Mode
FILTERS > Filter
FILTERS > Blur
FILTERS > Brightness
FILTERS > Contrast
FILTERS > Drop Shadow
FILTERS > Grayscale
FILTERS > Hue Rotate
FILTERS > Invert
FILTERS > Saturate
FILTERS > Sepia
FILTERS > Backdrop Filter
FILTERS > Backdrop Blur
FILTERS > Backdrop Brightness
FILTERS > Backdrop Contrast
FILTERS > Backdrop Grayscale
FILTERS > Backdrop Hue Rotate
FILTERS > Backdrop Invert
FILTERS > Backdrop Opacity
FILTERS > Backdrop Saturate
FILTERS > Backdrop Sepia
TABLES > Border Collapse
TABLES > Table Layout
TRANSITIONS AND ANIMATION > Transition Property
TRANSITIONS AND ANIMATION > Transition Duration
TRANSITIONS AND ANIMATION > Transition Timing Function
TRANSITIONS AND ANIMATION > Transition Delay
TRANSITIONS AND ANIMATION > Animation
TRANSFORMS > Transform
TRANSFORMS > Transform Origin
TRANSFORMS > Scale > scale
TRANSFORMS > Scale > scale-y
TRANSFORMS > Scale > scale-x
TRANSFORMS > Rotate
TRANSFORMS > Translate > translate-x
TRANSFORMS > Translate > translate-y
TRANSFORMS > Skew > skew-x
TRANSFORMS > Skew > skew-y
INTERACTIVITY > Appearance
INTERACTIVITY > Cursor
INTERACTIVITY > Outline
INTERACTIVITY > Pointer Events
INTERACTIVITY > Resize
INTERACTIVITY > User Select
SVG > Fill
SVG > Stroke
SVG > Stroke Width
ACCESSIBILITY > Screen Readers
OFFICIAL PLUGINS > Typography > prose
OFFICIAL PLUGINS > Typography > prose-modifier
OFFICIAL PLUGINS > Aspect Ratio > aspect-w
OFFICIAL PLUGINS > Aspect Ratio > aspect-h
OFFICIAL PLUGINS > Line Clamp
```
