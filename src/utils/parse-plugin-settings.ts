// Inspired by https://github.com/vitest-dev/eslint-plugin-vitest/blob/7fb864c28f91a92891c7a4fa025ca9d2a9780d49/src/utils/parse-plugin-settings.ts

import { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import type { SharedConfigurationSettings } from "@typescript-eslint/utils/ts-eslint";

/**
 * Typing of the shared settings of the eslint-plugin-tailwindcss.
 */
export type PluginSettings = {
  callees?: Array<string>; // TODO can we use a {Set<string>} instead ?
  cssConfigPath?: string;
  removeDuplicates?: boolean;
  skipClassAttribute?: boolean;
  tags?: Array<string>; // TODO can we use a {Set<string>} instead ?
};

/**
 * The default values for the shared settings.
 */
export const DEFAULTS: PluginSettings = {
  callees: ["ctl"],
  cssConfigPath: "default-path/app.css",
  removeDuplicates: true,
  skipClassAttribute: false,
  tags: ["tw"],
};

/**
 * The JSON schema for the shared settings to be reused in many of the rule's configuration.
 */
export const sharedSettingsSchema: Record<keyof PluginSettings, JSONSchema4> = {
  callees: {
    description: "List of function names to validate classnames",
    type: "array",
    items: { type: "string", minLength: 0 },
    uniqueItems: true,
    default: DEFAULTS.callees,
  },
  cssConfigPath: {
    description: "Path to the Tailwind CSS configuration file (*.css)",
    type: "string",
    default: DEFAULTS.cssConfigPath,
  },
  removeDuplicates: {
    description: "Remove duplicated classnames",
    type: "boolean",
    default: DEFAULTS.removeDuplicates,
  },
  skipClassAttribute: {
    description:
      "If you only want to lint the classnames inside one of the `callees`.",
    type: "boolean",
    default: DEFAULTS.skipClassAttribute,
  },
  tags: {
    description: "List of tags to be detected in template literals",
    type: "array",
    items: { type: "string", minLength: 0 },
    uniqueItems: true,
    default: DEFAULTS.tags,
  },
};

/**
 * @description Parses the global eslint settings and merge.
 * @param settings The shared settings from the ESLint configuration.
 * @returns The parsed plugin settings.
 */
export function parsePluginSettings(
  settings: SharedConfigurationSettings
): PluginSettings {
  const noConfig =
    typeof settings.tailwindcss !== "object" || settings.tailwindcss === null;
  const tailwindcssSettings = (
    noConfig ? {} : settings.tailwindcss
  ) as PluginSettings;

  return {
    ...DEFAULTS,
    ...tailwindcssSettings,
  };
}
