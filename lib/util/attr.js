/**
 * Convert a class[Name] attribute's values to an array of classnames
 *
 * @param {string} attr The attribute's value
 * @returns {Boolean}
 */
function getClassNamesFromAttribute(attr) {
  // Fix multiple spaces
  attr = attr.replace(/\s{2,}/g, ' ');
  // Array of unique classNames
  let classesArray = attr.split(' ');
  return classesArray;
}

module.exports = {
  getClassNamesFromAttribute,
};