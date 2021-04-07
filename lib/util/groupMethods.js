/**
 * @fileoverview Utilities used for grouping classnames
 */

"use strict";

/**
 * Generates a flatten array from the groups config
 *
 * @param {Array} config The array of objects containing the regex
 * @returns {Array} Flatten array
 */
function getGroups(config) {
  const groups = [];
  config.forEach((group) => {
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
  return groups;
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
  initGroupSlots,
  getGroupIndex,
};
