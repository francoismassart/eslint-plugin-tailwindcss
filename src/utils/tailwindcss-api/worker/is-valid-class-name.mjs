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
    const utils = new TailwindUtils();
    await utils.loadConfigV4(cssConfigPath);
    if (!utils.context) {
      throw new Error(
        `Failed to load the Tailwind CSS theme using: "${cssConfigPath}"`,
      );
    }
    const sorted = await utils.isValidClassName(className);
    return sorted;
  },
);
