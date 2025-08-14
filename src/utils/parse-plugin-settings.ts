// Inspired by https://github.com/vitest-dev/eslint-plugin-vitest/blob/7fb864c28f91a92891c7a4fa025ca9d2a9780d49/src/utils/parse-plugin-settings.ts

import { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { SharedConfigurationSettings } from "@typescript-eslint/utils/ts-eslint";

/**
 * Typing of the shared settings of the eslint-plugin-tailwindcss.
 */
export type PluginSettings = {
  attributes?: Array<string>; // TODO can we use a {Set<string>} instead ?
  cssConfigPath: string;
  functions?: Array<string>; // TODO can we use a {Set<string>} instead ?
};

/**
 * The default values for the shared settings.
 */
export const DEFAULT_SETTINGS: PluginSettings = {
  attributes: [
    // Regular HTML + VDirectiveKey
    "class",
    // React
    "className",
    // Angular
    "ngClass",
    // Tailwind CSS directive
    "@apply",
  ],
  cssConfigPath: "default-path/app.css",
  functions: [
    // @see https://www.npmjs.com/package/classnames
    "classnames",
    // @see https://www.npmjs.com/package/clsx
    "clsx",
    // @see https://www.npmjs.com/package/@netlify/classnames-template-literals
    "ctl",
    // @see https://www.npmjs.com/package/class-variance-authority
    "cva",
    // @see https://www.npmjs.com/package/tailwind-variants
    "tv",
    // Template Literals
    "tw",
  ],
};

// attributes ✅
// cssConfigPath ✅
// functions ✅ (callees + templateliterals)

// tailwindPreserveWhitespace => New rule
// tailwindPreserveDuplicates => New rule

/**
 * The JSON schema for the shared settings to be reused in many of the rule's configuration.
 */
export const sharedSettingsSchema: Record<keyof PluginSettings, JSONSchema4> = {
  attributes: {
    description: "List of attribute names to validate classnames",
    type: "array",
    items: { type: "string", minLength: 0 },
    uniqueItems: true,
    default: DEFAULT_SETTINGS.attributes,
  },
  cssConfigPath: {
    description: "Path to the Tailwind CSS configuration file (*.css)",
    type: "string",
    default: DEFAULT_SETTINGS.cssConfigPath,
  },
  functions: {
    description:
      "List of function names to validate classnames, also used for template literals",
    type: "array",
    items: { type: "string", minLength: 0 },
    uniqueItems: true,
    default: DEFAULT_SETTINGS.functions,
  },
};

/**
 * @description Parses the global eslint settings and merge it with the defaults.
 * @param settings The shared settings from the ESLint configuration.
 * @returns The merged plugin settings.
 */
export function parsePluginSettings(
  settings: SharedConfigurationSettings
): PluginSettings {
  const tailwindcssSettings = (
    typeof settings.tailwindcss !== "object" || settings.tailwindcss === null
      ? {}
      : settings.tailwindcss
  ) as PluginSettings;
  return {
    ...DEFAULT_SETTINGS,
    ...tailwindcssSettings,
  };
}
