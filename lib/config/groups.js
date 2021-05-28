/**
 * @fileoverview Default grouping for Tailwind CSS classnames following the order of the official docs
 * @description The hierarchy of `members` can be useful to detect redundant and/or contradicting classnames
 * @version v2.1.0
 * @see https://tailwindcss.com/docs/container
 * @author François Massart
 */
module.exports.groups = [
  {
    type: 'CORE CONCEPTS',
    members: [
      {
        type: 'Hover, Focus, & Other States',
        members: 'group',
      },
    ],
  },
  {
    type: 'LAYOUT',
    members: [
      {
        type: 'Container',
        members: 'container',
      },
      {
        type: 'Box Decoration Break',
        members: 'decoration\\-(slice|clone)',
      },
      {
        type: 'Box Sizing',
        members: 'box\\-(border|content)',
      },
      {
        type: 'Display',
        members:
          'block|flex|grid|flow\\-root|contents|hidden|inline(\\-(block|flex|table|grid))?|table\\-(column|footer|header|row)\\-group|table(\\-(caption|row|cell|column))?|list\\-item',
      },
      {
        type: 'Floats',
        members: 'float\\-(right|left|none)',
      },
      {
        type: 'Clear',
        members: 'clear\\-(left|right|both|none)',
      },
      {
        type: 'Isolation',
        members: '(isolate|isolation\\-auto)',
      },
      {
        type: 'Object Fit',
        members: 'object\\-(contain|cover|fill|none|scale\\-down)',
      },
      {
        type: 'Object Position',
        members: 'object\\-${objectPosition}',
      },
      {
        type: 'Overflow',
        members: [
          {
            type: 'overflow',
            members: 'overflow\\-(auto|hidden|visible|scroll)',
          },
          {
            type: 'overflow-x',
            members: 'overflow\\-x\\-(auto|hidden|visible|scroll)',
          },
          {
            type: 'overflow-y',
            members: 'overflow\\-y\\-(auto|hidden|visible|scroll)',
          },
        ],
      },
      {
        type: 'Overscroll Behavior',
        members: [
          {
            type: 'overscroll',
            members: 'overscroll\\-(auto|contain|none)',
          },
          {
            type: 'overscroll-x',
            members: 'overscroll\\-x\\-(auto|contain|none)',
          },
          {
            type: 'overscroll-y',
            members: 'overscroll\\-y\\-(auto|contain|none)',
          },
        ],
      },
      {
        type: 'Position',
        members: 'static|fixed|absolute|relative|sticky',
      },
      {
        type: 'Top / Right / Bottom / Left',
        members: [
          {
            type: 'inset',
            members: '(inset\\-${inset}|\\-inset\\-${-inset})',
          },
          {
            type: 'inset-y',
            members: '(inset\\-y\\-${inset}|\\-inset\\-y\\-${-inset})',
          },
          {
            type: 'inset-x',
            members: '(inset\\-x\\-${inset}|\\-inset\\-x\\-${-inset})',
          },
          {
            type: 'top',
            members: '(top\\-${inset}|\\-top\\-${-inset})',
          },
          {
            type: 'right',
            members: '(right\\-${inset}|\\-right\\-${-inset})',
          },
          {
            type: 'bottom',
            members: '(bottom\\-${inset}|\\-bottom\\-${-inset})',
          },
          {
            type: 'left',
            members: '(left\\-${inset}|\\-left\\-${-inset})',
          },
        ],
      },
      {
        type: 'Visibility',
        members: '(in)?visible',
      },
      {
        type: 'Z-Index',
        members: 'z\\-${zIndex}',
      },
    ],
  },
  {
    type: 'FLEXBOX',
    members: [
      {
        type: 'Flex Direction',
        members: 'flex\\-(row|col)(\\-reverse)?',
      },
      {
        type: 'Flex Wrap',
        members: 'flex\\-(wrap(\\-reverse)?|nowrap)',
      },
      {
        type: 'Flex',
        members: 'flex\\-${flex}',
      },
      {
        type: 'Flex Grow',
        members: 'flex\\-grow(\\-${flexGrow})?',
      },
      {
        type: 'Flex Shrink',
        members: 'flex\\-shrink(\\-${flexShrink})?',
      },
      {
        type: 'Order',
        members: 'order\\-${order}',
      },
    ],
  },
  {
    type: 'GRID',
    members: [
      {
        type: 'Grid Template Columns',
        members: 'grid\\-cols\\-${gridTemplateColumns}',
      },
      {
        type: 'Grid Column Start / End',
        members: [
          {
            type: 'grid-column',
            members: 'col\\-${gridColumn}',
          },
          {
            type: 'grid-column-start',
            members: 'col\\-start\\-${gridColumnStart}',
          },
          {
            type: 'grid-column-end',
            members: 'col\\-end\\-${gridColumnEnd}',
          },
        ],
      },
      {
        type: 'Grid Template Rows',
        members: 'grid\\-rows\\-${gridTemplateRows}',
      },
      {
        type: 'Grid Row Start / End',
        members: [
          {
            type: 'grid-row',
            members: 'row\\-${gridRow}',
          },
          {
            type: 'grid-row-start',
            members: 'row\\-start\\-${gridRowStart}',
          },
          {
            type: 'grid-row-end',
            members: 'row\\-end\\-${gridRowEnd}',
          },
        ],
      },
      {
        type: 'Grid Auto Flow',
        members: 'grid\\-flow\\-(row|col)(\\-dense)?',
      },
      {
        type: 'Grid Auto Columns',
        members: 'auto\\-cols\\-${gridAutoColumns}',
      },
      {
        type: 'Grid Auto Rows',
        members: 'auto\\-rows\\-${gridAutoRows}',
      },
      {
        type: 'Gap',
        members: [
          {
            type: 'gap',
            members: 'gap\\-${gap}',
          },
          {
            type: 'column-gap',
            members: 'gap\\-x\\-${gap}',
          },
          {
            type: 'row-gap',
            members: 'gap\\-y\\-${gap}',
          },
        ],
      },
    ],
  },
  {
    type: 'BOX ALIGNMENT',
    members: [
      {
        type: 'Justify Content',
        members: 'justify\\-(start|end|center|between|around|evenly)',
      },
      {
        type: 'Justify Items',
        members: 'justify\\-items\\-(auto|start|end|center|stretch)',
      },
      {
        type: 'Justify Self',
        members: 'justify\\-self\\-(auto|start|end|center|stretch)',
      },
      {
        type: 'Align Content',
        members: 'content\\-(center|start|end|between|around|evenly)',
      },
      {
        type: 'Align Items',
        members: 'items\\-(start|end|center|baseline|stretch)',
      },
      {
        type: 'Align Self',
        members: 'self\\-(auto|start|end|center|stretch)',
      },
      {
        type: 'Place Content',
        members: 'place\\-content\\-(center|start|end|between|around|evenly|stretch)',
      },
      {
        type: 'Place Items',
        members: 'place\\-items\\-(auto|start|end|center|stretch)',
      },
      {
        type: 'Place Self',
        members: 'place\\-self\\-(auto|start|end|center|stretch)',
      },
    ],
  },
  {
    type: 'SPACING',
    members: [
      {
        type: 'Padding',
        members: [
          {
            type: 'p',
            members: 'p\\-${padding}',
          },
          {
            type: 'py',
            members: 'py\\-${padding}',
          },
          {
            type: 'px',
            members: 'px\\-${padding}',
          },
          {
            type: 'pt',
            members: 'pt\\-${padding}',
          },
          {
            type: 'pr',
            members: 'pr\\-${padding}',
          },
          {
            type: 'pb',
            members: 'pb\\-${padding}',
          },
          {
            type: 'pl',
            members: 'pl\\-${padding}',
          },
        ],
      },
      {
        type: 'Margin',
        members: [
          {
            type: 'm',
            members: '(m\\-${margin}|\\-m\\-${-margin})',
          },
          {
            type: 'my',
            members: '(my\\-${margin}|\\-my\\-${-margin})',
          },
          {
            type: 'mx',
            members: '(mx\\-${margin}|\\-mx\\-${-margin})',
          },
          {
            type: 'mt',
            members: '(mt\\-${margin}|\\-mt\\-${-margin})',
          },
          {
            type: 'mr',
            members: '(mr\\-${margin}|\\-mr\\-${-margin})',
          },
          {
            type: 'mb',
            members: '(mb\\-${margin}|\\-mb\\-${-margin})',
          },
          {
            type: 'ml',
            members: '(ml\\-${margin}|\\-ml\\-${-margin})',
          },
        ],
      },
      {
        type: 'Space Between',
        members: [
          {
            type: 'space-y',
            members: '(space\\-y\\-${space}|\\-space\\-y\\-${-space})',
          },
          {
            type: 'space-x',
            members: '(space\\-x\\-${space}|\\-space\\-x\\-${-space})',
          },
        ],
      },
    ],
  },
  {
    type: 'SIZING',
    members: [
      {
        type: 'Width',
        members: 'w\\-${width}',
      },
      {
        type: 'Min-Width',
        members: 'min\\-w\\-${minWidth}',
      },
      {
        type: 'Max-Width',
        members: 'max\\-w\\-${maxWidth}',
      },
      {
        type: 'Height',
        members: 'h\\-${height}',
      },
      {
        type: 'Min-Height',
        members: 'min\\-h\\-${minHeight}',
      },
      {
        type: 'Max-Height',
        members: 'max\\-h\\-${maxHeight}',
      },
    ],
  },
  {
    type: 'TYPOGRAPHY',
    members: [
      {
        type: 'Font Family',
        members: 'font\\-${fontFamily}',
      },
      {
        type: 'Font Size',
        members: 'text\\-${fontSize}',
      },
      {
        type: 'Font Smoothing',
        members: '(subpixel\\-)?antialiased',
      },
      {
        type: 'Font Style',
        members: '(not\\-)?italic',
      },
      {
        type: 'Font Weight',
        members: 'font\\-${fontWeight}',
      },
      {
        type: 'Font Variant Numeric',
        members:
          '(normal|lining|oldstyle|proportional|tabular)\\-nums|ordinal|slashed-zero|(diagonal|stacked)\\-fractions',
      },
      {
        type: 'Letter Spacing',
        members: 'tracking\\-${letterSpacing}',
      },
      {
        type: 'Line Height',
        members: 'leading\\-${lineHeight}',
      },
      {
        type: 'List Style Type',
        members: 'list\\-${listStyleType}',
      },
      {
        type: 'List Style Position',
        members: 'list\\-(in|out)side',
      },
      {
        type: 'Placeholder Color',
        members: 'placeholder\\-${placeholderColor}',
      },
      {
        type: 'Placeholder Opacity',
        members: 'placeholder\\-opacity\\-${placeholderOpacity}',
      },
      {
        type: 'Text Alignment',
        members: 'text\\-(left|center|right|justify)',
      },
      {
        type: 'Text Color',
        members: 'text\\-${textColor}',
      },
      {
        type: 'Text Opacity',
        members: 'text\\-opacity\\-${textOpacity}',
      },
      {
        type: 'Text Decoration',
        members: '(no\\-)?underline|line\\-through',
      },
      {
        type: 'Text Transform',
        members: '(upper|lower|normal\\-)case|capitalize',
      },
      {
        type: 'Text Overflow',
        members: 'truncate|overflow\\-(ellipsis|clip)',
      },
      {
        type: 'Vertical Alignment',
        members: 'align\\-(baseline|top|middle|bottom|text\\-(top|bottom))',
      },
      {
        type: 'Whitespace',
        members: 'whitespace\\-(normal|nowrap|pre(\\-(line|wrap))?)',
      },
      {
        type: 'Word Break',
        members: 'break\\-(normal|words|all)',
      },
    ],
  },
  {
    type: 'BACKGROUNDS',
    members: [
      {
        type: 'Background Attachment',
        members: 'bg\\-(fixed|local|scroll)',
      },
      {
        type: 'Background Clip',
        members: 'bg\\-clip\\-(border|padding|content|text)',
      },
      {
        type: 'Background Color',
        members: 'bg\\-${backgroundColor}',
      },
      {
        type: 'Background Opacity',
        members: 'bg\\-opacity\\-${backgroundOpacity}',
      },
      {
        type: 'Background Position',
        members: 'bg\\-${backgroundPosition}',
      },
      {
        type: 'Background Repeat',
        members: 'bg\\-(no\\-repeat|repeat(\\-(x|y|round|space))?)',
      },
      {
        type: 'Background Size',
        members: 'bg\\-${backgroundSize}',
      },
      {
        type: 'Background Image',
        members: 'bg\\-${backgroundImage}',
      },
      {
        type: 'Gradient Color Stops',
        members: [
          {
            type: 'from',
            members: 'from\\-${gradientColorStops}',
          },
          {
            type: 'via',
            members: 'via\\-${gradientColorStops}',
          },
          {
            type: 'to',
            members: 'to\\-${gradientColorStops}',
          },
        ],
      },
    ],
  },
  {
    type: 'BORDERS',
    members: [
      {
        type: 'Border Radius',
        members: [
          {
            type: 'border-radius',
            members: 'rounded(\\-${borderRadius})?',
          },
          {
            type: 'border-radius-top',
            members: 'rounded\\-t(\\-${borderRadius})?',
          },
          {
            type: 'border-radius-right',
            members: 'rounded\\-r(\\-${borderRadius})?',
          },
          {
            type: 'border-radius-bottom',
            members: 'rounded\\-b(\\-${borderRadius})?',
          },
          {
            type: 'border-radius-left',
            members: 'rounded\\-l(\\-${borderRadius})?',
          },
          {
            type: 'border-radius-top-left',
            members: 'rounded\\-tl(\\-${borderRadius})?',
          },
          {
            type: 'border-radius-top-right',
            members: 'rounded\\-tr(\\-${borderRadius})?',
          },
          {
            type: 'border-radius-bottom-right',
            members: 'rounded\\-br(\\-${borderRadius})?',
          },
          {
            type: 'border-radius-bottom-left',
            members: 'rounded\\-bl(\\-${borderRadius})?',
          },
        ],
      },
      {
        type: 'Border Width',
        members: [
          {
            type: 'border-width',
            members: 'border(\\-${borderWidth})?',
          },
          {
            type: 'border-top-width',
            members: 'border\\-t(\\-${borderWidth})?',
          },
          {
            type: 'border-right-width',
            members: 'border\\-r(\\-${borderWidth})?',
          },
          {
            type: 'border-bottom-width',
            members: 'border\\-b(\\-${borderWidth})?',
          },
          {
            type: 'border-left-width',
            members: 'border\\-l(\\-${borderWidth})?',
          },
        ],
      },
      {
        type: 'Border Color',
        members: 'border\\-${borderColor}',
      },
      {
        type: 'Border Opacity',
        members: 'border\\-opacity\\-${borderOpacity}',
      },
      {
        type: 'Border Style',
        members: 'border\\-(solid|dashed|dotted|double|none)',
      },
      {
        type: 'Divide Width',
        members: [
          {
            type: 'divide-y',
            members: 'divide\\-y(\\-${divideWidth})?',
          },
          {
            type: 'divide-x',
            members: 'divide\\-x(\\-${divideWidth})?',
          },
          {
            type: 'divide-y-reverse',
            members: 'divide\\-y\\-reverse',
          },
          {
            type: 'divide-x-reverse',
            members: 'divide\\-x\\-reverse',
          },
        ],
      },
      {
        type: 'Divide Color',
        members: 'divide\\-${divideColor}',
      },
      {
        type: 'Divide Opacity',
        members: 'divide\\-opacity\\-${divideOpacity}',
      },
      {
        type: 'Divide Style',
        members: 'divide\\-(solid|dashed|dotted|double|none)',
      },
      {
        type: 'Ring Width',
        members: [
          {
            type: 'ring',
            members: 'ring(\\-${ringWidth})?',
          },
          {
            type: 'ring-inset',
            members: 'ring\\-inset',
          },
        ],
      },
      {
        type: 'Ring Color',
        members: 'ring\\-${ringColor}',
      },
      {
        type: 'Ring Opacity',
        members: 'ring\\-opacity\\-${ringOpacity}',
      },
      {
        type: 'Ring Offset Width',
        members: 'ring\\-offset\\-${ringOffsetWidth}',
      },
      {
        type: 'Ring Offset Color',
        members: 'ring\\-offset\\-${ringOffsetColor}',
      },
    ],
  },
  {
    type: 'EFFECTS',
    members: [
      {
        type: 'Box Shadow',
        members: 'shadow(\\-${boxShadow})?',
      },
      {
        type: 'Opacity',
        members: 'opacity\\-${opacity}',
      },
      {
        type: 'Mix Blend Mode',
        members:
          'mix\\-blend\\-(normal|multiply|screen|overlay|darken|lighten|color\\-(burn|dodge)|(hard|soft)\\-light|difference|exclusion|hue|saturation|color|luminosity)',
      },
      {
        type: 'Background Blend Mode',
        members:
          'bg\\-blend\\-(normal|multiply|screen|overlay|darken|lighten|color\\-(dodge|burn)|(hard|soft)\\-light|difference|exclusion|hue|saturation|color|luminosity)',
      },
    ],
  },
  {
    type: 'FILTERS',
    members: [
      {
        type: 'Filter',
        members: 'filter(\\-none)?',
      },
      {
        type: 'Blur',
        members: 'blur(\\-${blur})?',
      },
      {
        type: 'Brightness',
        members: 'bightness\\-${brightness}',
      },
      {
        type: 'Contrast',
        members: 'contrast\\-${contrast}',
      },
      {
        type: 'Drop Shadow',
        members: 'drop\\-shadow(\\-${dropShadow})?',
      },
      {
        type: 'Grayscale',
        members: 'grayscale(\\-${grayscale})?',
      },
      {
        type: 'Hue Rotate',
        members: '(\\-)?hue\\-rotate\\-${hueRotate}',
      },
      {
        type: 'Invert',
        members: 'invert(\\-${invert})?',
      },
      {
        type: 'Saturate',
        members: 'saturate\\-${saturate}',
      },
      {
        type: 'Sepia',
        members: 'sepia(\\-${sepia})?',
      },
      {
        type: 'Backdrop Filter',
        members: 'backdrop\\-filter(\\-none)?',
      },
      {
        type: 'Backdrop Blur',
        members: 'backdrop\\-blur(\\-${backdropBlur})?',
      },
      {
        type: 'Backdrop Brightness',
        members: 'backdrop\\-brightness\\-${backdropBrightness}',
      },
      {
        type: 'Backdrop Contrast',
        members: 'backdrop\\-contrast\\-${backdropContrast}',
      },
      {
        type: 'Backdrop Grayscale',
        members: 'backdrop\\-grayscale(\\-${backdropGrayscale})?',
      },
      {
        type: 'Backdrop Hue Rotate',
        members: '(\\-)?backdrop\\-hue\\-rotate\\-${backdropHueRotate}',
      },
      {
        type: 'Backdrop Invert',
        members: 'backdrop\\-invert(\\-${backdropInvert})?',
      },
      {
        type: 'Backdrop Opacity',
        members: 'backdrop\\-opacity\\-${backdropOpacity}',
      },
      {
        type: 'Backdrop Saturate',
        members: 'backdrop\\-saturate\\-${backdropSaturate}',
      },
      {
        type: 'Backdrop Sepia',
        members: 'backdrop\\-sepia(\\-${backdropSepia})?',
      },
    ],
  },
  {
    type: 'TABLES',
    members: [
      {
        type: 'Border Collapse',
        members: 'border\\-(collapse|separate)',
      },
      {
        type: 'Table Layout',
        members: 'table\\-(auto|fixed)',
      },
    ],
  },
  {
    type: 'TRANSITIONS AND ANIMATION',
    members: [
      {
        type: 'Transition Property',
        members: 'transition(\\-${transitionProperty})?',
      },
      {
        type: 'Transition Duration',
        members: 'duration(\\-${transitionDuration})?',
      },
      {
        type: 'Transition Timing Function',
        members: 'ease(\\-${transitionTimingFunction})?',
      },
      {
        type: 'Transition Delay',
        members: 'delay\\-${transitionDelay}',
      },
      {
        type: 'Animation',
        members: 'animate\\-${animation}',
      },
    ],
  },
  {
    type: 'TRANSFORMS',
    members: [
      {
        type: 'Transform',
        members: 'transform(\\-(gpu|none))?',
      },
      {
        type: 'Transform Origin',
        members: 'origin\\-${transformOrigin}',
      },
      {
        type: 'Scale',
        members: [
          {
            type: 'scale',
            members: 'scale\\-${scale}',
          },
          {
            type: 'scale-y',
            members: 'scale\\-y\\-${scale}',
          },
          {
            type: 'scale-x',
            members: 'scale\\-x\\-${scale}',
          },
        ],
      },
      {
        type: 'Rotate',
        members: '(rotate\\-${rotate}|\\-rotate\\-${-rotate})',
      },
      {
        type: 'Translate',
        members: [
          {
            type: 'translate-x',
            members: '(translate\\-x\\-${translate}|\\-translate\\-x\\-${-translate})',
          },
          {
            type: 'translate-y',
            members: '(translate\\-y\\-${translate}|\\-translate\\-y\\-${-translate})',
          },
        ],
      },
      {
        type: 'Skew',
        members: [
          {
            type: 'skew-x',
            members: '(skew\\-x\\-${skew}|\\-skew\\-x\\-${-skew})',
          },
          {
            type: 'skew-y',
            members: '(skew\\-y\\-${skew}|\\-skew\\-y\\-${-skew})',
          },
        ],
      },
    ],
  },
  {
    type: 'INTERACTIVITY',
    members: [
      {
        type: 'Appearance',
        members: 'appearance\\-none',
      },
      {
        type: 'Cursor',
        members: 'cursor\\-${cursor}',
      },
      {
        type: 'Outline',
        members: 'outline\\-${outline}',
      },
      {
        type: 'Pointer Events',
        members: 'pointer\\-events\\-(none|auto)',
      },
      {
        type: 'Resize',
        members: 'resize(\\-(none|x|y))?',
      },
      {
        type: 'User Select',
        members: 'select\\-(none|text|all|auto)',
      },
    ],
  },
  {
    type: 'SVG',
    members: [
      {
        type: 'Fill',
        members: 'fill\\-${fill}',
      },
      {
        type: 'Stroke',
        members: 'stroke\\-${stroke}',
      },
      {
        type: 'Stroke Width',
        members: 'stroke\\-${strokeWidth}',
      },
    ],
  },
  {
    type: 'ACCESSIBILITY',
    members: [
      {
        type: 'Screen Readers',
        members: '(not\\-)?sr\\-only',
      },
    ],
  },
  {
    type: 'OFFICIAL PLUGINS',
    members: [
      {
        type: 'Typography',
        members: [
          {
            type: 'prose',
            members: 'prose',
          },
          {
            type: 'prose-modifier',
            members: 'prose(\\-${typography})?',
          },
        ],
      },
      // ('Forms' plugin has no related classnames, only selectors like `input[type='password']`)
      {
        type: 'Aspect Ratio',
        members: [
          {
            type: 'aspect-w',
            members: 'aspect\\-w\\-${aspectRatio}',
          },
          {
            type: 'aspect-h',
            members: 'aspect\\-h\\-${aspectRatio}',
          },
        ],
      },
      {
        type: 'Line Clamp',
        members: 'line\\-clamp\\-(none|${lineClamp})',
      },
    ],
  },
];
