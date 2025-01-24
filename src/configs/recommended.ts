/**
 * @fileoverview Recommended coniguration for legacy style
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @author François Massart
 */
'use strict';

import rules from './rules';

export default {
  plugins: ['tailwindcss'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules,
};
