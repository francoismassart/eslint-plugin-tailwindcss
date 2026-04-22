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

test(`load theme from "normal.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/normal.css");
  const theme = loadThemeWorker(path);
  // We can read CSS vars
  expect(theme.values.get("--color-primary")?.value).toBe("#123456");
  // But no way to determine predefined widths
  // the Tailwind CSS v4 engine will build from discovered classnames usage
  let counter = 0;
  for (const [key, value] of theme.values) {
    if (key.startsWith("--font-")) continue;
    if (key.startsWith("--color-")) continue;
    if (key.startsWith("--spacing-")) continue;
    if (key.startsWith("--breakpoint-")) continue;
    if (key.startsWith("--container-")) continue;
    if (key.startsWith("--text-")) continue;
    if (key.startsWith("--spacing")) continue;
    if (key.startsWith("--tracking-")) continue;
    if (key.startsWith("--animate-")) continue;
    if (key.startsWith("--leading-")) continue;
    if (key.startsWith("--radius-")) continue;
    if (key.startsWith("--shadow-")) continue;
    if (key.startsWith("--inset-")) continue;
    if (key.startsWith("--drop-shadow-")) continue;
    if (key.startsWith("--ease-")) continue;
    if (key.startsWith("--blur-")) continue;
    if (key.startsWith("--perspective-")) continue;
    if (key.startsWith("--aspect-")) continue;
    if (key.startsWith("--default-")) continue;
    if (key.startsWith("--blur")) continue;
    if (key.startsWith("--shadow")) continue;
    if (key.startsWith("--drop-shadow")) continue;
    if (key.startsWith("--radius")) continue;
    if (key.startsWith("--max-width-prose")) continue;
    console.log(key, value);
    counter++;
  }
  expect(counter).toBe(0);
});

// At this moment, no possibility to read the custom dark variant from the config
/*/
test(`load theme from "custom-dark.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/custom-dark.css");
  const theme = loadThemeWorker(path);
  console.log(theme);
});
//*/
