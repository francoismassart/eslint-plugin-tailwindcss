import { expect, test } from "vitest";

import { segment } from "./segment";

test(`segment()`, () => {
  expect(segment(`hover:bg-red-500`, ":")).toEqual([`hover`, `bg-red-500`]);
  expect(segment(`after:content-['a:b']`, ":")).toEqual([
    `after`,
    `content-['a:b']`,
  ]);
  expect(segment(`content-['foo:bar']`, ":")).toEqual([`content-['foo:bar']`]);
});
