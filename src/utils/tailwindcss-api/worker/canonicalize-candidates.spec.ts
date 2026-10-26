import { expect, test } from "vitest";

import { canonicalizeCandidatesWorker } from "..";

const path = require.resolve("../../../../tests/stubs/css/normal.css");

const canonicalize = (classNames: Array<string>) =>
  canonicalizeCandidatesWorker(path, "", classNames);

test(`Canonicalize classnames based on "normal.css"`, () => {
  const cases: Array<[string, string]> = [
    ["[&>*]:flex-1", "*:flex-1"],
    ["[&_*]:stroke-2", "**:stroke-2"],
    ["[&:nth-child(n+3)]:hidden", "nth-[n+3]:hidden"],
    ["[.dropdown_&]:block", "in-[.dropdown]:block"],
    ["[transform:rotateY(180deg)]", "transform-[rotateY(180deg)]"],
    ["bg-gradient-to-r", "bg-linear-to-r"],
    ["break-words", "wrap-break-word"],
    ["-mt-[0.25em]", "mt-[-0.25em]"],
    ["bg-[var(--anything)]", "bg-(--anything)"],
    // `--color-primary` is declared by "normal.css"
    ["text-[#123456]", "text-primary"],
  ];

  expect(canonicalize(cases.map(([className]) => className))).toEqual(
    cases.map(([, canonical]) => canonical),
  );
});

test(`Leaves canonical and unknown classnames untouched`, () => {
  // `no-marker` is a custom utility declared by "normal.css"
  const classNames = ["flex", "nth-[n+3]:hidden", "no-marker", "not-tailwind"];

  expect(canonicalize(classNames)).toEqual(classNames);
});

test(`Preserves the input order when the batch repeats classnames`, () => {
  expect(canonicalize(["break-words", "flex", "break-words"])).toEqual([
    "wrap-break-word",
    "flex",
    "wrap-break-word",
  ]);
});

test(`Keeps the batch aligned when two classnames share a canonical form`, () => {
  // `hover:-mt-[0.25em]` canonicalizes to `hover:mt-[-0.25em]`, which the
  // compiler collapses into a single result. The output must stay aligned
  // with the input positions regardless (issue #490).
  expect(
    canonicalize(["hover:-mt-[0.25em]", "grid", "hover:mt-[-0.25em]", "md:px-6"]),
  ).toEqual([
    "hover:mt-[-0.25em]",
    "grid",
    "hover:mt-[-0.25em]",
    "md:px-6",
  ]);
});
