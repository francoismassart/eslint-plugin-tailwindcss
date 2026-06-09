import fs from "node:fs";
import path from "node:path";

export const findProjectRoot = (startFolder: string): string | undefined => {
  let currentDirectory = startFolder;
  const targets = [
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",
    "eslint.config.ts",
    "eslint.config.mts",
    "eslint.config.cts",
    "package.json",
  ];
  while (currentDirectory !== path.parse(currentDirectory).root) {
    if (
      targets.some((target) =>
        fs.existsSync(path.join(currentDirectory, target)),
      )
    ) {
      return currentDirectory;
    }
    // Parent folder
    currentDirectory = path.dirname(currentDirectory);
  }
};
