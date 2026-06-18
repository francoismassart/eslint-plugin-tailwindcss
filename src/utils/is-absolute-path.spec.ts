import { expect, test } from "vitest";

import { isAbsolutePath } from "./is-absolute-path";

test(`isAbsolutePath()`, () => {
  expect(isAbsolutePath(`/Users/francois/config.mjs`)).toBe(true);
  expect(isAbsolutePath(String.raw`C:\Users\francois\config.mjs`)).toBe(true);
  expect(isAbsolutePath(String.raw`\\Server\share\config.mjs`)).toBe(true);
  expect(isAbsolutePath(`./generators/tailwind`)).toBe(false);
  expect(isAbsolutePath(`../eslint.config.mjs`)).toBe(false);
  expect(isAbsolutePath(`src/index.js`)).toBe(false);
});
