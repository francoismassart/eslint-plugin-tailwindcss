import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "lib",
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "esnext",
  format: ["esm"],
});
