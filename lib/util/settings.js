'use strict';
const { resolveDefaultConfigPath } = require('tailwindcss/lib/util/resolveConfigPath')

function getOption(context, name) {
  // Options (defined at rule level)
  const options = context.options[0] || {};
  if (options[name] != undefined) {
    return options[name];
  }
  // Settings (defined at plugin level, shared accross rules)
  if (context.settings && context.settings.tailwindcss && context.settings.tailwindcss[name] != undefined) {
    return context.settings.tailwindcss[name];
  }
  // Fallback to defaults
  switch (name) {
    case 'callees':
      return { classnames: 'key', clsx: 'key', ctl: 'value', cva: 'value', tv: 'value' };
    case 'ignoredKeys':
      return ['compoundVariants', 'defaultVariants'];
    case 'classRegex':
      return '^class(Name)?$';
    case 'config':
      return resolveDefaultConfigPath();
    case 'cssFiles':
      return ['**/*.css', '!**/node_modules', '!**/.*', '!**/dist', '!**/build'];
    case 'cssFilesRefreshRate':
      return 5_000;
    case 'removeDuplicates':
      return true;
    case 'skipClassAttribute':
      return false;
    case 'tags':
      return [];
    case 'whitelist':
      return [];
    case 'declarationRegex':
      return '^(classes|classNames?|.*Styles)$';
    case 'skipClassDeclaration':
      return false;
  }
}

function normalizeCallees(callees) {
  const defaultCallees = getOption({ options: [{}] }, 'callees');
  if (Array.isArray(callees)) {
    return callees.reduce((acc, callee) => {
      if (typeof callee === 'string') {
        acc[callee] = defaultCallees[callee] ?? 'value';
      } else {
        throw new Error(`Invalid callee: ${callee}`);
      }
      return acc;
    }, {});
  }
  Object.keys(callees).forEach((callee) => {
    if (callees[callee] !== 'key' && callees[callee] !== 'value') {
      throw new Error(`Invalid callee: ${callee}`);
    }
  });
  return callees;
}

module.exports = {
  getOption,
  normalizeCallees
};
