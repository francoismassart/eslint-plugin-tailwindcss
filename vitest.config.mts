import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.spec.ts"],
    setupFiles: "setup-vitest.js",
    exclude: [...configDefaults.exclude],
  },
});
