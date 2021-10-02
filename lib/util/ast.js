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
 * Find out if node is `class`
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isVueClassAttribute(node) {
  return node.key && /^class$/.test(node.key.name);
}

/**
 * Find out if node's value attribute is just simple text
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isVueLiteralAttributeValue(node) {
  if (node.value && node.value.type === 'VLiteral') {
    return true;
  }
  return false;
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
 * Find out if the node is a valid candidate for our rules
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isValidVueAttribute(node) {
  if (!isVueClassAttribute(node)) {
    // Only run for class attributes
    return false;
  }
  if (!isVueLiteralAttributeValue(node)) {
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
 * @param {Boolean} skipConditional Optional, indicate distinct parsing for conditional nodes
 * @param {Boolean} isolate Optional, set internally to isolate parsing and validation on conditional children
 * @returns {void}
 */
function parseNodeRecursive(node, arg, cb, skipConditional = false, isolate = false) {
  let originalClassNamesValue;
  let classNames;
  if (arg === null) {
    originalClassNamesValue = node.value.value;
    classNames = attrUtil.getClassNamesFromAttribute(originalClassNamesValue, true);
    classNames = removeDuplicatesFromArray(classNames);
    if (classNames.length === 0) {
      // Don't run for empty className
      return;
    }
    cb(classNames, node);
  } else if (arg === undefined) {
    // Ignore invalid child candidates (probably inside complex TemplateLiteral)
    return;
  } else {
    const forceIsolation = skipConditional ? true : isolate;
    let trim = false;
    switch (arg.type) {
      case 'TemplateLiteral':
        arg.expressions.forEach((exp) => {
          parseNodeRecursive(node, exp.right, cb, skipConditional, forceIsolation);
        });
        arg.quasis.forEach((quasis) => {
          parseNodeRecursive(node, quasis, cb, skipConditional, isolate);
        });
        return;
      case 'ConditionalExpression':
        parseNodeRecursive(node, arg.consequent, cb, skipConditional, forceIsolation);
        parseNodeRecursive(node, arg.alternate, cb, skipConditional, forceIsolation);
        return;
      case 'LogicalExpression':
        parseNodeRecursive(node, arg.right, cb, skipConditional, forceIsolation);
        return;
      case 'Literal':
        trim = true;
        originalClassNamesValue = arg.value;
        break;
      case 'TemplateElement':
        originalClassNamesValue = arg.value.raw;
        break;
    }
    classNames = attrUtil.getClassNamesFromAttribute(originalClassNamesValue, trim);
    classNames = removeDuplicatesFromArray(classNames);
    if (classNames.length === 0) {
      // Don't run for empty className
      return;
    }
    const targetNode = isolate ? null : node;
    cb(classNames, targetNode);
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
  const isSingleLine = attrUtil.isSingleLine(raw);
  if (text.indexOf(raw) === -1) {
    return '';
  }
  const suffix = text.split(raw).pop();
  const optionalSpace = isSingleLine && suffix === '${' ? ' ' : '';
  return optionalSpace + suffix;
}

module.exports = {
  isValidJSXAttribute,
  isValidVueAttribute,
  parseNodeRecursive,
  getTemplateElementPrefix,
  getTemplateElementSuffix,
};
