import { expect, test } from "vitest";

import { joiner } from "./joiner";

test(`joiner() with head and tail spaces`, () => {
  const classNames = ["a", "x", "b"];
  const whitespaces = ["\n ", "  ", "   ", "\n    "];
  expect(
    joiner({
      classNames,
      whitespaces,
      headSpace: true,
      tailSpace: true,
    }),
  ).toBe("\n a  x   b\n    ");

  expect(
    joiner({
      classNames,
      whitespaces,
      headSpace: true,
      tailSpace: true,
      validator: (cls) => cls !== "x",
    }),
  ).toBe("\n a   b\n    ");
});

test(`joiner() without head nor tail spaces`, () => {
  const classNames = ["a", "x", "b"];
  const whitespaces = [" ", "  "];
  expect(
    joiner({
      classNames,
      whitespaces,
      headSpace: false,
      tailSpace: false,
    }),
  ).toBe("a x  b");

  expect(
    joiner({
      classNames,
      whitespaces,
      headSpace: false,
      tailSpace: false,
      validator: (cls) => cls !== "x",
    }),
  ).toBe("a  b");
});
