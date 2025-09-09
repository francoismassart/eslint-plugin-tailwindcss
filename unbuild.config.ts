import { defineBuildConfig } from "unbuild";

import packageJson from "./package.json" with { type: "json" };

export default defineBuildConfig({
  entries: [
    "./src/index.ts",
    "./src/utils/tailwindcss-api/worker/get-sorted-class-names.ts",
    "./src/utils/tailwindcss-api/worker/is-valid-class-name.ts",
    "./src/utils/tailwindcss-api/worker/load-theme.ts",
  ],
  // rootDir: import.meta.url.split('unbuild.config.ts')[0],
  // @ts-expect-error Property 'dirname' does not exist on type 'ImportMeta'.ts(2339)
  rootDir: import.meta.dirname,
  name: packageJson.name,
  outDir: "./lib",
  declaration: "node16",
  externals: ["@typescript-eslint/utils"],
  clean: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true,
    },
  },
});
