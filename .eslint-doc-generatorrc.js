/* eslint-disable unicorn/prevent-abbreviations */
import prettier from "prettier";

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  // configEmoji: [['recommended', '✅']],
  ignoreConfig: ["legacy-all", "legacy-recommended"],
  postprocess: async (content, path) =>
    prettier.format(content, {
      ...(await prettier.resolveConfig(path)),
      parser: "markdown",
    }),
  ruleDocTitleFormat: "desc",
  ruleListColumns: [
    "name",
    "description",
    "configsError",
    "configsWarn",
    "fixable",
    "hasSuggestions",
    "requiresTypeChecking",
  ],
};

export default config;
