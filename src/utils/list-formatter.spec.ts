import { expect, test } from "vitest";

import { joinListElements } from "./list-formatter";

test(`joinListElements()`, () => {
  expect(joinListElements([`apple`, `banana`, `cherry`])).toBe(
    `apple, banana or cherry`,
  );
  expect(joinListElements([`apple`, `banana`])).toBe(`apple or banana`);
  expect(joinListElements([`apple`, `banana`, `cherry`], `, `, `and`)).toBe(
    `apple, banana and cherry`,
  );
  expect(joinListElements([`apple`, `banana`, `cherry`], ` or `, `or`)).toBe(
    `apple or banana or cherry`,
  );
  expect(joinListElements([`apple`])).toBe(`apple`);
  expect(joinListElements([])).toBe(``);
});
