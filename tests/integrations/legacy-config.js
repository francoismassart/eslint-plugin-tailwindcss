"use strict";

const { strict: assert } = require("assert");
const cp = require("child_process");
const path = require("path");
const semver = require("semver");

const ESLINT_BIN_PATH = [".", "node_modules", ".bin", "eslint"].join(path.sep);

describe("Integration with legacy config", () => {
  let originalCwd;

  before(() => {
    originalCwd = process.cwd();
    process.chdir(path.join(__dirname, "legacy-config"));
    cp.execSync("npm i -f", { stdio: "inherit" });
  });
  after(() => {
    process.chdir(originalCwd);
  });

  it("should work with legacy config", () => {
    if (
      !semver.satisfies(
        process.version,
        require(path.join(__dirname, "legacy-config/node_modules/eslint/package.json")).engines.node
      )
    ) {
      return;
    }

    const lintResult = cp.execSync(`${ESLINT_BIN_PATH} a.vue --format=json`, {
      encoding: "utf8",
    });
    const result = JSON.parse(lintResult);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0].messages[0].messageId, "invalidOrder");
  });
});
