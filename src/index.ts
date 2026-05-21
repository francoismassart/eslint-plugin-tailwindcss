import type { FlatConfig, Linter } from "@typescript-eslint/utils/ts-eslint";

import packageJson from "../package.json" with { type: "json" };
import {
  classnamesOrder,
  RULE_NAME as CLASSNAMES_ORDER,
} from "./rules/classnames-order";
import {
  enforcesNegativeArbitraryValues,
  RULE_NAME as ENFORCES_NEGATIVE_ARBITRARY_VALUES,
} from "./rules/enforces-negative-arbitrary-values";
import {
  enforcesShorthand,
  RULE_NAME as ENFORCES_SHORTHAND,
} from "./rules/enforces-shorthand";
import {
  noArbitraryValue,
  RULE_NAME as NO_ARBITRARY_VALUE,
} from "./rules/no-arbitrary-value";
import {
  noContradictingClassname,
  RULE_NAME as NO_CONTRADICTING_CLASSNAME,
} from "./rules/no-contradicting-classname";
import {
  noCustomClassname,
  RULE_NAME as NO_CUSTOM_CLASSNAME,
} from "./rules/no-custom-classname";
import {
  noUnnecessaryArbitraryValue,
  RULE_NAME as NO_UNNECESSARY_ARBITRARY_VALUE,
} from "./rules/no-unnecessary-arbitrary-value";

const createConfig = <R extends Linter.RulesRecord>(rules: R) => {
  const result = {} as {
    [K in keyof R as `tailwindcss/${Extract<K, string>}`]: R[K];
  };
  for (const ruleName of Object.keys(rules)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (result as any)[`tailwindcss/${ruleName}`] = rules[ruleName];
  }
  return result;
};

const plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
  },
  configs: {
    get recommended() {
      return sharedConfigs.recommended;
    },
  },
  rules: {
    [CLASSNAMES_ORDER]: classnamesOrder,
    [ENFORCES_NEGATIVE_ARBITRARY_VALUES]: enforcesNegativeArbitraryValues,
    [ENFORCES_SHORTHAND]: enforcesShorthand,
    [NO_ARBITRARY_VALUE]: noArbitraryValue,
    [NO_CUSTOM_CLASSNAME]: noCustomClassname,
    [NO_CONTRADICTING_CLASSNAME]: noContradictingClassname,
    [NO_UNNECESSARY_ARBITRARY_VALUE]: noUnnecessaryArbitraryValue,
  },
} satisfies FlatConfig.Plugin;

const recommended = {
  [CLASSNAMES_ORDER]: "warn",
  [ENFORCES_NEGATIVE_ARBITRARY_VALUES]: "warn",
  [ENFORCES_SHORTHAND]: "warn",
  [NO_ARBITRARY_VALUE]: "off",
  [NO_CUSTOM_CLASSNAME]: "warn",
  [NO_CONTRADICTING_CLASSNAME]: "error",
  [NO_UNNECESSARY_ARBITRARY_VALUE]: "warn",
} as const;

const configBase: FlatConfig.Config = {
  name: "tailwindcss/base",
  plugins: {
    tailwindcss: plugin,
  },
  settings: {
    tailwindcss: {},
  },
  files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};

const sharedConfigs: FlatConfig.SharedConfigs = {
  recommended: {
    ...configBase,
    name: "tailwindcss/recommended",
    rules: createConfig(recommended),
  },
};

export default plugin;
