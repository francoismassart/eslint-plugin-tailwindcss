import { Linter } from "@typescript-eslint/utils/ts-eslint";

import { myRule, RULE_NAME as MY_RULE } from "./my-rule.js";

export const rules: Linter.PluginRules = {
  [MY_RULE]: myRule,
};

export const recommendedRulesConfig: Linter.RulesRecord = {
  [MY_RULE]: "error",
};
