import { bench, describe } from "vitest";

import { areSetsEqual } from "./set";

describe("set", () => {
  bench("areSetsEqual", () => {
    areSetsEqual(new Set([1, 2, 3]), new Set([3, 2, 1]));
  });
});
