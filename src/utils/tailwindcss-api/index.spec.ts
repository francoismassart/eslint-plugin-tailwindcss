import { beforeEach, expect, test } from "vitest";

import {
  clearWorkerCaches,
  getClassPropertiesWorker,
  getSortedClassNameListsWorker,
  isValidClassNamesWorker,
} from ".";

const normalPath = require.resolve("../../../tests/stubs/css/normal.css");
const prefixedPath = require.resolve(
  "../../../tests/stubs/css/tiny-prefixed.css",
);

beforeEach(() => clearWorkerCaches());

test("batches class sorting while preserving list and duplicate alignment", () => {
  const lists = [
    ["flex", "absolute", "unknown"],
    ["text-red-100", "block", "top-0"],
    ["flex", "absolute", "unknown"],
  ];
  expect(getSortedClassNameListsWorker(normalPath, "", lists)).toEqual([
    ["unknown", "absolute", "flex"],
    ["top-0", "block", "text-red-100"],
    ["unknown", "absolute", "flex"],
  ]);
});

test("batches validity and isolates caches by CSS configuration", () => {
  expect(
    isValidClassNamesWorker(normalPath, "", ["flex", "unknown", "flex"]),
  ).toEqual([true, false, true]);
  expect(
    isValidClassNamesWorker(prefixedPath, "", ["flex", "tw:flex"]),
  ).toEqual([false, true]);
});

test("returns aligned property sets and excludes invalid or exotic selectors", () => {
  const properties = getClassPropertiesWorker(normalPath, "", [
    "w-10",
    "w-20",
    "unknown",
    "no-marker",
  ]);
  expect(properties[0]).toEqual(new Set(["width"]));
  expect(properties[1]).toEqual(new Set(["width"]));
  expect(properties[2]).toBeUndefined();
  expect(properties[3]).toBeUndefined();
});

test("clearing allows all batched operations to be loaded again", () => {
  expect(isValidClassNamesWorker(normalPath, "", ["flex"])).toEqual([true]);
  clearWorkerCaches();
  expect(isValidClassNamesWorker(normalPath, "", ["flex"])).toEqual([true]);
});
