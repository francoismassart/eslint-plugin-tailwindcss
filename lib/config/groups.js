module.exports.groups = [
  {
    type: 'LAYOUT',
    members: [
      {
        type: 'Container',
        members: 'container',
      },
      {
        type: 'Box Sizing',
        members: 'box\\\-(border|content)',
      },
      {
        type: 'Display',
        members: '(block|flex|grid|flow\\\-root|contents|hidden|inline(\\\-(block|flex|grid))?|table\\\-(column|footer|header|row)\\\-group|table(\\\-(caption|row|cell|column))?)',
      },
      {
        type: 'Floats',
        members: 'float\\\-(right|left|none)',
      },
      {
        type: 'Clear',
        members: 'float\\\-(left|right|both|none)',
      },
      {
        type: 'Object Fit',
        members: 'object\\\-(contain|cover|fill|none|scale\\\-down)',
      },
      {
        type: 'Object Position',
        members: 'object\\\-(bottom|center|(left|right)(\\\-(bottom|top))?|top)',
      },
      {
        type: 'Overflow',
        members: [
          {
            type: 'overflow',
            members: 'overflow\\\-(auto|hidden|visible|scroll)',
          },    
          {
            type: 'overflow-x',
            members: 'overflow\\\-x\\\-(auto|hidden|visible|scroll)',
          },    
          {
            type: 'overflow-y',
            members: 'overflow\\\-y\\\-(auto|hidden|visible|scroll)',
          },    
        ],
      },
      {
        type: 'Overscroll Behavior',
        members: [
          {
            type: 'overscroll',
            members: 'overscroll\\\-(auto|contain|none)',
          },    
          {
            type: 'overscroll-x',
            members: 'overscroll\\\-x\\\-(auto|contain|none)',
          },    
          {
            type: 'overscroll-y',
            members: 'overscroll\\\-y\\\-(auto|contain|none)',
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
            members: '-?inset\\\-(\\\d\\\.?\\\/?\\\d?|auto|px|full)',
          },
          {
            type: 'inset-y',
            members: '-?inset\\\-y\\\-(\\\d\\\.?\\\/?\\\d?|auto|px|full)',
          },
          {
            type: 'inset-x',
            members: '-?inset\\\-x\\\-(\\\d\\\.?\\\/?\\\d?|auto|px|full)',
          },
          {
            type: 'top',
            members: '-?top\\\-(\\\d\\\.?\\\/?\\\d?|auto|px|full)',
          },
          {
            type: 'right',
            members: '-?right\\\-(\\\d\\\.?\\\/?\\\d?|auto|px|full)',
          },
          {
            type: 'bottom',
            members: '-?bottom\\\-(\\\d\\\.?\\\/?\\\d?|auto|px|full)',
          },
          {
            type: 'left',
            members: '-?left\\\-(\\\d\\\.?\\\/?\\\d?|auto|px|full)',
          },
        ],
      },
      {
        type: 'Visibility',
        members: '(in)?visible',
      },
      {
        type: 'Z-Index',
        members: 'z\\\-(0|10|20|30|40|50|auto)',
      },
    ],
  },
  {
    type: 'FLEXBOX',
    members: [
      {
        type: 'Flex Direction',
        members: 'flex\\\-(row|col)(\\\-reverse)?',
      },
      {
        type: 'Flex Wrap',
        members: 'flex\\\-(wrap(\\\-reverse)?|nowrap)',
      },
      {
        type: 'Flex',
        members: 'flex\\\-(1|auto|initial|none)',
      },
      {
        type: 'Flex Grow',
        members: 'flex\\\-grow(\\\-0)?',
      },
      {
        type: 'Flex Shrink',
        members: 'flex\\\-shrink(\\\-0)?',
      },
      {
        type: 'Order',
        members: 'order\\\-(\\\d[0-2]?|first|last|none)',
      },
    ],
  },
  {
    type: 'GRID',
    members: [
      {
        type: 'Grid Template Columns',
        members: 'grid\\\-cols\\\-(\\\d[0-2]?|none)',
      },
      {
        type: 'Grid Column Start / End',
        members: [
          {
            type: 'grid-column',
            members: 'col\\\-(auto|span\\\-(\\\d[0-2]?|full))',
          },
          {
            type: 'grid-column-start',
            members: 'col\\\-start\\\-(auto|\\\d[0-3]?)',
          },
          {
            type: 'grid-column-end',
            members: 'col\\\-end\\\-(auto|\\\d[0-3]?)',
          },
        ],
      },
      {
        type: 'Grid Template Rows',
        members: 'grid\\\-rows\\\-([1-6]|none)',
      },
      {
        type: 'Grid Row Start / End',
        members: [
          {
            type: 'grid-row',
            members: 'row\\\-(auto|span\\\-([1-6]|full))',
          },
          {
            type: 'grid-row-start',
            members: 'row\\\-start\\\-(auto|[1-7])',
          },
          {
            type: 'grid-row-end',
            members: 'row\\\-end\\\-(auto|[1-7])',
          },
        ],
      },
      {
        type: 'Grid Auto Flow',
        members: 'grid\\\-flow\\\-(row|col)(\\\-dense)?',
      },
      {
        type: 'Grid Auto Columns',
        members: 'auto\\\-cols\\\-(auto|min|max|fr)',
      },
      {
        type: 'Grid Auto Rows',
        members: 'auto\\\-rows\\\-(auto|min|max|fr)',
      },
      {
        type: 'Gap',
        members: [
          {
            type: 'gap',
            members: 'gap\\\-(\\\d(\\\d|(\\\.5))?|\\\d|px)',
          },
          {
            type: 'column-gap',
            members: 'gap\\\-x\\\-(\\\d(\\\d|(\\\.5))?|\\\d|px)',
          },
          {
            type: 'row-gap',
            members: 'gap\\\-y\\\-(\\\d(\\\d|(\\\.5))?|\\\d|px)',
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
        members: 'justify\\\-(start|end|center|between|around|evenly)',
      },
      {
        type: 'Justify Items',
        members: 'justify\\\-items\\\-(auto|start|end|center|stretch)',
      },
      {
        type: 'Justify Self',
        members: 'justify\\\-self\\\-(auto|start|end|center|stretch)',
      },
      {
        type: 'Align Content',
        members: 'content\\\-(center|start|end|between|around|evenly)',
      },
      {
        type: 'Align Items',
        members: 'items\\\-(start|end|center|baseline|stretch)',
      },
      {
        type: 'Align Self',
        members: 'items\\\-(auto|start|end|center|stretch)',
      },
      {
        type: 'Place Content',
        members: 'place\\\-content\\\-(center|start|end|between|around|evenly|stretch)',
      },
      {
        type: 'Place Items',
        members: 'place\\\-items\\\-(auto|start|end|center|stretch)',
      },
      {
        type: 'Place Self',
        members: 'place\\\-self\\\-(auto|start|end|center|stretch)',
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
            members: 'p\\\-(\\\d(\\\.?\\\d)?|px)',
          },
          {
            type: 'py',
            members: 'py\\\-(\\\d(\\\.?\\\d)?|px)',
          },
          {
            type: 'px',
            members: 'px\\\-(\\\d(\\\.?\\\d)?|px)',
          },
          {
            type: 'pt',
            members: 'pt\\\-(\\\d(\\\.?\\\d)?|px)',
          },
          {
            type: 'pr',
            members: 'pr\\\-(\\\d(\\\.?\\\d)?|px)',
          },
          {
            type: 'pb',
            members: 'pb\\\-(\\\d(\\\.?\\\d)?|px)',
          },
          {
            type: 'pl',
            members: 'pl\\\-(\\\d(\\\.?\\\d)?|px)',
          },
        ],
      },
      {
        type: 'Margin',
        members: [
          {
            type: 'm',
            members: '\\\-?m\\\-(\\\d(\\\.?\\\d)?|auto|px)',
          },
          {
            type: 'my',
            members: '\\\-?my\\\-(\\\d(\\\.?\\\d)?|auto|px)',
          },
          {
            type: 'mx',
            members: '\\\-?mx\\\-(\\\d(\\\.?\\\d)?|auto|px)',
          },
          {
            type: 'mt',
            members: '\\\-?mt\\\-(\\\d(\\\.?\\\d)?|auto|px)',
          },
          {
            type: 'mr',
            members: '\\\-?mr\\\-(\\\d(\\\.?\\\d)?|auto|px)',
          },
          {
            type: 'mb',
            members: '\\\-?mb\\\-(\\\d(\\\.?\\\d)?|auto|px)',
          },
          {
            type: 'ml',
            members: '\\\-?ml\\\-(\\\d(\\\.?\\\d)?|auto|px)',
          },
        ],
      },
      {
        type: 'Space Between',
        members: [
          {
            type: 'space-y',
            members: '\\-?space\\-y\\-(\\d(\\.?\\d)?|px|reverse)',
          },
          {
            type: 'space-x',
            members: '\\-?space\\-x\\-(\\d(\\.?\\d)?|px|reverse)',
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
        members: 'w\\\-(\\\d|\\\d\\\.\\\d|\\\d\\\d|auto|px|\\\d\\\d?\\\/\\\d\\\d?|full|screen|min|max)',
      },
      {
        type: 'Min-Width',
        members: 'min\\\-w\\\-(0|full|min|max)',
      },
      {
        type: 'Max-Width',
        members: 'max\\\-w\\\-(0|none|xs|sm|md|lg|[2-7]?xl|full|min|max|prose|screen\\\-(sm|md|lg|2?xl))',
      },
      {
        type: 'Height',
        members: 'h\\\-(\\\d(\\\.|\\\/)?\\\d?|auto|px|full|screen)',
      },
      {
        type: 'Min-Height',
        members: 'min\\\-h\\\-(0|full|screen)',
      },
      {
        type: 'Max-Height',
        members: 'max\\\-h\\\-(\\\d\\.?\\\d?|px|full|screen)',
      },
    ],
  },
  {
    type: 'TYPOGRAPHY',
    members: [
      {
        type: 'Font Family',
        members: 'font\\\-(sans|serif|mono)',
      },
      {
        type: 'Font Size',
        members: 'text\\\-(xs|sm|base|lg|[2-9]?xl)',
      },
      {
        type: 'Font Smoothing',
        members: '(subpixel\\\-)?antialiased',
      },
      {
        type: 'Font Style',
        members: '(not\\\-)?italic',
      },
      {
        type: 'Font Weight',
        members: 'font\\\-(thin|(extra)?light|normal|medium|(semi|extra)?bold|black)',
      },
      {
        type: 'Font Variant Numeric',
        members: '(normal|lining|oldstyle|proportional|tabular)\\\-nums|ordinal|slashed-zero|(diagonal|stacked)\\\-fractions',
      },
      {
        type: 'Letter Spacing',
        members: 'tracking\\\-(tight(er)?|normal|wide(r|st)?)',
      },
      {
        type: 'Line Height',
        members: 'leading\\\-([3-9]|10|none|tight|snug|normal|relaxed|loose)',
      },
      {
        type: 'List Style Type',
        members: 'list\\\-(none|disc|decimal)',
      },
      {
        type: 'List Style Position',
        members: 'list\\\-(in|out)side',
      },
      {
        type: 'Placeholder Color',
        members: 'placeholder\\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\\-[1-9]0?0?)',
      },
      {
        type: 'Placeholder Opacity',
        members: 'placeholder\\\-opacity\\\-(0|5|[1-9](0|5)0?)',
      },
      {
        type: 'Text Alignment',
        members: 'text\\\-(left|center|right|justify)',
      },
      {
        type: 'Text Color',
        members: 'text\\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\\-[1-9]0?0?)',
      },
      {
        type: 'Text Opacity',
        members: 'text\\\-opacity\\\-(0|5|[1-9](0|5)0?)',
      },
      {
        type: 'Text Decoration',
        members: '(no\\\-)?underline|line\\\-through',
      },
      {
        type: 'Text Transform',
        members: '(upper|lower|normal\\\-)case|capitalize',
      },
      {
        type: 'Text Overflow',
        members: 'truncate|overflow\\\-(ellipsis|clip)',
      },
      {
        type: 'Vertical Alignment',
        members: 'align\\\-(baseline|top|middle|bottom|text\\\-(top|bottom))',
      },
      {
        type: 'Whitespace',
        members: 'whitespace\\\-(normal|nowrap|pre(\\\-(line|wrap))?)',
      },
      {
        type: 'Word Break',
        members: 'break\\\-(normal|words|all)',
      },
    ],
  },
  {
    type: 'BACKGROUNDS',
    members: [
      {
        type: 'Background Attachment',
        members: 'bg\\\-(fixed|local|scroll)',
      },
      {
        type: 'Background Clip',
        members: 'bg\\\-clip\\\-(border|padding|content|text)',
      },
      {
        type: 'Background Color',
        members: 'bg\\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\\-[1-9]0?0?)',
      },
      {
        type: 'Background Opacity',
        members: 'bg\\\-opacity\\\-(0|5|[1-9](0|5)0?)',
      },
      {
        type: 'Background Position',
        members: 'bg\\\-(bottom|center|(left|right(\\\-(bottom|top))?|top))',
      },
      {
        type: 'Background Repeat',
        members: 'bg\\\-(no\\\-repeat|repeat(\\\-(x|y|round|space))?)',
      },
      {
        type: 'Background Size',
        members: 'bg\\\-(auto|cover|contain)',
      },
      {
        type: 'Background Image',
        members: 'bg\\\-(none|gradient\\\-to\\\-((t|b)(r|l)?|r|l))',
      },
      {
        type: 'Gradient Color Stops',
        members: [
          {
            type: 'from',
            members: 'from\\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\\-([1-9]00|50))',
          },
          {
            type: 'via',
            members: 'via\\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\\-([1-9]00|50))',
          },
          {
            type: 'to',
            members: 'to\\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\\-([1-9]00|50))',
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
            members: 'rounded(\\-(none|sm|md|lg|(2|3)?xl|full))?',
          },
          {
            type: 'border-radius-top-left',
            members: 'rounded\\-tl(\\-(none|sm|md|lg|(2|3)?xl|full))?',
          },
          {
            type: 'border-radius-top-right',
            members: 'rounded\\-tr(\\-(none|sm|md|lg|(2|3)?xl|full))?',
          },
          {
            type: 'border-radius-top',
            members: 'rounded\\-t(\\-(none|sm|md|lg|(2|3)?xl|full))?',
          },
          {
            type: 'border-radius-right',
            members: 'rounded\\-r(\\-(sm|md|lg|(2|3)?xl|full))?',
          },
          {
            type: 'border-radius-bottom-left',
            members: 'rounded\\-bl(\\-(none|sm|md|lg|(2|3)?xl|full))?',
          },
          {
            type: 'border-radius-bottom-right',
            members: 'rounded\\-br(\\-(none|sm|md|lg|(2|3)?xl|full))?',
          },
          {
            type: 'border-radius-bottom',
            members: 'rounded\\-b(\\-(sm|md|lg|(2|3)?xl|full))?',
          },
          {
            type: 'border-radius-left',
            members: 'rounded\\-l(\\-(sm|md|lg|(2|3)?xl|full))?',
          },
        ],
      },
      {
        type: 'Border Width',
        members: [
          {
            type: 'border-width',
            members: 'border(\\-(0|2|4|8))?',
          },
          {
            type: 'border-top-width',
            members: 'border\\-t(\\-(0|2|4|8))?',
          },
          {
            type: 'border-right-width',
            members: 'border\\-r(\\-(0|2|4|8))?',
          },
          {
            type: 'border-bottom-width',
            members: 'border\\-b(\\-(0|2|4|8))?',
          },
          {
            type: 'border-left-width',
            members: 'border\\-l(\\-(0|2|4|8))?',
          },
        ],
      },
      {
        type: 'Border Color',
        members: 'border\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\-[1-9]0?0?)',
      },
      {
        type: 'Border Opacity',
        members: 'border\\-opacity\\-(0|5|[1-9](0|5)0?)',
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
            members: 'divide\\-y(\\-(0|2|4|8))?',
          },
          {
            type: 'divide-x',
            members: 'divide\\-x(\\-(0|2|4|8))?',
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
        members: 'divide\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\-[1-9]0?0?)',
      },
      {
        type: 'Divide Opacity',
        members: 'divide\\-opacity\\-(0|5|[1-9](0|5)0?)',
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
            members: 'ring(\\-(0|2|4|8))?',
          },
          {
            type: 'ring-inset',
            members: 'ring\\-inset',
          },
        ],
      },
      {
        type: 'Ring Color',
        members: 'ring\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\-[1-9]0?0?)',
      },
      {
        type: 'Ring Opacity',
        members: 'ring\\-opacity\\-(0|5|[1-9](0|5)0?)',
      },
      {
        type: 'Ring Offset Width',
        members: 'ring\\-offset\\-(0|1|2|4|8))',
      },
      {
        type: 'Ring Offset Color',
        members: 'ring\\-offset\\-(transparent|current|black|white|(gray|red|yellow|green|blue|indigo|purple|pink)\\-[1-9]0?0?)',
      },
    ],
  },
  // {
  //   type: 'EFFECTS',
  //   members: [],
  // }
];