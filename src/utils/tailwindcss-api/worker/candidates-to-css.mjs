/**
 * ⚠️ Make sure to read the warnings about the `*.mjs` workers
 * @see src/utils/tailwindcss-api/worker/README.md
 */

// @ts-check

import { runAsWorker } from "synckit";
import { TailwindUtils } from "tailwind-api-utils";

runAsWorker(
  async (
    /**
     * @type {string} The path to the Tailwind CSS config file
     */
    cssConfigPath,
    /**
     * @type {string} Class name to validate
     */
    className,
  ) => {
    const utils = new TailwindUtils({
      /**
       * `tailwind-api-utils` attempts to load `tailwindcss` via the `local-pkg`
       * package, which will attempt to resolve `tailwindcss` relative to its
       * own `import.meta.url`. In a pnpm monorepo, where direct access to
       * transitive dependencies in workspace packages is forbidden,
       * `TailwindUtils` will fail to find the package if ran at the root
       */
      paths: [import.meta.url],
    });
    await utils.loadConfigV4(cssConfigPath);
    if (!utils.context) {
      throw new Error(
        `Failed to load the Tailwind CSS theme using: "${cssConfigPath}"`,
      );
    }

    const cssRule = await utils.context.candidatesToCss([className]);
    return cssRule;
  },
);
