import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import baseConfig from "./base";
import eslintRecommendedConfig from "./eslint-recommended-raw";

/**
 * Enables all the tailwindcss rules.
 */
export default (
  plugin: FlatConfig.Plugin,
  parser: FlatConfig.Parser
  // eslint-disable-next-line unicorn/no-anonymous-default-export
): FlatConfig.ConfigArray => [
  baseConfig(plugin, parser),
  eslintRecommendedConfig,
  {
    name: "tailwindcss/all",
    rules: {
      "tailwindcss/classnames-order": "warn",
    },
  },
];
