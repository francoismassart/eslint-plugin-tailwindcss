/**
 * @fileoverview Utilities used for grouping classnames
 */

'use strict';

// Ambiguous values
// ================
// Supported hints: length, color, angle, list
// -------------------------------------------
//
// border-[color/width]
// text-[color/size]
// ring-[color/width]
// ring-offset-[color/width]
// stroke-[current/width]
// bg-[color/(position/size)]
//
// font-[family/weight]

const angle = require('./types/angle');
const color = require('./types/color');
const length = require('./types/length');

/**
 * Escape special chars for regular expressions
 *
 * @param {String} str Regular expression to be escaped
 * @returns {String} Escaped version
 */
function escapeSpecialChars(str) {
  return str.replace(/\W/g, '\\$&');
}

/**
 * Get additional opacity suffix if property supports it
 *
 * @param {String} propName The property
 * @param {Object} config Tailwind CSS Config
 * @returns {String} The suffix or an empty string
 */
function getOpacitySuffix(propName, config) {
  if (['backgroundColor', 'gradientColorStops', 'placeholderColor', 'textColor'].includes(propName)) {
    return generateOptionalOpacitySuffix(config);
  }
  return '';
}

/**
 * Generates the opacity suffix based on config
 *
 * @param {Object} config Tailwind CSS Config
 * @returns {String} The suffix or an empty string
 */
function generateOptionalOpacitySuffix(config) {
  const opacityKeys = !config.theme['opacity'] ? [] : Object.keys(config.theme['opacity']);
  if (opacityKeys.length === 0) {
    return '';
  }
  return `(\\/(${opacityKeys.join('|')}))?`;
}

/**
 * Generate the possible options for the RegEx
 *
 * @param {String} propName The name of the prop e.g. textColor
 * @param {Array} escapedKeys Keys to be injected in the options
 * @param {Object} config Tailwind CSS Config
 * @param {Boolean} isNegative If the value is negative
 * @returns {String} Generated part of regex exposing the possible values
 */
