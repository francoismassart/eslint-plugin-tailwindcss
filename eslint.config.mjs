import path from "node:path";
import { fileURLToPath } from "node:url";

import pluginJs from "@eslint/js";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { ignores: ["lib/**"] },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPlugin.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "import/first": "error",
      "import/newline-after-import": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
    },
  },
  eslintPluginUnicorn.configs["flat/recommended"],
  {
    rules: {
      // Already covered
      "unicorn/prefer-module": "off",
    },
  },
];
