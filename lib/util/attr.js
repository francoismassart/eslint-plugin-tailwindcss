/**
 * Clean classname from spaces
 *
 * @param {string} str The attribute's value
 * @returns {String}
 */
function cleanClassname(str) {
  return str.replace(/\s{1,}/g, '');
}

/**
 * Confirms that attribute value is on a single line
 *
 * @param {string} str The attribute's value
 * @returns {Boolean}
 */
function isSingleLine(str) {
  let singleLine = true;
  try {
    singleLine = str.indexOf('\n') === -1;
  } catch (err) {
  } finally {
    return singleLine;
  }
}

/**
 * Convert a class[Name] attribute's values to an array of classnames
 *
 * @param {string} attrVal The attribute's value
 * @returns {Array}
 */
function getClassNamesFromAttribute(attrVal) {
  let classNames = [];
  if (attrVal === undefined || attrVal === null || attrVal.length === 0) {
    return classNames;
  }
  if (isSingleLine(attrVal)) {
    // Fix multiple spaces
    attrVal = attrVal.replace(/\s{2,}/g, ' ');
    classNames = attrVal.split(' ');
  } else {
    classNames = attrVal.split('\n');
  }
  return classNames;
}

/**
 * Parse array of classnames, remove multiple spaces and empty strings
 * @param {Array} classNames
 * @returns {Array}
 */
function sanitizeClassnames(classNames) {
  // Remove multiple spaces
  classNames = classNames.map((c) => c.replace(/\s{2,}/g, ' '));
  // Remove empty candidates
  classNames = classNames.map((c) => c.split(' '));
  classNames = classNames.flat();
  classNames = classNames.filter((c) => c.length);
  return classNames;
}

module.exports = {
  cleanClassname,
  isSingleLine,
  getClassNamesFromAttribute,
  sanitizeClassnames,
};
