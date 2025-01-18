/**
 * @fileoverview Test customConfig utilities
 * @author David Hart
 */
"use strict";

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var resolveConfig = require("tailwindcss/resolveConfig");
var customConfig = require("../../../lib/util/customConfig");

describe("resolve", function () {
  it("should work with an object", function () {
    const result = customConfig.resolve({ a: 1, b: 2 });
    assert.deepEqual(result, resolveConfig({ a: 1, b: 2 }));
  });

  describe("with two config files at different paths with the same modification time", function () {
    before(() => {
      fs.writeFileSync("config1.js", "module.exports = { a: 1 }");
      fs.writeFileSync("config2.js", "module.exports = { a: 2 }");
    });

    after(() => {
      fs.unlinkSync("config1.js");
      fs.unlinkSync("config2.js");
    });

    it("should distinguish between the two files", function () {
      const result1 = customConfig.resolve("config1.js");
      assert.deepEqual(result1, resolveConfig({ a: 1 }));
      const result2 = customConfig.resolve("config2.js");
      assert.deepEqual(result2, resolveConfig({ a: 2 }));
    });
  });
});
