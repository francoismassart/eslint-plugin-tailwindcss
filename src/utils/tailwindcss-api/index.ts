import { createRequire } from "node:module";
import path from "node:path";

import { createSyncFn } from "synckit";

import { findProjectRoot } from "../find-project-root";
import { isAbsolutePath } from "../is-absolute-path";
import {
  DEFAULT_SETTINGS,
  type PluginSettings,
} from "../parse-plugin-settings";
import { type Theme } from "./types";

const require = createRequire(import.meta.url);

type WorkerOperation =
  | "clear"
  | "sort-class-name-lists"
  | "is-valid-class-names"
  | "get-class-properties"
  | "candidates-to-css"
  | "canonicalize-candidates"
  | "flatten-nesting"
  | "load-theme";

type TailwindWorker = (
  operation: WorkerOperation,
  cssConfigPath?: string,
  values?: Array<string> | Array<Array<string>>,
) => unknown;

const tailwindWorkerRaw = createSyncFn<TailwindWorker>(
  require.resolve("./worker/tailwind-api.mjs"),
);

const absolutePathCache = new Map<string, string>();
const themeCache = new Map<string, Theme>();
const sortedClassNamesCache = new Map<string, Array<string>>();
const validClassNameCache = new Map<string, boolean>();
const classPropertiesCache = new Map<string, Set<string> | undefined>();
const candidatesToCssCache = new Map<string, string | null>();
const canonicalCandidateCache = new Map<string, string>();
const flattenNestingCache = new Map<string, Array<string>>();
let cacheCreationTime = Date.now();

const getCacheKey = (absolutePath: string, value: string) =>
  `${absolutePath}\0${value}`;

const getCacheSize = () =>
  absolutePathCache.size +
  themeCache.size +
  sortedClassNamesCache.size +
  validClassNameCache.size +
  classPropertiesCache.size +
  candidatesToCssCache.size +
  flattenNestingCache.size;

const ensureCacheLimits = (settings?: PluginSettings) => {
  const cacheMaxSize = settings?.cacheMaxSize ?? DEFAULT_SETTINGS.cacheMaxSize!;
  const cacheMaxAge = settings?.cacheMaxAge ?? DEFAULT_SETTINGS.cacheMaxAge!;
  if (
    getCacheSize() > cacheMaxSize ||
    Date.now() - cacheCreationTime > cacheMaxAge
  ) {
    clearWorkerCaches();
  }
};

const convertToAbsolutePath = (
  cssConfigPath: string,
  contextFilename: string,
): string => {
  if (isAbsolutePath(cssConfigPath)) return cssConfigPath;

  const pathCacheKey = `${contextFilename}\0${cssConfigPath}`;
  const cached = absolutePathCache.get(pathCacheKey);
  if (cached) return cached;

  const projectRoot = findProjectRoot(contextFilename);
  const absolutePath = path.resolve(projectRoot ?? "", cssConfigPath);
  absolutePathCache.set(pathCacheKey, absolutePath);
  return absolutePath;
};

export const getSortedClassNameListsWorker = (
  cssConfigPath: string,
  contextFilename: string,
  classNameLists: Array<Array<string>>,
  settings?: PluginSettings,
): Array<Array<string>> => {
  ensureCacheLimits(settings);
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  const missingLists = new Map<string, Array<string>>();
  for (const classNames of classNameLists) {
    const cacheKey = getCacheKey(absolutePath, JSON.stringify(classNames));
    if (!sortedClassNamesCache.has(cacheKey)) {
      missingLists.set(cacheKey, classNames);
    }
  }

  if (missingLists.size > 0) {
    const result = tailwindWorkerRaw("sort-class-name-lists", absolutePath, [
      ...missingLists.values(),
    ]) as Array<Array<string>>;
    let index = 0;
    for (const cacheKey of missingLists.keys()) {
      sortedClassNamesCache.set(cacheKey, result[index]);
      index++;
    }
  }

  return classNameLists.map(
    (classNames) =>
      sortedClassNamesCache.get(
        getCacheKey(absolutePath, JSON.stringify(classNames)),
      )!,
  );
};

export const loadThemeWorker = (
  cssConfigPath: string,
  contextFilename: string,
  settings?: PluginSettings,
): Theme => {
  ensureCacheLimits(settings);
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  const cached = themeCache.get(absolutePath);
  if (cached) return cached;

  const result = tailwindWorkerRaw("load-theme", absolutePath) as Theme;
  themeCache.set(absolutePath, result);
  return result;
};

export const getSortedClassNamesWorker = (
  cssConfigPath: string,
  contextFilename: string,
  unorderedClassNames: Array<string>,
  settings?: PluginSettings,
): Array<string> => {
  return getSortedClassNameListsWorker(
    cssConfigPath,
    contextFilename,
    [unorderedClassNames],
    settings,
  )[0];
};

