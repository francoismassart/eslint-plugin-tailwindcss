import { expect, test } from "vitest";

import { compressTailwindArbitrary } from "./compress-tailwind-arbitrary";

test(`Convert raw values to Tailwind CSS arbitrary values`, () => {
  [
    ["4_/_3", "4/3"],
    ["_4/3", "4/3"],
    ["_4/3_", "4/3"],
    [
      "radial-gradient(_circle,#f472b6_0%,#3b82f6_100%",
      "radial-gradient(circle,#f472b6_0%,#3b82f6_100%",
    ],
    ["wiggle__1s", "wiggle_1s"],
  ].map(([input, output]) => {
    expect(compressTailwindArbitrary(input)).toEqual(output);
  });
});
