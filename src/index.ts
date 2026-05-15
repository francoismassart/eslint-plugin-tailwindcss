import type { FlatConfig, Linter } from "@typescript-eslint/utils/ts-eslint";

import packageJson from "../package.json" with { type: "json" };
import {
  classnamesOrder,
  RULE_NAME as CLASSNAMES_ORDER,
} from "./rules/classnames-order";
import {
  enforcesShorthand,
  RULE_NAME as ENFORCES_SHORTHAND,
} from "./rules/enforces-shorthand";
import {
  noContradictingClassname,
  RULE_NAME as NO_CONTRADICTING_CLASSNAME,
} from "./rules/no-contradicting-classname";
import {
  noCustomClassname,
  RULE_NAME as NO_CUSTOM_CLASSNAME,
} from "./rules/no-custom-classname";

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
    [ENFORCES_SHORTHAND]: enforcesShorthand,
    [NO_CUSTOM_CLASSNAME]: noCustomClassname,
    [NO_CONTRADICTING_CLASSNAME]: noContradictingClassname,
  },
} satisfies FlatConfig.Plugin;

const recommended = {
  [CLASSNAMES_ORDER]: "warn",
  [ENFORCES_SHORTHAND]: "warn",
  [NO_CUSTOM_CLASSNAME]: "warn",
  [NO_CONTRADICTING_CLASSNAME]: "error",
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
