"use strict";

const { strict: assert } = require("assert");
const cp = require("child_process");
const { glob } = require("fast-glob");
const { writeFile, rm } = require("fs/promises");
const path = require("path");
const semver = require("semver");

const ESLINT = `.${path.sep}node_modules${path.sep}.bin${path.sep}eslint`;

const generateClassName = () => "." + Math.random().toString(16).slice(2);

const randomElement = (arr) => {
  let index = Math.max(0, Math.ceil((arr.length - 1) * Math.random()));

  return arr[index];
};

describe("Performace test of no-custom-classname", () => {
  let originalCwd;

  const FILES_TO_BE_CREATED = 80;

  before(async () => {
    const promises = [];
    const firstClasses = [];
    const files = await glob("./no-custom-classname/src/*", {
      cwd: __dirname,
    });
    await Promise.all(files.map((file) => rm(path.resolve(__dirname, file))));

    for (let i = 0; i < FILES_TO_BE_CREATED; ++i) {
      let file = "";
      for (let j = 0; j < 100; ++j) {
        const curClass = generateClassName();
        file += curClass + "{}\n";
        firstClasses.push(curClass);
      }
      promises.push(writeFile(path.resolve(__dirname, `./no-custom-classname/src/css-${i}.css`), file, "utf-8"));
    }
    for (let i = 0; i < FILES_TO_BE_CREATED; ++i) {
      let file = "";
      for (let j = 0; j < 100; ++j) {
        file += `\
const Component${j} = () => {
  return <div className="mt-4 mb-5 ${randomElement(firstClasses).slice(1)}" />
}\n`;
      }

      promises.push(writeFile(path.resolve(__dirname, `./no-custom-classname/src/component-${i}.jsx`), file, "utf-8"));
    }
    originalCwd = process.cwd();
    process.chdir(path.join(__dirname, "no-custom-classname"));
    cp.execSync("npm i -f", { stdio: "inherit" });

    await Promise.all(promises);
  });
  after(() => {
    process.chdir(originalCwd);
  });

  it("performance large repo", () => {
    if (
      !semver.satisfies(
        process.version,
        require(path.join(__dirname, "no-custom-classname/node_modules/eslint/package.json")).engines.node
      )
    ) {
      return;
    }

    const result = JSON.parse(
      cp.execSync(`${ESLINT} ./src --format=json`, {
        encoding: "utf8",
      })
    );

    assert.strictEqual(result.length, FILES_TO_BE_CREATED);
    const issues = result.reduce((acc, { errorCount }) => acc + errorCount, 0);
    assert.strictEqual(issues, 0);
  });
});
