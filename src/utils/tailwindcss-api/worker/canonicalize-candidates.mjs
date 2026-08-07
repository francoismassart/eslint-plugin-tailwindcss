/**
 * ⚠️ Make sure to read the warnings about the `*.mjs` workers
 * @see src/utils/tailwindcss-api/worker/README.md
 */

// @ts-check

import { runAsWorker } from "synckit";
import { TailwindUtils } from "tailwind-api-utils";

/**
 * `tailwind-api-utils` types its `context` with a narrower `DesignSystem` of its own, which
 * does not declare `canonicalizeCandidates`. The object we get is the real one from Tailwind
 * CSS, whose type is only reachable through `__unstable__loadDesignSystem`.
 * @typedef {Awaited<ReturnType<typeof import("tailwindcss").__unstable__loadDesignSystem>>} DesignSystem
 */

/**
 * The first `canonicalizeCandidates` call on a design system lazily builds a signature index
 * over every utility it can generate, which costs ~1.5s and dwarfs the ~25ms config load.
 * Every later call on that same design system is then essentially free, so the design system
 * has to outlive the round trip: synckit keeps this module alive for the whole ESLint run,
 * which turns that build into a one-off instead of a per-call tax.
 * @type {Map<string, Promise<DesignSystem>>}
 */
const designSystemCache = new Map();

/**
 * @param {string} cssConfigPath The path to the Tailwind CSS config file
 * @returns {Promise<DesignSystem>}
 */
const loadDesignSystem = (cssConfigPath) => {
  let designSystem = designSystemCache.get(cssConfigPath);
  if (designSystem) return designSystem;

  // The promise is cached, not its result, so concurrent calls share a single load
  designSystem = (async () => {
    const utils = new TailwindUtils();
    await utils.loadConfigV4(cssConfigPath);
    if (!utils.context) {
      throw new Error(
        `Failed to load the Tailwind CSS theme using: "${cssConfigPath}"`,
      );
    }
    return /** @type {DesignSystem} */ (utils.context);
  })();

  // A rejected load must not be cached, the next call deserves a fresh attempt
  designSystem.catch(() => designSystemCache.delete(cssConfigPath));

  designSystemCache.set(cssConfigPath, designSystem);
  return designSystem;
};

runAsWorker(
  async (
    /**
     * @type {string} The path to the Tailwind CSS config file
     */
    cssConfigPath,
    /**
     * @type {Array<string>} Class names to canonicalize
     */
    classNames,
  ) => {
    const context = await loadDesignSystem(cssConfigPath);

    // `canonicalizeCandidates` was introduced in Tailwind CSS v4.3.0.
    // Older versions matching our `^4.0.0` peer range simply have nothing to suggest.
    if (typeof context.canonicalizeCandidates !== "function") {
      return classNames;
    }

    const canonical = context.canonicalizeCandidates(classNames);
    return classNames.map((className, index) => canonical[index] ?? className);
  },
);
