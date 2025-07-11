/**
 * ⚠️ This is a worker script which is ran in node's `worker_threads`.
 * 🤓 This means that it is not executed in the main thread, but in a separate thread.
 * 😅 Because of this, expect some disturbances, like:
 *   - `console.log` won't work `vitest`... (seems to work with `jest`).
 *   - You cannot pass complex objects as arguments, only serializable ones.
 *   - You cannot retun complex objects, only serializable ones.
 *   - e.g. You cannot return the `utils.context` directly, but you can return some of its properties...
 *
 * ℹ️ It uses the `*.mjs` extension to indicate that it is an ES module.
 * ✅ We still check the syntax with TypeScript, but it is not a TypeScript file.
 */

// @ts-check

import { runAsWorker } from "synckit";
import { TailwindUtils } from "tailwind-api-utils";

runAsWorker(
  async (
    /**
     * @type {string} The path to the Tailwind CSS config file
     */
    cssConfigPath
  ) => {
    const utils = new TailwindUtils();
    await utils.loadConfigV4(cssConfigPath);
    if (!utils.context) {
      throw new Error(
        `Failed to load the Talwind CSS theme using: "${cssConfigPath}"`
      );
    }
    // @ts-expect-error Property 'theme' does not exist on type 'DesignSystem'.ts(2339)
    return utils.context?.theme;
  }
);
