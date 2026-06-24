import { expect, test } from "vitest";

import { toTailwindArbitrary } from "./to-tailwind-arbitrary";

test(`Convert raw values to Tailwind CSS arbitrary values`, () => {
  [
    ["4 / 3", "4/3"],
    [" 4 /  3 ", "4/3"],
    [
      `repeat(
        auto-fill,
        minmax(300px, 1fr)
        )`,
      "repeat(auto-fill,minmax(300px,1fr))",
    ],
    ["2 / span 4", "2/span_4"],
    ["repeat(3, 100vh)", "repeat(3,100vh)"],
    ['"Playfair Display", Georgia, serif', '"Playfair_Display",Georgia,serif'],
    ["👉", "👉"],
    [
      `radial-gradient(
        circle,
        #f472b6 0%,
        #3b82f6 100%
      )`,
      "radial-gradient(circle,#f472b6_0%,#3b82f6_100%)",
    ],
    ['url("/images/grid.svg")', 'url("/images/grid.svg")'],
    ["0 35px 35px rgba(0, 0, 0, 0.25)", "0_35px_35px_rgba(0,0,0,0.25)"],
    ["wiggle 1s ease-in-out infinite", "wiggle_1s_ease-in-out_infinite"],
    ["0% 10%", "0%_10%"],
    ["'Hello world!'", "'Hello_world!'"],
  ].map(([input, output]) => {
    expect(toTailwindArbitrary(input)).toEqual(output);
  });
});
