import { expect, test } from "vitest";

import { convertStringValueToPx } from "./units";

test(`Convert string values to pixels`, () => {
  (
    [
      ["1", undefined],
      ["2px", 2],
      ["2rem", 32],
      ["+2rem", 32],
      ["-2rem", -32],
      ["-.5rem", -8],
      ["-1.px", -1],
    ] as Array<[string, number | undefined]>
  ).map(([input, output]) => {
    expect(convertStringValueToPx(input)).toEqual(output as number);
  });
});
