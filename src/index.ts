import * as parserBase from "@typescript-eslint/parser";
import { TSESLint } from "@typescript-eslint/utils";
import { Linter } from "@typescript-eslint/utils/ts-eslint";

import { rules } from "./rules";

export const parser: TSESLint.FlatConfig.Parser = {
  meta: parserBase.meta,
  parseForESLint: parserBase.parseForESLint,
};

const { name, version } =
  // `import`ing here would bypass the TSConfig's `"rootDir": "src"`
  // Also an import statement will make TSC copy the package.json to the dist folder
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../package.json") as {
    name: string;
    version: string;
  };

/**
 * TODO: Add configs (recommended, etc.)
 * @see https://github.com/typescript-eslint/examples/blob/main/packages/eslint-plugin-example-typed-linting/src/index.ts
 * @see eslint-plugin-vitest/src/index.ts
 */

// Plugin not fully initialized yet.
// See https://eslint.org/docs/latest/extend/plugins#configs-in-plugins
const plugin = {
  // `configs`, assigned later
  configs: {},
  rules,
  meta: {
    name,
    version,
  },
} satisfies Linter.Plugin;

export default plugin;
