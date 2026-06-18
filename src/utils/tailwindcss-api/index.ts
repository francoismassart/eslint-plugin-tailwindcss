import { createRequire } from "node:module";
import path from "node:path";

import { createSyncFn } from "synckit";

import { findProjectRoot } from "../find-project-root";
import { isAbsolutePath } from "../is-absolute-path";
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

const convertToAbsolutePath = (
  cssConfigPath: string,
  contextFilename: string,
): string => {
  // Convert to absolute path
  let absolutePath = cssConfigPath;
  if (!isAbsolutePath(cssConfigPath)) {
    const projectRoot = findProjectRoot(contextFilename);
    absolutePath = path.resolve(projectRoot ?? "", cssConfigPath);
  }
  return absolutePath;
};

// --- Exports with Caching Layer ---

export const loadThemeWorker = (
  cssConfigPath: string,
  contextFilename: string,
): Theme => {
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  if (themeCache.has(absolutePath)) {
    return themeCache.get(absolutePath)!;
  }
  const result = loadThemeWorkerRaw(absolutePath);
  themeCache.set(absolutePath, result);
  return result;
};

export const getSortedClassNamesWorker = (
  cssConfigPath: string,
  contextFilename: string,
  unorderedClassNames: Array<string>,
): Array<string> => {
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  const cacheKey = `[${absolutePath}]${unorderedClassNames.join(" ")}`;

  if (sortedClassNamesCache.has(cacheKey)) {
    return sortedClassNamesCache.get(cacheKey)!;
  }
  const result = getSortedClassNamesWorkerRaw(
    absolutePath,
    unorderedClassNames,
  );
  sortedClassNamesCache.set(cacheKey, result);
  return result;
};

export const isValidClassNameWorker = (
  cssConfigPath: string,
  contextFilename: string,
  className: string,
): boolean => {
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  const cacheKey = `[${absolutePath}]${className}`;

  if (validClassNameCache.has(cacheKey)) {
    return validClassNameCache.get(cacheKey)!;
  }
  const result = isValidClassNameWorkerRaw(absolutePath, className);
  validClassNameCache.set(cacheKey, result);
  return result;
};

export const candidatesToCssWorker = (
  cssConfigPath: string,
  contextFilename: string,
  className: string,
): Array<string | null> => {
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  const cacheKey = `[${absolutePath}]${className}`;

  if (candidatesToCssCache.has(cacheKey)) {
    return candidatesToCssCache.get(cacheKey)!;
  }
  const result = candidatesToCssWorkerRaw(absolutePath, className);
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
