import { expect, test } from "vitest";

import { loadThemeWorker } from "..";

test(`load theme from "tiny.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/tiny.css");
  const theme = loadThemeWorker(path);
  expect(theme.prefix).toBe("tw");
  expect(theme.keyframes.size).toBe(
    ["spin", "ping", "pulse", "bounce"].length * 2
  );
  console.log("Theme values:", theme.values);
  expect(theme.values.size).toBe(3);
});
