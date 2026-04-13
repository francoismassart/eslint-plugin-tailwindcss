import { expect, test } from "vitest";

import { loadThemeWorker } from "..";

test(`load theme from "tiny-prefixed.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/tiny-prefixed.css");
  const theme = loadThemeWorker(path);
  expect(theme.prefix).toBe("tw");
  expect(theme.keyframes.size).toBe(
    ["spin", "ping", "pulse", "bounce"].length * 2,
  );
  expect(theme.values.size).toBe(3);
});

// At this moment, no possibility to read the custom dark variant from the config
/*/
test(`load theme from "custom-dark.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/custom-dark.css");
  const theme = loadThemeWorker(path);
  console.log(theme);
});
//*/
