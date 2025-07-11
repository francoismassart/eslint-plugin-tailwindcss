import { createSyncFn } from "synckit";

import { type Theme } from "./types";

export const loadThemeWorker: (twConfigPath: string) => Theme = createSyncFn(
  require.resolve("./worker/load-theme.mjs")
);
