/**
 * @fileoverview Utility functions for AST
 */

'use strict';

/**
 * Find out if node is `class` or `className`
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isClassAttribute(node) {
  return node.name && /^class(Name)?$/.test(node.name.name);
}

/**
 * Find out if node's value attribute is just simple text
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isLiteralAttributeValue(node) {
  if (node.value && node.value.type === 'Literal') {
    // No support for dynamic or conditional...
    return !/\{|\?|\}/.test(node.value.value);
  }
  return false;
}

/**
 * Find out if the node is a valid candidate for our rules
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isValidJSXAttribute(node) {
  if (!isClassAttribute(node)) {
    // Only run for class[Name] attributes
    return false;
  }
  if (!isLiteralAttributeValue(node)) {
    // No support for dynamic or conditional classnames
    return false;
  }
  return true;
}

module.exports = {
  isClassAttribute,
  isLiteralAttributeValue,
  isValidJSXAttribute,
};
