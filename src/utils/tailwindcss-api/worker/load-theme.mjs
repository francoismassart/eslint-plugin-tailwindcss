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
  ) => {
    const utils = new TailwindUtils();
    await utils.loadConfigV4(cssConfigPath);
    if (!utils.context) {
      throw new Error(
        `Failed to load the Tailwind CSS theme using: "${cssConfigPath}"`,
      );
    }
    // @ts-expect-error Property 'theme' does not exist on type 'DesignSystem'.ts(2339)
    return utils.context?.theme;
  },
);
