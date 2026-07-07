import { expect, test } from "vitest";

import { compressTailwindArbitrary } from "./compress-tailwind-arbitrary";

test(`Convert raw values to Tailwind CSS arbitrary values`, () => {
  [
    ["4_/_3", "4/3"],
    ["_4/3", "4/3"],
    ["_4/3_", "4/3"],
    ["+1", "1"],
    ["+1px", "1px"],
    ["+2.5px", "2.5px"],
    ["calc( 5px )", "calc(5px)"],
    ["calc(var(--spacing) * 6)", "calc(var(--spacing)*6)"],
    ["var(--radius-7)", "var(--radius-7)"],
    ["var( --radius-8 )", "var(--radius-8)"],
    [
      "radial-gradient(_circle,#f472b6_0%,#3b82f6_100%",
      "radial-gradient(circle,#f472b6_0%,#3b82f6_100%",
    ],
    ["wiggle__1s", "wiggle_1s"],
  ].map(([input, output]) => {
    expect(compressTailwindArbitrary(input)).toEqual(output);
  });
});
