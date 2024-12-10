import { RuleModule } from "@typescript-eslint/utils/ts-eslint";
import { ESLint } from "eslint";

import { rules } from "./rules";

type RuleKey = keyof typeof rules;

interface Plugin extends Omit<ESLint.Plugin, "rules"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules: Record<RuleKey, RuleModule<any, any, any>>;
}

const { name, version } =
  // `import`ing here would bypass the TSConfig's `"rootDir": "src"`
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../package.json") as typeof import("../package.json");

const plugin: Plugin = {
  meta: {
    name,
    version,
  },
  rules,
};

export = plugin;
