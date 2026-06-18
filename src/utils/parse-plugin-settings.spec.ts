import { expect, test } from "vitest";

import { parsePluginSettings } from "./parse-plugin-settings";

test(`parsePluginSettings`, () => {
  expect(
    parsePluginSettings({
      tailwindcss: {
        attributes: [],
        cacheMaxAge: 1,
        cacheMaxSize: 2,
        cssConfigPath: "/src/styles.css",
        functions: ["customFunction"],
      },
    }),
  ).toEqual({
    attributes: [],
    cacheMaxAge: 1,
    cacheMaxSize: 2,
    cssConfigPath: "/src/styles.css",
    functions: ["customFunction"],
    ignoredKeys: ["defaultVariants", "compoundVariants"],
  });
});
