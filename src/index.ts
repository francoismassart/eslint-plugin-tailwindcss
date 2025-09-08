import type { FlatConfig, Linter } from "@typescript-eslint/utils/ts-eslint";

import packageJson from "../package.json" with { type: "json" };
import { myRule, RULE_NAME as MY_RULE } from "./rules/my-rule";

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
    [MY_RULE]: myRule,
  },
} satisfies FlatConfig.Plugin;

const recommended = {
  [MY_RULE]: "warn",
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
