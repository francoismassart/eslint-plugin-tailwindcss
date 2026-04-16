import { expect, test } from "vitest";

import {
  getBaseClassname,
  getModifiersPrefix,
  passRegexTest,
} from "./classname";

test("getBaseClassname", () => {
  expect(getBaseClassname(`hover:bg-red-500`)).toBe("bg-red-500");
  expect(getBaseClassname(`data-[active:true]:opacity-100`)).toBe(
    "opacity-100",
  );
  expect(getBaseClassname(`bg-[--my-color:#ff0000]`)).toBe(
    "bg-[--my-color:#ff0000]",
  );
  expect(getBaseClassname(`dark:bg-[--my-color:#ff0000]`)).toBe(
    "bg-[--my-color:#ff0000]",
  );
});

test("getModifiersPrefix", () => {
  expect(getModifiersPrefix(`bg-red-500`)).toBe("");
  expect(getModifiersPrefix(`hover:bg-red-500`)).toBe("hover:");
  expect(getModifiersPrefix(`dark:hover:bg-red-500`)).toBe("dark:hover:");
  expect(getModifiersPrefix(`data-[active:true]:opacity-100`)).toBe(
    "data-[active:true]:",
  );
  expect(getModifiersPrefix(`bg-[--my-color:#ff0000]`)).toBe("");
  expect(getModifiersPrefix(`dark:bg-[--my-color:#ff0000]`)).toBe("dark:");
});

test("passRegexTest", () => {
  expect(passRegexTest(`js-[a-z0-9-]+`, `js-custom`)).toBe(true);
  expect(passRegexTest(`js-[a-z0-9-]+`, `custom`)).toBe(false);
  expect(passRegexTest(`(js-[a-z0-9-]+`, `invalid-reg-ex`)).toBe(false);
});
