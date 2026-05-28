import { expect, test } from "vitest";

import { flattenNestingWorker } from "..";

test(`Flatten nested CSS rule`, () => {
  expect(
    flattenNestingWorker(`
    .no-marker {
      &::marker, &::-webkit-details-marker {
        display: none;
      }
    }`),
  ).toEqual([".no-marker::marker", ".no-marker::-webkit-details-marker"]);
});
