/**
 * @fileoverview Utilities used for grouping classnames
 */

"use strict";

/**
 * Escape special chars for regular expressions
 *
 * @param {String} str Regular expression to be escaped
 * @returns {String} Escaped version
 */
function escapeSpecialChars(str) {
  return str.replace(/[\-\.\/]/g, "\\$&");
}

/**
 * Generate the possible options for the RegEx
 *
 * @param {String} propName The name of the prop
 * @param {Array} keys Regular expression to be escaped
 * @returns {String} Escaped version
 */
function generateOptions(propName, keys, config) {
  // theme.spacing
  // TODO /!\ margin, inset, space, translate, zindex can be negative \-?m\-(1|\-2) avoid m--2...
  const defaultKeyIndex = keys.findIndex((v) => v === "DEFAULT");
  if (defaultKeyIndex > -1) {
    keys.splice(defaultKeyIndex, 1);
  }
  switch (propName) {
    case "placeholderColor":
    case "textColor":
    case "backgroundColor":
    case "gradientColorStops":
    case "borderColor":
    case "divideColor":
    case "ringColor":
    case "ringOffsetColor":
      const options = [];
      keys.forEach((k) => {
        const color = config.theme.colors[k];
        if (typeof color === "string") {
          options.push(k);
        } else {
          const variants = Object.keys(color);
          const defaultIndex = variants.findIndex((v) => v === "DEFAULT");
          const hasDefault = defaultIndex > -1;
          if (hasDefault) {
            variants.splice(defaultIndex, 1);
          }
          options.push(
            k + "(\\-(" + variants.join("|") + "))" + (hasDefault ? "?" : "")
          );
        }
      });
      return "(" + options.join("|") + ")";
    default:
      return "(" + keys.join("|") + ")";
  }
}

/**
 * Customize the regex based on config
 *
 * @param {String} re Regular expression
 * @param {Object} config The array of objects containing the regex
 * @returns {String} Patched version with config values
 */
function patchRegex(re, config) {
  let patched = "";
  // Prefix
  if (config.prefix.length) {
    patched += escapeSpecialChars(config.prefix);
  }
  // Props
  let replaced = re;
  const propsRe = /\$\{([a-z]*)\}/gi;
  const props = [...replaced.matchAll(propsRe)].map((arr) => arr[1]);
  if (props.length === 0) {
    return patched + replaced;
  }
  props.forEach((prop) => {
    if (!config.theme || !config.theme[prop]) {
      // prop not found in config
      return;
    }
    const keys = Object.keys(config.theme[prop]);
    const escapedKeys = keys.map((k) => escapeSpecialChars(k));
    const token = new RegExp("\\$\\{" + prop + "\\}");
    if (keys.length === 0 || replaced.match(token) === null) {
      // empty array
      return;
    }
    replaced = replaced.replace(
      token,
      generateOptions(prop, escapedKeys, config)
    );
  });
  return patched + replaced;
}

/**
 * Generates a flatten array from the groups config
 *
 * @param {Array} groupsConfig The array of objects containing the regex
 * @param {Object} twConfig The merged config of Tailwind
 * @returns {Array} Flatten array
 */
function getGroups(groupsConfig, twConfig = null) {
  const groups = [];
  groupsConfig.forEach((group) => {
    // e.g. SIZING or SPACING
    group.members.forEach((prop) => {
      // e.g. Width or Padding
      if (typeof prop.members === "string") {
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
 * @returns {Array} Array of empty arrays
 */
function getGroupIndex(name, arr) {
  const classSuffix = getSuffix(name);
  let idx = arr.findIndex((pattern) => {
    const classRe = new RegExp(`^${pattern}$`);
    return classRe.test(classSuffix);
  }, classSuffix);
  return idx;
}

function getSuffix(className) {
  return className.split(":").pop();
}

module.exports = {
  getGroups,
  patchRegex,
  initGroupSlots,
  getGroupIndex,
};
