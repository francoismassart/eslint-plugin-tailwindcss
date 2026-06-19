import { expect, test } from "vitest";

import { parsePluginTailwindcssSettings } from "./parse-plugin-settings";

test(`parsePluginTailwindcssSettings`, () => {
  expect(
    parsePluginTailwindcssSettings({
      tailwindcss: {
        attributes: [],
        cacheMaxAge: 1,
        cacheMaxSize: 2,
        cssConfigPath: "/src/styles.css",
        functions: ["customFunction"],
        parseKeyFunctions: ["customFunction"],
      },
    }),
  ).toEqual({
    attributes: [],
    cacheMaxAge: 1,
    cacheMaxSize: 2,
    cssConfigPath: "/src/styles.css",
    functions: ["customFunction"],
    parseKeyFunctions: ["customFunction"],
    ignoredKeys: ["defaultVariants", "compoundVariants"],
  });
});
