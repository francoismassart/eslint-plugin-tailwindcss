import type { Linter } from "@typescript-eslint/utils/ts-eslint";

import { myRule, RULE_NAME as MY_RULE } from "./my-rule";

export const rules: Linter.PluginRules = {
  [MY_RULE]: myRule,
};

export const recommendedRulesConfig: Linter.RulesRecord = {
  [MY_RULE]: "error",
};
