/**
 * Escapes a string to be used in a regular expression
 * Copied from https://stackoverflow.com/a/3561711.
 * @param {string} input
 * @returns {string}
 */
function escapeRegex(input) {
  return input.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = {
  escapeRegex,
};