function generateOptions(propName, keys, config, isNegative = false) {
  const genericArbitraryOption = '\\[(.*)\\]';
  const supportArbitrary = config.mode === 'jit' && !isNegative;
  const defaultKeyIndex = keys.findIndex((v) => v === 'DEFAULT');
  if (defaultKeyIndex > -1) {
    keys.splice(defaultKeyIndex, 1);
  }
  const escapedKeys = keys.map((k) => escapeSpecialChars(k));
  switch (propName) {
    case 'dark':
      // Optional `dark` class
      return config.darkMode === 'class' ? 'dark' : '';
    case 'backgroundColor':
    case 'borderColor':
    case 'divideColor':
    case 'ringColor':
    case 'ringOffsetColor':
    case 'textColor':
    case 'stroke':
    case 'gradientColorStops':
    case 'placeholderColor':
      // Colors can use segments like 'indigo' and 'indigo-light'
      // https://tailwindcss.com/docs/customizing-colors#color-object-syntax
      const options = [];
      // Conditionnaly generates the opacity suffix
      const opacitySuffix = supportArbitrary ? getOpacitySuffix(propName, config) : '';
      keys.forEach((k) => {
        const color = config.theme[propName][k] || config.theme.colors[k];
        if (typeof color === 'string') {
          options.push(escapeSpecialChars(k) + opacitySuffix);
        } else {
          const variants = Object.keys(color).map((colorKey) => escapeSpecialChars(colorKey));
          const defaultIndex = variants.findIndex((v) => v === 'DEFAULT');
          const hasDefault = defaultIndex > -1;
          if (hasDefault) {
            variants.splice(defaultIndex, 1);
          }
          options.push(k + '(\\-(' + variants.join('|') + '))' + (hasDefault ? '?' : '') + opacitySuffix);
        }
      });
      if (supportArbitrary) {
        const arbitraryColors = [...color.mergedColorValues];
        switch (propName) {
          case 'gradientColorStops':
          case 'placeholderColor':
            arbitraryColors.push(color.RGBAPercentages); // RGBA % 0.5[%]
            arbitraryColors.push(color.optionalColorPrefixedVar);
            arbitraryColors.push(color.notHSLAPlusWildcard);
            break;
          default:
            arbitraryColors.push(color.mandatoryColorPrefixed);
        }
        options.push(`\\[(${arbitraryColors.join('|')})\\]`);
      }
      return '(' + options.join('|') + ')';
    case 'borderWidth':
    case 'divideWidth':
    case 'fontSize':
    case 'ringWidth':
    case 'ringOffsetWidth':
      if (supportArbitrary) {
        escapedKeys.push(length.selectedUnitsRegEx);
        escapedKeys.push(length.anyCalcRegEx);
        // Mandatory `length:` prefix + wildcard
        escapedKeys.push(`\\[length\\:.{1,}\\]`);
      }
      return '(' + escapedKeys.join('|') + ')';
    case 'strokeWidth':
      if (supportArbitrary) {
        escapedKeys.push(length.selectedUnitsRegEx);
        escapedKeys.push(length.anyCalcRegEx);
        // Mandatory `length:` prefix + calc + wildcard
        escapedKeys.push(`\\[length\\:calc\\(.{1,}\\)\\]`);
        // Mandatory `length:` prefix + wildcard + optional units
        escapedKeys.push(`\\[length\\:(.{1,})(${length.selectedUnits.join('|')})?\\]`);
      }
      return '(' + escapedKeys.join('|') + ')';
    case 'gap':
    case 'height':
    case 'lineHeight':
    case 'maxHeight':
    case 'maxWidth':
    case 'minHeight':
    case 'minWidth':
    case 'padding':
    case 'width':
    case 'inset':
    case 'letterSpacing':
    case 'margin':
    case 'space':
    case 'blur':
    case 'brightness':
    case 'contrast':
    case 'grayscale':
    case 'hueRotate':
    case 'invert':
    case 'saturate':
    case 'sepia':
    case 'backdropBlur':
    case 'backdropBrightness':
    case 'backdropContrast':
    case 'backdropGrayscale':
    case 'backdropHueRotate':
    case 'backdropInvert':
    case 'backdropOpacity':
    case 'backdropSaturate':
    case 'backdropSepia':
    case 'transitionDuration':
    case 'transitionTimingFunction':
    case 'transitionDelay':
    case 'animation':
    case 'transformOrigin':
    case 'scale':
    case 'translate':
    case 'skew':
    case 'cursor':
    case 'outline':
      if (supportArbitrary) {
        // All units
        escapedKeys.push(length.mergedUnitsRegEx);
        // Forbidden prefixes
        escapedKeys.push(`\\[(?!(angle|color|length|list)\:).{1,}\\]`);
      }
      return '(' + escapedKeys.join('|') + ')';
    case 'fill':
      if (supportArbitrary) {
        // All units
        escapedKeys.push(length.mergedUnitsRegEx);
        // Forbidden prefixes
        escapedKeys.push(`\\[(?!(angle|length|list)\:).{1,}\\]`);
      }
      return '(' + escapedKeys.join('|') + ')';
    case 'placeholderOpacity':
    case 'textOpacity':
    case 'backgroundOpacity':
    case 'borderOpacity':
    case 'divideOpacity':
    case 'ringOpacity':
    case 'opacity':
      if (supportArbitrary) {
        // 0 ... .5 ... 1
        escapedKeys.push(`\\[(0(\\.\\d{1,})?|\\.\\d{1,}|1)\\]`);
        escapedKeys.push(length.anyCalcRegEx);
        // Unprefixed var()
        escapedKeys.push(`\\[var\\(\\-\\-[A-Za-z\\-]{1,}\\)\\]`);
      }
      return '(' + escapedKeys.join('|') + ')';
    case 'rotate':
      if (supportArbitrary) {
        escapedKeys.push(`\\[(${angle.mergedAngleValues.join('|')})\\]`);
      }
      return '(' + escapedKeys.join('|') + ')';
    case 'gridTemplateColumns':
    case 'gridColumn':
    case 'gridColumnStart':
    case 'gridColumnEnd':
    case 'gridTemplateRows':
    case 'gridRow':
    case 'gridRowStart':
    case 'gridRowEnd':
    case 'gridAutoColumns':
    case 'gridAutoRows':
      if (supportArbitrary) {
        // Forbidden prefixes
        escapedKeys.push(`\\[(?!(angle|color|length)\:).{1,}\\]`);
      }
      return '(' + escapedKeys.join('|') + ')';
    case 'listStyleType':
      if (supportArbitrary) {
        // Forbidden prefixes
        escapedKeys.push(`\\[(?!(angle|color|length|list)\:).{1,}\\]`);
      }
      return '(' + escapedKeys.join('|') + ')';
    case 'objectPosition':
      if (supportArbitrary) {
        // Forbidden prefixes
        escapedKeys.push(`\\[(?!(angle|color|length)\:).{1,}\\]`);
      }
      return '(' + escapedKeys.join('|') + ')';
    case 'backgroundPosition':
    case 'backgroundSize':
    case 'backgroundImage':
    case 'fontFamily':
    case 'fontWeight':
    case 'boxShadow':
    case 'dropShadow':
    case 'transitionProperty':
    case 'typography':
    case 'aspectRatio':
    case 'lineClamp':
      // Cannot be arbitrary?
      return '(' + escapedKeys.join('|') + ')';
    case 'flexGrow':
    case 'flexShrink':
    case 'order':
    case 'zIndex':
    case 'flex':
    case 'borderRadius':
    default:
      if (supportArbitrary) {
        escapedKeys.push(genericArbitraryOption);
      }
      return '(' + escapedKeys.join('|') + ')';
  }
}

