/**
 * Confirms that attribute value is on a single line
 *
 * @param {string} str The attribute's value
 * @returns {Boolean}
 */
function isSingleLine(str) {
  return str.indexOf("\n") === -1;
}

/**
 * Convert a class[Name] attribute's values to an array of classnames
 *
 * @param {string} attrVal The attribute's value
 * @returns {Boolean}
 */
function getClassNamesFromAttribute(attrVal) {
  let classesArray = null;
  if (isSingleLine(attrVal)) {
    // Fix multiple spaces
    attrVal = attrVal.replace(/\s{2,}/g, " ");
    // Array of unique classNames
    classesArray = attrVal.split(" ");
  } else {
    classesArray = attrVal.split("\n");
  }
  return classesArray;
}

module.exports = {
  isSingleLine,
  getClassNamesFromAttribute,
};
