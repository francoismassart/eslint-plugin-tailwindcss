/**
 * Persistent Tailwind API worker.
 *
 * A Tailwind CSS design system is expensive to create, so keep one instance per
 * absolute CSS config path and reuse it for every operation in the ESLint
 * process.
 */

// @ts-check

import postcss from "postcss";
import postcssNested from "postcss-nested";
import { runAsWorker } from "synckit";
import { TailwindUtils } from "tailwind-api-utils";

/**
 * @param {Array<string> | Array<Array<string>>} array
 * @returns {Array<string>}
 */
const asArrayOfString = (array) => {
  if (array.length === 0) return [];
  // @ts-expect-error Type 'string[][]' is not assignable to type 'string[]'
  return typeof array[0] === "string" ? array : [];
};

/**
 * @param {Array<string> | Array<Array<string>>} array
 * @returns {Array<Array<string>>}
 */
const asArrayOfArrayOfString = (array) => {
  if (array.length === 0) return [];
  // @ts-expect-error Type 'string[][]' is not assignable to type 'string[]'
  return Array.isArray(array[0]) ? array : [];
};

/** @type {Map<string, Promise<TailwindUtils>>} */
const utilsByConfigPath = new Map();

/**
 * @param {string} cssConfigPath
 * @param {{ useLocalPkgWorkaround?: boolean }} [options]
 * @returns {Promise<TailwindUtils>}
 */
const getUtils = (cssConfigPath, options) => {
  const cached = utilsByConfigPath.get(cssConfigPath);
  if (cached) return cached;

  const loading = (async () => {
    /**
     * `tailwind-api-utils` attempts to load `tailwindcss` via the `local-pkg`
     * package, which will attempt to resolve `tailwindcss` relative to its
     * own `import.meta.url`. In a pnpm monorepo, where direct access to
     * transitive dependencies in workspace packages is forbidden,
     * `TailwindUtils` will fail to find the package if ran at the root
     */
    const utilsOptions = options?.useLocalPkgWorkaround
      ? { paths: [import.meta.url] }
      : undefined;
    const utils = new TailwindUtils(utilsOptions);
    await utils.loadConfigV4(cssConfigPath);
    if (!utils.context) {
      throw new Error(
        `Failed to load the Tailwind CSS theme using: "${cssConfigPath}"`,
      );
    }
    return utils;
  })();

  utilsByConfigPath.set(cssConfigPath, loading);
  loading.catch(() => utilsByConfigPath.delete(cssConfigPath));
  return loading;
};

/**
 * @param {string} cssRule
 * @returns {Promise<Array<string>>}
 */
const flattenNesting = async (cssRule) => {
  const result = await postcss([postcssNested]).process(cssRule, {
    from: undefined,
  });
  /** @type {Array<string>} */
  const selectors = [];
  result.root.walkRules((rule) => {
    if (rule.nodes.some((node) => node.type === "decl")) {
      selectors.push(...rule.selectors);
    }
  });
  return selectors;
};

/**
 * @param {string} cssRule
 * @returns {Promise<Array<string> | undefined>}
 */
const getProperties = async (cssRule) => {
  const result = await postcss([postcssNested]).process(cssRule, {
    from: undefined,
  });
  /** @type {Set<string>} */
  const properties = new Set();
  let hasExoticSelector = false;

  result.root.walkRules((rule) => {
    if (!rule.nodes.some((node) => node.type === "decl")) return;
    if (
      rule.selectors.some(
        (selector) => selector.includes("::") || selector.includes(" "),
      )
    ) {
      hasExoticSelector = true;
    }
    rule.walkDecls((declaration) => {
      if (declaration.prop) {
        properties.add(`${declaration.prop}`);
      }
    });
  });

  return hasExoticSelector ? undefined : [...properties];
};

runAsWorker(
  async (
    /** @type {"clear" | "sort-class-name-lists" | "is-valid-class-names" | "get-class-properties" | "candidates-to-css" | "canonicalize-candidates" | "flatten-nesting" | "load-theme"} */
    operation,
    /** @type {string | undefined} */
    cssConfigPath,
    /** @type {Array<string> | Array<Array<string>>} */
    values = [],
    /** @type {{ useLocalPkgWorkaround?: boolean }} */
    options = {},
  ) => {
    if (operation === "clear") {
      utilsByConfigPath.clear();
      return true;
    }

    if (operation === "flatten-nesting") {
      const cssRules = asArrayOfString(values);
      return Promise.all(cssRules.map((cssRule) => flattenNesting(cssRule)));
    }

    if (!cssConfigPath) throw new Error("A CSS config path is required");
    const utils = await getUtils(cssConfigPath, options);
    const context = utils.context;
    if (!context) throw new Error("Tailwind design system is unavailable");

    switch (operation) {
      case "sort-class-name-lists": {
        const classNameLists = asArrayOfArrayOfString(values);
        return classNameLists.map((classNames) =>
          utils.getSortedClassNames(classNames),
        );
      }
      case "is-valid-class-names": {
        const classNames = asArrayOfString(values);
        return utils.isValidClassName(classNames);
      }
      case "candidates-to-css": {
        const classNames = asArrayOfString(values);
        return context.candidatesToCss(classNames);
      }
      case "canonicalize-candidates": {
        // `canonicalizeCandidates` was introduced in Tailwind CSS v4.3.0.
        // Older versions matching our `^4.0.0` peer range simply have nothing to suggest.
        // @ts-expect-error `canonicalizeCandidates` is not declared in the type definitions
        if (typeof context.canonicalizeCandidates !== "function") {
          // Unsupported versions of Tailwind CSS
          return values;
        }
        /** @type {Array<string>} */
        const classNames = asArrayOfString(values);
        // @ts-expect-error `canonicalizeCandidates` is not declared in the type definitions
        const canonicals = context.canonicalizeCandidates(classNames);
        return classNames.map(
          // Replace the original class name with the canonical
          (className, index) => canonicals[index] ?? className,
        );
      }
      case "get-class-properties": {
        const classNames = asArrayOfString(values);
        const cssRules = await context.candidatesToCss(classNames);
        return Promise.all(
          cssRules.map((cssRule) =>
            cssRule ? getProperties(cssRule) : undefined,
          ),
        );
      }
      case "load-theme": {
        // @ts-expect-error `theme` is not declared in the type definitions
        return context.theme;
      }
      default: {
        throw new Error(`Unknown Tailwind worker operation: ${operation}`);
      }
    }
  },
);