/**
 * Customize the regex based on config
 *
 * @param {String} re Regular expression
 * @param {Object} config The merged Tailwind CSS config
 * @returns {String} Patched version with config values and additinal parameters
 */
function patchRegex(re, config) {
  let patched = '';
  if (config.mode === 'jit') {
    patched += '\\!?';
  }
  // Prefix
  if (config.prefix.length) {
    patched += escapeSpecialChars(config.prefix);
  }
  // Props
  let replaced = re;
  const propsRe = /\$\{(\-?[a-z]*)\}/gi;
  const props = [...replaced.matchAll(propsRe)].map((arr) => arr[1]);
  if (props.length === 0) {
    return `${patched}(${replaced})`;
  }
  // e.g. backgroundColor, letterSpacing...
  props.forEach((prop) => {
    const token = new RegExp('\\$\\{' + prop + '\\}');
    const isNegative = prop.substr(0, 1) === '-';
    const patchedProp = isNegative ? prop.substr(1) : prop;
    if (prop === 'dark') {
      // Special case, not a default property from the theme
      replaced = replaced.replace(token, generateOptions(patchedProp, [], config, isNegative));
      return `${patched}(${replaced})`;
    } else if (!config.theme || !config.theme[patchedProp]) {
      // prop not found in config
      return;
    }
    const keys = Object.keys(config.theme[patchedProp]).filter((k) => {
      const first = k.substr(0, 1);
      return isNegative ? first === '-' : first !== '-';
    });
    const absoluteKeys = keys.map((k) => {
      return isNegative ? k.substr(1) : k;
    });
    if (keys.length === 0 || replaced.match(token) === null) {
      // empty array
      return;
    }
    replaced = replaced.replace(token, generateOptions(patchedProp, absoluteKeys, config, isNegative));
  });
  return `${patched}(${replaced})`;
}

/**
 * Generates a flatten array from the groups config
 *
 * @param {Array} groupsConfig The array of objects containing the regex
 * @param {Object} twConfig The merged config of Tailwind CSS
 * @returns {Array} Flatten array
 */
function getGroups(groupsConfig, twConfig = null) {
  const jitEnabled = twConfig && twConfig.mode && twConfig.mode === 'jit';
  const groups = [];
  groupsConfig.forEach((group) => {
    // e.g. SIZING or SPACING
    group.members.forEach((prop) => {
      // e.g. Width or Padding
      if (typeof prop.members === 'string') {
        // Unique property, like `width` limited to one value
        groups.push(prop.members);
      } else {
        // Multiple properties, like `padding`, `padding-top`...
        prop.members.forEach((subprop) => {
          const jitOnly = subprop['mode'] === 'jit';
          if (!jitOnly) {
            // Supported
            groups.push(subprop.members);
          } else if (jitEnabled) {
            // Only supported via JIT mode
            groups.push(subprop.members);
          }
        });
      }
    });
  });
  if (twConfig === null) {
    return groups;
  }
  return groups.map((re) => patchRegex(re, twConfig));
}

/**
 * Generates an array of empty arrays prior to grouping
 *
 * @param {Array} groups The array of objects containing the regex
 * @returns {Array} Array of empty arrays
 */
function initGroupSlots(groups) {
  const slots = [];
  groups.forEach((g) => slots.push([]));
  return slots;
}

/**
 * Searches for a match between classname and Tailwind CSS group
 *
 * @param {Array} name The target classname
 * @param {Array} arr The flatten array containing the regex
 * @param {String} separator The delimiter to be used between variants
 * @returns {Array} Array of empty arrays
 */
function getGroupIndex(name, arr, separator = ':') {
  const classSuffix = getSuffix(name, separator);
  let idx = arr.findIndex((pattern) => {
    const classRe = new RegExp(`^(${pattern})$`);
    return classRe.test(classSuffix);
  }, classSuffix);
  return idx;
}

/**
 * Get the last part of the full classname
 *
 * @param {String} className The target classname
 * @param {String} separator The delimiter to be used between variants
 * @returns {String} The classname without its variants
 */
function getSuffix(className, separator = ':') {
  const arbitraryArr = className.split('-[');
  if (arbitraryArr.length === 1) {
    return className.split(separator).pop();
  }
  return arbitraryArr[0].split(separator).pop() + '-[' + arbitraryArr[1];
}

module.exports = {
  getGroups,
  initGroupSlots,
  getGroupIndex,
};
