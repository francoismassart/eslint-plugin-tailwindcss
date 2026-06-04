import { createRequire } from "node:module";

import { createSyncFn } from "synckit";

import { type Theme } from "./types";

const require = createRequire(import.meta.url);

// Private methods

const loadThemeWorkerRaw: (cssConfigPath: string) => Theme = createSyncFn(
  require.resolve("./worker/load-theme.mjs"),
);

const getSortedClassNamesWorkerRaw: (
  cssConfigPath: string,
  unorderedClassNames: Array<string>,
) => Array<string> = createSyncFn(
  require.resolve("./worker/get-sorted-class-names.mjs"),
);

const isValidClassNameWorkerRaw: (
  cssConfigPath: string,
  className: string,
) => boolean = createSyncFn(
  require.resolve("./worker/is-valid-class-name.mjs"),
);

const candidatesToCssWorkerRaw: (
  cssConfigPath: string,
  className: string,
) => Array<string | null> = createSyncFn(
  require.resolve("./worker/candidates-to-css.mjs"),
);

const flattenNestingWorkerRaw: (cssRule: string) => Array<string> =
  createSyncFn(require.resolve("./worker/flatten-nesting.mjs"));

// --- Cache Structures ---

const themeCache = new Map<string, Theme>();
const sortedClassNamesCache = new Map<string, Array<string>>();
const validClassNameCache = new Map<string, boolean>();
const candidatesToCssCache = new Map<string, Array<string | null>>();
const flattenNestingCache = new Map<string, Array<string>>();

// --- Exports with Caching Layer ---

export const loadThemeWorker = (cssConfigPath: string): Theme => {
  if (themeCache.has(cssConfigPath)) {
    return themeCache.get(cssConfigPath)!;
  }
  const result = loadThemeWorkerRaw(cssConfigPath);
  themeCache.set(cssConfigPath, result);
  return result;
};

export const getSortedClassNamesWorker = (
  cssConfigPath: string,
  unorderedClassNames: Array<string>,
): Array<string> => {
  // Create a unique key combining the config path and the classes to sort
  const cacheKey = `[${cssConfigPath}]${unorderedClassNames.join(" ")}`;

  if (sortedClassNamesCache.has(cacheKey)) {
    return sortedClassNamesCache.get(cacheKey)!;
  }
  const result = getSortedClassNamesWorkerRaw(
    cssConfigPath,
    unorderedClassNames,
  );
  sortedClassNamesCache.set(cacheKey, result);
  return result;
};

export const isValidClassNameWorker = (
  cssConfigPath: string,
  className: string,
): boolean => {
  const cacheKey = `[${cssConfigPath}]${className}`;

  if (validClassNameCache.has(cacheKey)) {
    return validClassNameCache.get(cacheKey)!;
  }
  const result = isValidClassNameWorkerRaw(cssConfigPath, className);
  validClassNameCache.set(cacheKey, result);
  return result;
};

export const candidatesToCssWorker = (
  cssConfigPath: string,
  className: string,
): Array<string | null> => {
  const cacheKey = `[${cssConfigPath}]${className}`;

  if (candidatesToCssCache.has(cacheKey)) {
    return candidatesToCssCache.get(cacheKey)!;
  }
  const result = candidatesToCssWorkerRaw(cssConfigPath, className);
  candidatesToCssCache.set(cacheKey, result);
  return result;
};

export const flattenNestingWorker = (cssRule: string): Array<string> => {
  if (flattenNestingCache.has(cssRule)) {
    return flattenNestingCache.get(cssRule)!;
  }
  const result = flattenNestingWorkerRaw(cssRule);
  flattenNestingCache.set(cssRule, result);
  return result;
};

/**
 * Allows clearing the caches if necessary
 * (for example, during unit tests to avoid memory effects between specs)
 */
export const clearWorkerCaches = (): void => {
  themeCache.clear();
  sortedClassNamesCache.clear();
  validClassNameCache.clear();
  candidatesToCssCache.clear();
  flattenNestingCache.clear();
};
