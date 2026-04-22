import { expect, test } from "vitest";

import { areSetsEqual } from "./set";

test(`Compare sets for equality`, () => {
  expect(areSetsEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
  expect(areSetsEqual(new Set([1, 2, 3]), new Set([3, 2]))).toBe(false);
  expect(areSetsEqual(new Set([1, 2, 3]), new Set([0, 3, 2]))).toBe(false);
});
