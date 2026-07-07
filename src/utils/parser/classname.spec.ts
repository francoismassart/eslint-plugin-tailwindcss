import { expect, test, vi } from "vitest";

import {
  allowsGenericNumbers,
  getBaseClassname,
  getModifiersPrefix,
  hasPxNativePreset,
  passRegexTest,
  supportsSpacing,
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
  // Invalid regex made on purpose to test the function's robustness against it
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  const invalidPattern = `(js-[a-z0-9-]+`;
  const invalidRegExResult = passRegexTest(invalidPattern, `invalid-reg-ex`);
  expect(invalidRegExResult).toBe(false);
  expect(spy).toHaveBeenCalledWith(
    expect.stringContaining(`Invalid regex pattern: ${invalidPattern}`),
    expect.any(SyntaxError),
  );
  spy.mockRestore();
});

test("allowsGenericNumbers", () => {
  expect(allowsGenericNumbers(`m-4`)).toBe(true);
  expect(allowsGenericNumbers(`aspect-16/9`)).toBe(false);
});
test("supportsSpacing", () => {
  for (const classname of [
    `m-4`,
    `p-4`,
    `border-spacing-4`,
    `w-4`,
    `h-4`,
    `inline-4`,
    `block-4`,
    `text-4/5`,
    `leading-4`,
    `inset-4`,
    `top-4`,
    `right-4`,
    `bottom-4`,
    `left-4`,
    `gap-4`,
  ]) {
    expect(supportsSpacing(classname)).toBe(true);
  }
  expect(supportsSpacing(`custom-class`)).toBe(false);
});
test("hasPxNativePreset", () => {
  for (const classname of [
    `inset-4`,
    `top-0`,
    `m-[1px]`,
    `pbe-0`,
    `px-1`,
    `w-[1px]`,
    `size-[1px]`,
  ]) {
    expect(hasPxNativePreset(classname)).toBe(true);
  }
  for (const classname of [`border-4`]) {
    expect(hasPxNativePreset(classname)).toBe(false);
  }
});
