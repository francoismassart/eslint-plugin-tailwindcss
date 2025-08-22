import {
  classnamesOrder,
  RULE_NAME as CLASSNAMES_ORDER,
} from "./classnames-order";
import {
  noCustomClassname,
  RULE_NAME as NO_CUSTOM_CLASSNAME,
} from "./no-custom-classname";

export const rules = {
  [CLASSNAMES_ORDER]: classnamesOrder,
  [NO_CUSTOM_CLASSNAME]: noCustomClassname,
};
