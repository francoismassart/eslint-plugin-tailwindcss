import { Linter } from "@typescript-eslint/utils/ts-eslint";

import {
  classnamesOrder,
  RULE_NAME as CLASSNAMES_ORDER,
} from "./classnames-order";
import {
  noCustomClassname,
  RULE_NAME as NO_CUSTOM_CLASSNAME,
} from "./no-custom-classname";

export const rules: Linter.PluginRules = {
  [CLASSNAMES_ORDER]: classnamesOrder,
  [NO_CUSTOM_CLASSNAME]: noCustomClassname,
};

export const recommendedRulesConfig: Linter.RulesRecord = {
  [CLASSNAMES_ORDER]: "error",
  [NO_CUSTOM_CLASSNAME]: "warn",
};
