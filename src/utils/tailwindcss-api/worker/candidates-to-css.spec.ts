import { expect, test } from "vitest";

import { candidatesToCssWorker } from "..";

test(`Generate CSS rule from classname based on "normal.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/normal.css");
  expect(candidatesToCssWorker(path, "w-10")).toEqual([
    `.w-10 {
  width: calc(var(--spacing) * 10);
}
`,
  ]);
  expect(candidatesToCssWorker(path, "block")).toEqual([
    `.block {
  display: block;
}
`,
  ]);
});

test(`Generate CSS rule from classname based on "tiny-prefixed.css"`, () => {
  const path = require.resolve("../../../../tests/stubs/css/tiny-prefixed.css");
  expect(candidatesToCssWorker(path, "tw:block")).toEqual([
    `.tw\\:block {
  display: block;
}
`,
  ]);
});
