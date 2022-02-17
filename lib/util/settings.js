'use strict';
const defaultGroups = require('../config/groups').groups;

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
      return ['classnames', 'clsx', 'ctl'];
    case 'config':
      return 'tailwind.config.js';
    case 'cssFiles':
      return ['**/*.css', '!**/node_modules', '!**/.*', '!**/dist', '!**/build'];
    case 'groupByResponsive':
      return true;
    case 'groups':
      return defaultGroups;
    case 'officialSorting':
      return false;
    case 'prependCustom':
      return false;
    case 'removeDuplicates':
      return true;
    case 'tags':
      return [];
    case 'whitelist':
      return [];
  }
}

module.exports = getOption;
