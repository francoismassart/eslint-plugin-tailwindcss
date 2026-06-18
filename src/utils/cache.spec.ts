import { expect, test } from "vitest";

import { getCacheSettings, resetCache } from "./cache";

test(`cache`, () => {
  const emptyConfig = getCacheSettings({ cssConfigPath: "empty.css" });
  expect(emptyConfig).toEqual({ cacheMaxSize: 0, cacheMaxAge: 0 });
});

test(`resetCache`, () => {
  const cacheSettings = { cacheMaxSize: 5, cacheMaxAge: 5000 };
  const expiredCache = new Set([1, 2, 3]);
  resetCache(expiredCache, cacheSettings, Date.now() - 6000);
  expect(expiredCache.size).toBe(0);
  const oversizedCache = new Set([1, 2, 3, 4, 5, 6]);
  resetCache(oversizedCache, cacheSettings, Date.now());
  expect(oversizedCache.size).toBe(0);
});
