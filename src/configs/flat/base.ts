import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

/**
 * A minimal ruleset that sets only the required parser and plugin options needed to run.
 * Only used to extend from an earlier recommended rule.
 */
const baseFlatConfig = (
  plugin: FlatConfig.Plugin,
  parser: FlatConfig.Parser
): FlatConfig.Config => ({
  name: "tailwindcss/base",
  languageOptions: {
    parser,
    sourceType: "module",
  },
  plugins: {
    tailwindcss: plugin,
  },
});
export default baseFlatConfig;
