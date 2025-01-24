/**
 * @fileoverview Recommended coniguration for flat style
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 * @author François Massart
 */
'use strict';

import rules from './rules';

const plugin = await import('../index');

export default [
  {
    name: 'tailwindcss:base',
    plugins: {
      get tailwindcss() {
        return plugin;
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    name: 'tailwindcss:rules',
    rules,
  },
];
