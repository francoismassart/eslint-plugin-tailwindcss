import { expect, test } from "vitest";

import { getSortedClassNamesWorker } from "..";

test(`Sort classnames based on "normal.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/normal.css");
  const unorderdClassNames = [
    "lg:flex",
    "block",
    "top-0",
    "unkown",
    "text-red-100",
  ];
  const sorted = getSortedClassNamesWorker(path, unorderdClassNames);
  // Unknown classnames should be first
  expect(sorted[0]).toBe("unkown");
  // The rest should be sorted as well
  expect(sorted).toStrictEqual([
    "unkown",
    "top-0",
    "block",
    "text-red-100",
    "lg:flex",
  ]);
});

test(`Sort "tw:" prefixed classnames based on "tiny-prefixed.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/tiny-prefixed.css");
  const unorderdClassNames = [
    "tw:flex",
    "tw:unkown",
    "tw:hover:text-tiny",
    "tw:top-0",
  ];
  const sorted = getSortedClassNamesWorker(path, unorderdClassNames);
  // Unknown classnames should be first
  expect(sorted[0]).toBe("tw:unkown");
  // The rest should be sorted as well
  expect(sorted).toStrictEqual([
    "tw:unkown",
    "tw:top-0",
    "tw:flex",
    "tw:hover:text-tiny",
  ]);
});
