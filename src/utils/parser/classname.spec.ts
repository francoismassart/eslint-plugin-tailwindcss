import { expect, test } from "vitest";

import {
  getBaseClassname,
  getModifiersPrefix,
  passRegexTest,
} from "./classname";

test("getBaseClassname", () => {
  expect(getBaseClassname(`hover:bg-red-500`)).toBe("bg-red-500");
});

test("getModifiersPrefix", () => {
  expect(getModifiersPrefix(`bg-red-500`)).toBe("");
  expect(getModifiersPrefix(`hover:bg-red-500`)).toBe("hover:");
  expect(getModifiersPrefix(`dark:hover:bg-red-500`)).toBe("dark:hover:");
});

test("passRegexTest", () => {
  expect(passRegexTest(`js-[a-z0-9-]+`, `js-custom`)).toBe(true);
  expect(passRegexTest(`js-[a-z0-9-]+`, `custom`)).toBe(false);
  expect(passRegexTest(`(js-[a-z0-9-]+`, `invalid-reg-ex`)).toBe(false);
});
