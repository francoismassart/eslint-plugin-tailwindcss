import { expect, test } from "vitest";

import { mapGetKeyFromSetValues } from "./map";

test(`Get the key (Set) from a Map by its value (Set)`, () => {
  const map = new Map<Set<string>, string>([
    [new Set(["a", "b"]), "first"],
    [new Set(["c"]), "second"],
    [new Set(["d", "e"]), "third"],
  ]);

  expect(mapGetKeyFromSetValues(map, new Set(["a", "b"]))).toEqual(
    new Set(["a", "b"]),
  );
  expect(mapGetKeyFromSetValues(map, new Set(["c"]))).toEqual(new Set(["c"]));
  expect(mapGetKeyFromSetValues(map, new Set(["e", "d"]))).toEqual(
    new Set(["d", "e"]),
  );
  expect(mapGetKeyFromSetValues(map, new Set(["x"]))).toBeUndefined();
});
