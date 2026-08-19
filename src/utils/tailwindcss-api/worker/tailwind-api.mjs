/**
 * Persistent Tailwind API worker.
 *
 * A Tailwind design system is expensive to create, so keep one instance per
 * absolute CSS config path and reuse it for every operation in the ESLint
 * process.
 */

// @ts-check

import postcss from "postcss";
import postcssNested from "postcss-nested";
import { runAsWorker } from "synckit";
import { TailwindUtils } from "tailwind-api-utils";

/** @type {Map<string, Promise<TailwindUtils>>} */
const utilsByConfigPath = new Map();

/**
 * @param {string} cssConfigPath
 * @returns {Promise<TailwindUtils>}
 */
const getUtils = (cssConfigPath) => {
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
    const utils = new TailwindUtils({ paths: [import.meta.url] });
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
    rule.walkDecls((declaration) => properties.add(declaration.prop));
  });

  return hasExoticSelector ? undefined : [...properties];
};

runAsWorker(
  async (
    /** @type {"clear" | "sort-class-name-lists" | "is-valid-class-names" | "get-class-properties" | "candidates-to-css" | "flatten-nesting" | "load-theme"} */
    operation,
    /** @type {string | undefined} */
    cssConfigPath,
    /** @type {Array<string> | Array<Array<string>>} */
    values = [],
  ) => {
    if (operation === "clear") {
      utilsByConfigPath.clear();
      return true;
    }

    if (operation === "flatten-nesting") {
      /** @type {Array<string>} */
      const cssRules = values;
      return Promise.all(cssRules.map((cssRule) => flattenNesting(cssRule)));
    }

    if (!cssConfigPath) throw new Error("A CSS config path is required");
    const utils = await getUtils(cssConfigPath);
    const context = utils.context;
    if (!context) throw new Error("Tailwind design system is unavailable");

    switch (operation) {
      case "sort-class-name-lists": {
        /** @type {Array<Array<string>>} */
        const classNameLists = values;
        return classNameLists.map((classNames) =>
          utils.getSortedClassNames(classNames),
        );
      }
      case "is-valid-class-names": {
        /** @type {Array<string>} */
        const classNames = values;
        return utils.isValidClassName(classNames);
      }
      case "candidates-to-css": {
        /** @type {Array<string>} */
        const classNames = values;
        return context.candidatesToCss(classNames);
      }
      case "get-class-properties": {
        /** @type {Array<string>} */
        const classNames = values;
        const cssRules = await context.candidatesToCss(classNames);
        return Promise.all(
          cssRules.map((cssRule) =>
            cssRule ? getProperties(cssRule) : undefined,
          ),
        );
      }
      case "load-theme": {
        return context.theme;
      }
      default: {
        throw new Error(`Unknown Tailwind worker operation: ${operation}`);
      }
    }
  },
);
