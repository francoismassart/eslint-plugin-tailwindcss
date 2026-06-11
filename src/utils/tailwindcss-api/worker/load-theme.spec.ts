import { expect, test } from "vitest";

import { loadThemeWorker } from "..";

test(`load theme from "tiny-prefixed.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/tiny-prefixed.css");
  const theme = loadThemeWorker(path, "");
  expect(theme.prefix).toBe("tw");
  expect(theme.keyframes.size).toBe(
    ["spin", "ping", "pulse", "bounce"].length * 2,
  );
  expect(theme.values.size).toBe(4);
});

test(`load theme from "normal.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/normal.css");
  const theme = loadThemeWorker(path, "");
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

test(`load theme from "padding.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/padding.css");
  const theme = loadThemeWorker(path, "");
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
  expect(counter).toBe(3);
});

test(`load theme from "all-presets.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/all-presets.css");
  const theme = loadThemeWorker(path, "");
  let counter = 0;
  for (const [key, value] of theme.values) {
    if (key.startsWith("--spacing")) continue;
    // Layout
    if (key.startsWith("--aspect-")) continue;
    if (key.startsWith("--columns-")) continue;
    if (key.startsWith("--container-")) continue;
    if (key.startsWith("--inset-")) continue;
    if (key.startsWith("--z-index-")) continue;
    // Flexbox & Grid
    if (key.startsWith("--order-")) continue;
    if (key.startsWith("--grid-template-columns-")) continue;
    if (key.startsWith("--grid-column-")) continue;
    if (key.startsWith("--grid-template-rows-")) continue;
    if (key.startsWith("--grid-row-start-")) continue;
    if (key.startsWith("--grid-row-end-")) continue;
    if (key.startsWith("--grid-auto-columns-")) continue;
    if (key.startsWith("--grid-auto-rows-")) continue;
    if (key.startsWith("--gap-")) continue;
    // Spacing
    if (key.startsWith("--padding-")) continue;
    if (key.startsWith("--margin-")) continue;
    // Sizing
    if (key.startsWith("--width-")) continue;
    if (key.startsWith("--min-width-")) continue;
    if (key.startsWith("--max-width-")) continue;
    if (key.startsWith("--height-")) continue;
    if (key.startsWith("--min-height-")) continue;
    if (key.startsWith("--max-height-")) continue;
    // Typography
    if (key.startsWith("--font-")) continue;
    if (key.startsWith("--text-")) continue;
    if (key.startsWith("--font-weight-")) continue;
    if (key.startsWith("--font-stretch-")) continue;
    if (key.startsWith("--tracking-")) continue;
    if (key.startsWith("--line-clamp-")) continue;
    if (key.startsWith("--leading-")) continue;
    if (key.startsWith("--list-style-type-")) continue;
    if (key.startsWith("--color-")) continue;
    if (key.startsWith("--text-decoration-color-")) continue;
    if (key.startsWith("--text-decoration-thickness-")) continue;
    if (key.startsWith("--text-underline-offset-")) continue;
    // Backgrounds
    if (key.startsWith("--background-color-")) continue;
    if (key.startsWith("--background-image-")) continue;
    // Borders
    if (key.startsWith("--radius-")) continue;
    if (key.startsWith("--border-width-")) continue;
    if (key.startsWith("--divide-width-")) continue;
    if (key.startsWith("--border-color-")) continue;
    if (key.startsWith("--divide-color-")) continue;
    if (key.startsWith("--outline-width-")) continue;
    if (key.startsWith("--outline-color-")) continue;
    if (key.startsWith("--outline-offset-")) continue;
    // Effects
    if (key.startsWith("--shadow-")) continue;
    if (key.startsWith("--inset-shadow-")) continue;
    if (key.startsWith("--shadow-color-")) continue;
    if (key.startsWith("--text-shadow-")) continue;
    if (key.startsWith("--text-shadow-color-")) continue;
    if (key.startsWith("--opacity-")) continue;
    // Filters
    if (key.startsWith("--blur-")) continue;
    if (key.startsWith("--brightness-")) continue;
    if (key.startsWith("--contrast-")) continue;
    if (key.startsWith("--drop-shadow-")) continue;
    if (key.startsWith("--grayscale-")) continue;
    if (key.startsWith("--hue-rotate-")) continue;
    if (key.startsWith("--invert-")) continue;
    if (key.startsWith("--saturate-")) continue;
    if (key.startsWith("--sepia-")) continue;
    if (key.startsWith("--backdrop-blur-")) continue;
    if (key.startsWith("--backdrop-brightness-")) continue;
    if (key.startsWith("--backdrop-contrast-")) continue;
    if (key.startsWith("--backdrop-grayscale-")) continue;
    if (key.startsWith("--backdrop-hue-rotate-")) continue;
    if (key.startsWith("--backdrop-invert-")) continue;
    if (key.startsWith("--backdrop-opacity-")) continue;
    if (key.startsWith("--backdrop-saturate-")) continue;
    if (key.startsWith("--backdrop-sepia-")) continue;
    // Tables
    if (key.startsWith("--border-spacing-")) continue;
    // Transitions & Animation
    if (key.startsWith("--transition-property-")) continue;
    if (key.startsWith("--transition-duration-")) continue;
    if (key.startsWith("--ease-")) continue;
    if (key.startsWith("--transition-delay-")) continue;
    if (key.startsWith("--animate-")) continue;
    // Transforms
    if (key.startsWith("--perspective-")) continue;
    if (key.startsWith("--perspective-origin-")) continue;
    if (key.startsWith("--rotate-")) continue;
    if (key.startsWith("--scale-")) continue;
    if (key.startsWith("--skew-")) continue;
    if (key.startsWith("--transform-origin-")) continue;
    if (key.startsWith("--translate-")) continue;
    // Interactivity
    if (key.startsWith("--caret-color-")) continue;
    if (key.startsWith("--cursor-")) continue;
    if (key.startsWith("--scroll-margin-")) continue;
    if (key.startsWith("--scroll-padding-")) continue;
    // SVG
    if (key.startsWith("--fill-")) continue;
    if (key.startsWith("--stroke-")) continue;
    if (key.startsWith("--stroke-width-")) continue;
    console.log(key, value);
    counter++;
  }
  expect(counter).toBe(0);
});

// At this moment, no possibility to read the custom dark variant from the config
/*/
test(`load theme from "custom-dark.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/custom-dark.css");
  const theme = loadThemeWorker(path, "");
  console.log(theme);
});
//*/