export const isValidClassNamesWorker = (
  cssConfigPath: string,
  contextFilename: string,
  classNames: Array<string>,
  settings?: PluginSettings,
): Array<boolean> => {
  ensureCacheLimits(settings);
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  const missingClassNames = [
    ...new Set(
      classNames.filter(
        (className) =>
          !validClassNameCache.has(getCacheKey(absolutePath, className)),
      ),
    ),
  ];
  if (missingClassNames.length > 0) {
    const result = tailwindWorkerRaw(
      "is-valid-class-names",
      absolutePath,
      missingClassNames,
    ) as Array<boolean>;
    for (const [index, className] of missingClassNames.entries()) {
      validClassNameCache.set(
        getCacheKey(absolutePath, className),
        result[index],
      );
    }
  }
  return classNames.map(
    (className) =>
      validClassNameCache.get(getCacheKey(absolutePath, className))!,
  );
};

export const isValidClassNameWorker = (
  cssConfigPath: string,
  contextFilename: string,
  className: string,
  settings?: PluginSettings,
): boolean =>
  isValidClassNamesWorker(
    cssConfigPath,
    contextFilename,
    [className],
    settings,
  )[0];

export const getClassPropertiesWorker = (
  cssConfigPath: string,
  contextFilename: string,
  classNames: Array<string>,
  settings?: PluginSettings,
): Array<Set<string> | undefined> => {
  ensureCacheLimits(settings);
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  const missingClassNames = [
    ...new Set(
      classNames.filter(
        (className) =>
          !classPropertiesCache.has(getCacheKey(absolutePath, className)),
      ),
    ),
  ];

  if (missingClassNames.length > 0) {
    const result = tailwindWorkerRaw(
      "get-class-properties",
      absolutePath,
      missingClassNames,
    ) as Array<Array<string> | undefined>;
    for (const [index, className] of missingClassNames.entries()) {
      const properties = result[index];
      classPropertiesCache.set(
        getCacheKey(absolutePath, className),
        properties === undefined ? undefined : new Set(properties),
      );
    }
  }

  return classNames.map((className) =>
    classPropertiesCache.get(getCacheKey(absolutePath, className)),
  );
};

export const candidatesToCssWorker = (
  cssConfigPath: string,
  contextFilename: string,
  className: string,
  settings?: PluginSettings,
): Array<string | null> => {
  ensureCacheLimits(settings);
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  const cacheKey = getCacheKey(absolutePath, className);
  if (!candidatesToCssCache.has(cacheKey)) {
    const [result] = tailwindWorkerRaw("candidates-to-css", absolutePath, [
      className,
    ]) as Array<string | null>;
    candidatesToCssCache.set(cacheKey, result);
  }
  return [candidatesToCssCache.get(cacheKey) as string | null];
};

/**
 * Only the classnames which are still unknown are sent over, as a single batch,
 * so a node costs at most one round trip no matter how many classnames it holds.
 */
export const canonicalizeCandidatesWorker = (
  cssConfigPath: string,
  contextFilename: string,
  classNames: Array<string>,
): Array<string> => {
  const absolutePath = convertToAbsolutePath(cssConfigPath, contextFilename);
  const cacheKeyOf = (className: string) => `[${absolutePath}]${className}`;

  const missing = [
    ...new Set(
      classNames.filter(
        (className) => !canonicalCandidateCache.has(cacheKeyOf(className)),
      ),
    ),
  ];

  if (missing.length > 0) {
    const resolved = tailwindWorkerRaw(
      "canonicalize-candidates",
      absolutePath,
      missing,
    ) as Array<Array<string>>;
    for (const [index, className] of missing.entries()) {
      canonicalCandidateCache.set(
        cacheKeyOf(className),
        resolved[index] ?? className,
      );
    }
  }

  return classNames.map(
    (className) => canonicalCandidateCache.get(cacheKeyOf(className))!,
  );
};

export const flattenNestingWorker = (
  cssRule: string,
  settings?: PluginSettings,
): Array<string> => {
  ensureCacheLimits(settings);
  const cached = flattenNestingCache.get(cssRule);
  if (cached) return cached;
  const [result] = tailwindWorkerRaw("flatten-nesting", undefined, [
    cssRule,
  ]) as Array<Array<string>>;
  flattenNestingCache.set(cssRule, result);
  return result;
};

export const clearWorkerCaches = (): void => {
  absolutePathCache.clear();
  themeCache.clear();
  sortedClassNamesCache.clear();
  validClassNameCache.clear();
  classPropertiesCache.clear();
  candidatesToCssCache.clear();
  canonicalCandidateCache.clear();
  flattenNestingCache.clear();
  tailwindWorkerRaw("clear");
  cacheCreationTime = Date.now();
};
