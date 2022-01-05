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
  return str.replace(/[\-\.\/]/g, '\\$&');
}

/**
 * Generates the opacity suffix based on config
 *
 * @param {Object} config Tailwind CSS Config
 * @returns {String} The suffix or an empty string
 */
function generateOptionalOpacitySuffix(config) {
  const opacityKeys = !config.theme['opacity'] ? [] : Object.keys(config.theme['opacity']);
  opacityKeys.push('\\[(0|1|0?\\.\\d{1,})\\]');
  return `(\\/(${opacityKeys.join('|')}))?`;
}

/**
 * Generate the possible options for the RegEx
 *
 * @param {String} propName The name of the prop e.g. textColor
 * @param {Array} keys Keys to be injected in the options
 * @param {Object} config Tailwind CSS Config
 * @param {Boolean} isNegative If the value is negative
 * @returns {String} Generated part of regex exposing the possible values
 */
function generateOptions(propName, keys, config, isNegative = false) {
  const opacitySuffixes = generateOptionalOpacitySuffix(config);
  const genericArbitraryOption = '\\[(.*)\\]';
  const supportArbitrary = !isNegative;
  const defaultKeyIndex = keys.findIndex((v) => v === 'DEFAULT');
  if (defaultKeyIndex > -1) {
    keys.splice(defaultKeyIndex, 1);
  }
  switch (propName) {
    case 'dark':
      // Optional `dark` class
      return config.darkMode === 'class' ? 'dark' : '';
    case 'arbitraryProperties':
      keys.push(genericArbitraryOption);
      return '(' + keys.join('|') + ')';
    case 'accentColor':
    case 'backgroundColor':
    case 'borderColor':
    case 'boxShadowColor':
    case 'caretColor':
    case 'divideColor':
    case 'fill':
    case 'outlineColor':
    case 'ringColor':
    case 'ringOffsetColor':
    case 'textColor':
    case 'textDecorationColor':
    case 'stroke':
    case 'gradientColorStops':
      // Colors can use segments like 'indigo' and 'indigo-light'
      // https://tailwindcss.com/docs/customizing-colors#color-object-syntax
      const options = [];
      // Conditionnaly generates the opacity suffix
      const opacitySuffix = supportArbitrary ? opacitySuffixes : '';
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
          case 'fill':
            // Forbidden prefixes
            arbitraryColors.push(`(?!(angle|length|list)\:).{1,}`);
            break;
          case 'gradientColorStops':
            arbitraryColors.push(color.RGBAPercentages); // RGBA % 0.5[%]
            arbitraryColors.push(color.optionalColorPrefixedVar);
            arbitraryColors.push(color.notHSLAPlusWildcard);
            break;
          case 'textColor':
            arbitraryColors.push(color.RGBAPercentages); // RGBA % 0.5[%]
            arbitraryColors.push(color.mandatoryColorPrefixed);
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
    case 'outlineWidth':
    case 'outlineOffset':
    case 'ringWidth':
    case 'ringOffsetWidth':
    case 'textUnderlineOffset':
      keys.push(length.selectedUnitsRegEx);
      keys.push(length.anyCalcRegEx);
      // Mandatory `length:` prefix + wildcard
      keys.push(`\\[length\\:.{1,}\\]`);
      return '(' + keys.join('|') + ')';
    case 'strokeWidth':
      keys.push(length.selectedUnitsRegEx);
      keys.push(length.anyCalcRegEx);
      // Mandatory `length:` prefix + calc + wildcard
      keys.push(`\\[length\\:calc\\(.{1,}\\)\\]`);
      // Mandatory `length:` prefix + wildcard + optional units
      keys.push(`\\[length\\:(.{1,})(${length.selectedUnits.join('|')})?\\]`);
      return '(' + keys.join('|') + ')';
    case 'gap':
    case 'height':
    case 'lineHeight':
    case 'maxHeight':
    case 'maxWidth':
    case 'minHeight':
    case 'minWidth':
    case 'padding':
    case 'width':
    case 'blur':
    case 'brightness':
    case 'contrast':
    case 'grayscale':
    case 'invert':
    case 'saturate':
    case 'sepia':
    case 'backdropBlur':
    case 'backdropBrightness':
    case 'backdropContrast':
    case 'backdropGrayscale':
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
    case 'cursor':
      if (supportArbitrary) {
        // All units
        keys.push(length.mergedUnitsRegEx);
        // Forbidden prefixes
        keys.push(`\\[(?!(angle|color|length|list)\:).{1,}\\]`);
      }
      return '(' + keys.join('|') + ')';
    case 'backdropHueRotate':
    case 'hueRotate':
    case 'inset':
    case 'letterSpacing':
    case 'margin':
    case 'scrollMargin':
    case 'skew':
    case 'space':
    case 'textIndent':
    case 'translate':
      if (supportArbitrary) {
        // All units
        keys.push(length.mergedUnitsRegEx);
        // Forbidden prefixes
        keys.push(`\\[(?!(angle|color|length|list)\:).{1,}\\]`);
      }
      return '(' + keys.join('|') + ')';
    case 'opacity':
      // 0 ... .5 ... 1
      keys.push(`\\[(0(\\.\\d{1,})?|\\.\\d{1,}|1)\\]`);
      keys.push(length.anyCalcRegEx);
      // Unprefixed var()
      keys.push(`\\[var\\(\\-\\-[A-Za-z\\-]{1,}\\)\\]`);
      return '(' + keys.join('|') + ')';
    case 'rotate':
      if (supportArbitrary) {
        keys.push(`\\[(${angle.mergedAngleValues.join('|')})\\]`);
      }
      return '(' + keys.join('|') + ')';
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
      // Forbidden prefixes
      keys.push(`\\[(?!(angle|color|length)\:).{1,}\\]`);
      return '(' + keys.join('|') + ')';
    case 'listStyleType':
      // Forbidden prefixes
      keys.push(`\\[(?!(angle|color|length|list)\:).{1,}\\]`);
      return '(' + keys.join('|') + ')';
    case 'objectPosition':
      // Forbidden prefixes
      keys.push(`\\[(?!(angle|color|length)\:).{1,}\\]`);
      return '(' + keys.join('|') + ')';
    case 'backgroundPosition':
    case 'boxShadow':
    case 'dropShadow':
    case 'transitionProperty':
      // Forbidden prefixes
      keys.push(`\\[(?!((angle|color|length|list)\:)|var\\().{1,}\\]`);
      return '(' + keys.join('|') + ')';
    case 'backgroundSize':
      // Forbidden prefixes
      keys.push(`\\[length\:.{1,}\\]`);
      return '(' + keys.join('|') + ')';
    case 'backgroundImage':
      // Forbidden prefixes
      keys.push(`\\[url\\(.{1,}\\)\\]`);
      return '(' + keys.join('|') + ')';
    case 'order':
    case 'zIndex':
      if (supportArbitrary) {
        keys.push(genericArbitraryOption);
      }
      return '(' + keys.join('|') + ')';
    case 'fontWeight':
    case 'typography':
    case 'lineClamp':
      // Cannot be arbitrary?
      return '(' + keys.join('|') + ')';
    case 'aspectRatio':
    case 'flexGrow':
    case 'flexShrink':
    case 'fontFamily':
    case 'flex':
    case 'borderRadius':
    default:
      keys.push(genericArbitraryOption);
      return '(' + keys.join('|') + ')';
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
  let patched = '\\!?';
  // Prefix
  if (config.prefix.length) {
    patched += escapeSpecialChars(config.prefix);
  }
  // Props
  let replaced = re;
  const propsRe = /\$\{(\-?[a-z]*)\}/gi;
  const res = replaced.matchAll(propsRe);
  const resArray = [...res];
  const props = resArray.map((arr) => arr[1]);
  if (props.length === 0) {
    return `${patched}(${replaced})`;
  }
  // e.g. backgroundColor, letterSpacing, -margin...
  props.forEach((prop) => {
    const token = new RegExp('\\$\\{' + prop + '\\}');
    const isNegative = prop.substr(0, 1) === '-';
    const absoluteProp = isNegative ? prop.substr(1) : prop;
    if (prop === 'dark') {
      // Special case, not a default property from the theme
      replaced = replaced.replace(token, generateOptions(absoluteProp, [], config, isNegative));
      return `${patched}(${replaced})`;
    } else if (prop === 'arbitraryProperties') {
      // Special case
      replaced = replaced.replace(
        new RegExp('\\$\\{' + absoluteProp + '\\}'),
        generateOptions(absoluteProp, [], config, isNegative)
      );
      return `${patched}(${replaced})`;
    } else if (!config.theme || !config.theme[absoluteProp]) {
      // prop not found in config
      return;
    }
    // Normal scenario
    const keys = Object.keys(config.theme[absoluteProp])
      .filter((key) => {
        if (isNegative) {
          // Negative prop cannot support NaN values and inherits positive values
          const val = config.theme[absoluteProp][key];
          const isCalc = typeof val === 'string' && val.indexOf('calc') === 0;
          const num = parseFloat(val);
          if (isCalc) {
            return true;
          }
          if (isNaN(num)) {
            return false;
          }
        } else if (key[0] === '-') {
          // Positive prop cannot use key starting with '-'
          return false;
        }
        return true;
      })
      .map((key) => {
        if (isNegative && key[0] === '-') {
          return key.substring(1);
        }
        return key;
      });
    if (keys.length === 0 || replaced.match(token) === null) {
      // empty array
      return;
    }
    const opts = generateOptions(absoluteProp, keys, config, isNegative);
    replaced = replaced.replace(token, opts);
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
          groups.push(subprop.members);
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
  const arbitraryPropertiesRe = new RegExp(
    `^\\!?([a-z]*${escapeSpecialChars(separator)})*(?<value>\\[(.{1,})\\])$`,
    'i'
  );
  let res = arbitraryPropertiesRe.exec(className);
  if (res && res.groups && res.groups.value) {
    // arbitraryProperties detected !
    return res.groups.value;
  }
  const arbitraryArr = className.split('-[');
  if (arbitraryArr.length === 1) {
    return className.split(separator).pop();
  }
  return arbitraryArr[0].split(separator).pop() + '-[' + arbitraryArr[1];
}

module.exports = {
  initGroupSlots,
  getGroups,
  getGroupIndex,
  getSuffix,
};
