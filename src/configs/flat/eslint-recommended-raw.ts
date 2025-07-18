import { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

const config: FlatConfig.Config = {
  name: "tailwindcss/eslint-recommended",
  files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
  rules: {
    "tailwindcss/classnames-order": "warn",
  },
};

export = config;
