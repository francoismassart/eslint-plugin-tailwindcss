import { expect, test } from "vitest";

import { groupByModifiersPrefix } from "./groups";

test("groupByModifiersPrefix", () => {
  expect(
    groupByModifiersPrefix([
      `flex`,
      `flex-col`,
      `hover:bg-red-500`,
      `hover:text-black`,
    ]),
  ).toEqual(
    new Map<string, Array<string>>([
      ["", ["flex", "flex-col"]],
      ["hover:", ["bg-red-500", "text-black"]],
    ]),
  );
});
