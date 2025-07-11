import { createSyncFn } from "synckit";

import { type Theme } from "./types";

export const loadThemeWorker: (cssConfigPath: string) => Theme = createSyncFn(
  require.resolve("./worker/load-theme.mjs")
);
export const getSortedClassNamesWorker: (
  cssConfigPath: string,
  unorderedClassNames: Array<string>
) => Array<string> = createSyncFn(
  require.resolve("./worker/get-sorted-class-names.mjs")
);
