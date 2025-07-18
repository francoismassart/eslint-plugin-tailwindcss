import { expect, test } from "vitest";

import { isValidClassNameWorker } from "..";

test(`Validate classnames based on "normal.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/normal.css");
  // Unknown classnames should be invalid
  expect(isValidClassNameWorker(path, "unknown")).toBe(false);
  // Known classnames should be valid
  expect(isValidClassNameWorker(path, "flex")).toBe(true);
});

test(`Validate "tw:" prefixed classnames based on "tiny-prefixed.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/tiny-prefixed.css");
  // Unknown classnames should be invalid
  expect(isValidClassNameWorker(path, "tw:unknown")).toBe(false);
  // Known classnames should be valid
  expect(isValidClassNameWorker(path, "tw:flex")).toBe(true);
  expect(isValidClassNameWorker(path, "tw:border-tiny")).toBe(true);
  // Unprefixed classnames should be invalid
  expect(isValidClassNameWorker(path, "flex")).toBe(false);
});
