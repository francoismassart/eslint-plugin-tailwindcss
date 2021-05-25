/**
 * @fileoverview Utility functions for AST
 */

'use strict';

const attrUtil = require('./attr');
const removeDuplicatesFromArray = require('./removeDuplicatesFromArray');

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

/**
 * Inspect and parse an abstract syntax node and run a callback function
 *
 * @param {ASTNode} arg The AST node child argument being checked
 * @param {ASTNode} node The current root node being parsed by eslint
 * @param {Function} cb The callback function
 * @returns {void}
 */

function parseNodeRecursive(node, arg, cb) {
  let originalClassNamesValue;
  let classNames;
  if (arg === null) {
    originalClassNamesValue = node.value.value;
    classNames = attrUtil.getClassNamesFromAttribute(originalClassNamesValue);
    classNames = removeDuplicatesFromArray(classNames);
    if (classNames.length === 0) {
      // Don't run for empty className
      return;
    }
    cb(classNames, node);
  } else {
    switch (arg.type) {
      case 'TemplateLiteral':
        arg.quasis.forEach((quasis) => {
          parseNodeRecursive(node, quasis, cb);
        });
        arg.expressions.forEach((exp) => {
          parseNodeRecursive(node, exp.right, cb);
        });
        return;
      case 'LogicalExpression':
        parseNodeRecursive(node, arg.right, cb);
        return;
      case 'Literal':
        originalClassNamesValue = arg.value;
        break;
      case 'TemplateElement':
        originalClassNamesValue = arg.value.raw;
        break;
    }
    classNames = attrUtil.getClassNamesFromAttribute(originalClassNamesValue);
    classNames = removeDuplicatesFromArray(classNames);
    if (classNames.length === 0) {
      // Don't run for empty className
      return;
    }
    cb(classNames, node);
  }
}

function getTemplateElementPrefix(text, raw) {
  const idx = text.indexOf(raw);
  if (idx === 0) {
    return '';
  }
  return text.split(raw).shift();
}

function getTemplateElementSuffix(text, raw) {
  const idx = text.indexOf(raw);
  if (idx === -1) {
    return '';
  }
  return text.split(raw).pop();
}

module.exports = {
  isValidJSXAttribute,
  parseNodeRecursive,
  getTemplateElementPrefix,
  getTemplateElementSuffix,
};
