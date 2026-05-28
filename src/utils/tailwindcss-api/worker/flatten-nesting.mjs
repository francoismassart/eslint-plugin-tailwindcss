/**
 * ⚠️ Make sure to read the warnings about the `*.mjs` workers
 * @see src/utils/tailwindcss-api/worker/README.md
 */

// @ts-check

import postcss from "postcss";
import postcssNested from "postcss-nested";
import { runAsWorker } from "synckit";

runAsWorker(
  async (
    /**
     * @type {string} CSS Rule
     */
    cssRule,
  ) => {
    const result = await postcss([postcssNested]).process(cssRule, {
      from: undefined,
    });

    /**
     * @type {string[]}
     */
    const finalSelectors = [];

    result.root.walkRules((rule) => {
      if (rule.nodes.some((node) => node.type === "decl")) {
        finalSelectors.push(...rule.selectors);
      }
    });
    return finalSelectors;
  },
);
