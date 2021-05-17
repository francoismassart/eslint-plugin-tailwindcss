/**
 * @fileoverview Utilities used for grouping classnames
 */

'use strict';

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
 * Generate the possible options for the RegEx
 *
 * @param {String} propName The name of the prop e.g. textColor
 * @param {Array} keys Keys to be injected in the options
 * @param {Object} config Tailwind CSS Config
 * @param {Boolean} isNegative If the value is negative
 * @returns {String} Generated part of regex exposing the possible values
 */
function generateOptions(propName, keys, config, isNegative = false) {
  const arbitraryOption = '\\[.*\\]';
  const supportArbitrary = config.mode === 'jit' && !isNegative;
  const defaultKeyIndex = keys.findIndex((v) => v === 'DEFAULT');
  if (defaultKeyIndex > -1) {
    keys.splice(defaultKeyIndex, 1);
  }
  switch (propName) {
    case 'placeholderColor':
    case 'textColor':
    case 'backgroundColor':
    case 'gradientColorStops':
    case 'borderColor':
    case 'divideColor':
    case 'ringColor':
    case 'ringOffsetColor':
      const options = [];
      keys.forEach((k) => {
        const color = config.theme.colors[k];
        if (typeof color === 'string') {
          options.push(escapeSpecialChars(k));
        } else {
          const variants = Object.keys(color).map((colorKey) => escapeSpecialChars(colorKey));
          const defaultIndex = variants.findIndex((v) => v === 'DEFAULT');
          const hasDefault = defaultIndex > -1;
          if (hasDefault) {
            variants.splice(defaultIndex, 1);
          }
          options.push(k + '(\\-(' + variants.join('|') + '))' + (hasDefault ? '?' : ''));
        }
      });
      if (supportArbitrary) {
        options.push(arbitraryOption);
      }
      return '(' + options.join('|') + ')';
    default:
      if (supportArbitrary) {
        keys.push(arbitraryOption);
      }
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
    return patched + replaced;
  }
  // e.g. backgroundColor, letterSpacing...
  props.forEach((prop) => {
    const isNegative = prop.substr(0, 1) === '-';
    const patchedProp = isNegative ? prop.substr(1) : prop;
    if (!config.theme || !config.theme[patchedProp]) {
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
    const token = new RegExp('\\$\\{' + prop + '\\}');
    if (keys.length === 0 || replaced.match(token) === null) {
      // empty array
      return;
    }
    replaced = replaced.replace(token, generateOptions(patchedProp, absoluteKeys, config, isNegative));
  });
  return patched + replaced;
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
  return className.split(separator).pop();
}

module.exports = {
  getGroups,
  initGroupSlots,
  getGroupIndex,
};
