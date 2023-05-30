/**
 * @fileoverview Test groupMethods utilities
 * @author François Massart
 */
"use strict";

var assert = require("assert");
var defaultGroups = require("../../../lib/config/groups").groups;
var customConfig = require("../../../lib/util/customConfig");
var groupUtil = require("../../../lib/util/groupMethods");
var mergedConfig = customConfig.resolve({});

describe("getPrefix", function () {
  it("should retrieve the correct prefix", function () {
    let prefix = "";
    prefix = groupUtil.getPrefix("dark:[hidden]:lg:text-[color:var(--my-var,#ccc)]", ":");
    assert.equal(prefix, "dark:[hidden]:lg:");
    prefix = groupUtil.getPrefix("text-[color:var(--my-var,#ccc)]", ":");
    assert.equal(prefix, "");
  });
});

describe("getSuffix", function () {
  it("should retrieve the correct suffix", function () {
    let prefix = "";
    prefix = groupUtil.getSuffix("dark:[hidden]:lg:text-[color:var(--my-var,#ccc)]", ":");
    assert.equal(prefix, "text-[color:var(--my-var,#ccc)]");
    prefix = groupUtil.getSuffix("text-[color:var(--my-var,#ccc)]", ":");
    assert.equal(prefix, "text-[color:var(--my-var,#ccc)]");
  });
});

describe("parseClassname", function () {
  const targetProperties = {
    Layout: ["Overflow", "Overscroll Behavior", "Top / Right / Bottom / Left"],
    "Flexbox & Grid": ["Gap"],
    Spacing: ["Padding", "Margin"],
    Borders: ["Border Radius", "Border Width", "Border Color"],
    Tables: ["Border Spacing"],
    Transforms: ["Scale"],
  };
  const targetGroups = defaultGroups.filter((g) => Object.keys(targetProperties).includes(g.type));

  it("should have filtered `targetGroups`", function () {
    assert.equal(targetGroups.length, Object.keys(targetProperties).length);
  });

  it(`should parse classnames`, function () {
    let name, actual, expected;
    name = "overflow-x-auto";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 0);
    expected = {
      index: 0,
      name: name,
      variants: "",
      parentType: "Overflow",
      body: "overflow-x-",
      value: "auto",
      shorthand: "x",
      leading: "",
      trailing: "",
      important: false,
    };
    assert.deepEqual(actual, expected);
    name = "md:overflow-y-auto";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 1);
    expected.index = 1;
    expected.name = name;
    expected.body = "overflow-y-";
    expected.shorthand = "y";
    expected.variants = "md:";
    assert.deepEqual(actual, expected);
    name = "lg:dark:overflow-auto";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 2);
    expected.index = 2;
    expected.name = name;
    expected.body = "overflow-";
    expected.shorthand = "all";
    expected.variants = "lg:dark:";
    assert.deepEqual(actual, expected);
    name = "sm:dark:overscroll-x-none";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 3);
    expected.index = 3;
    expected.name = name;
    expected.shorthand = "x";
    expected.variants = "sm:dark:";
    expected.parentType = "Overscroll Behavior";
    expected.body = "overscroll-x-";
    expected.value = "none";
    assert.deepEqual(actual, expected);
    name = "inset-0";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 4);
    expected.index = 4;
    expected.name = name;
    expected.shorthand = "all";
    expected.variants = "";
    expected.parentType = "Top / Right / Bottom / Left";
    expected.body = "inset-";
    expected.value = "0";
    assert.deepEqual(actual, expected);
    name = "sm:-inset-x-1";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 5);
    expected.index = 5;
    expected.name = name;
    expected.shorthand = "x";
    expected.variants = "sm:";
    expected.body = "inset-x-";
    expected.value = "-1";
    assert.deepEqual(actual, expected);
    name = "sm:-inset-x-1";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 6);
    expected.index = 6;
    expected.name = name;
    expected.shorthand = "x";
    expected.variants = "sm:";
    expected.body = "inset-x-";
    expected.value = "-1";
    assert.deepEqual(actual, expected);
    name = "gap-px";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 7);
    expected.index = 7;
    expected.name = name;
    expected.shorthand = "all";
    expected.variants = "";
    expected.parentType = "Gap";
    expected.body = "gap-";
    expected.value = "px";
    assert.deepEqual(actual, expected);
    name = "p-5";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 8);
    expected.index = 8;
    expected.name = name;
    expected.shorthand = "all";
    expected.variants = "";
    expected.parentType = "Padding";
    expected.body = "p-";
    expected.value = "5";
    assert.deepEqual(actual, expected);
    name = "-my-px";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 9);
    expected.index = 9;
    expected.name = name;
    expected.shorthand = "y";
    expected.variants = "";
    expected.parentType = "Margin";
    expected.body = "my-";
    expected.value = "-px";
    assert.deepEqual(actual, expected);

    // "Border Radius"
    name = "rounded-tl-lg";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 13);
    expected.index = 13;
    expected.name = name;
    expected.shorthand = "tl";
    expected.variants = "";
    expected.parentType = "Border Radius";
    expected.body = "rounded-tl-";
    expected.value = "lg";
    assert.deepEqual(actual, expected);

    // "Border Width"
    name = "border-t-4";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 14);
    expected.index = 14;
    expected.name = name;
    expected.shorthand = "t";
    expected.variants = "";
    expected.parentType = "Border Width";
    expected.body = "border-t-";
    expected.value = "4";
    assert.deepEqual(actual, expected);

    // "Border Spacing"
    name = "border-spacing-x-96";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 31);
    expected.index = 31;
    expected.name = name;
    expected.shorthand = "x";
    expected.variants = "";
    expected.parentType = "Border Spacing";
    expected.body = "border-spacing-x-";
    expected.value = "96";
    assert.deepEqual(actual, expected);

    // "Scale"
    name = "scale-x-150";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 16);
    expected.index = 16;
    expected.name = name;
    expected.shorthand = "x";
    expected.variants = "";
    expected.parentType = "Scale";
    expected.body = "scale-x-";
    expected.value = "150";
    assert.deepEqual(actual, expected);

    // Margin arbitrary value
    name = "m-[0]";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 99);
    expected.index = 99;
    expected.name = name;
    expected.shorthand = "all";
    expected.variants = "";
    expected.parentType = "Margin";
    expected.body = "m-";
    expected.value = "[0]";
    assert.deepEqual(actual, expected);

    // Leading / Trailing
    name = "  md:gap-x-2  ";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 100);
    expected.index = 100;
    expected.name = "md:gap-x-2";
    expected.shorthand = "x";
    expected.variants = "md:";
    expected.parentType = "Gap";
    expected.body = "gap-x-";
    expected.value = "2";
    expected.leading = "  ";
    expected.trailing = "  ";
    assert.deepEqual(actual, expected);

    // Important
    name = "md:!p-8";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 1);
    expected.index = 1;
    expected.name = name;
    expected.body = "!p-";
    expected.leading = "";
    expected.trailing = "";
    expected.shorthand = "";
    expected.parentType = "Padding";
    expected.shorthand = "all";
    expected.variants = "md:";
    expected.value = "8";
    expected.important = true;
    assert.deepEqual(actual, expected);
  });

  it("should support named capture group", function () {
    const regex1 = /^((inset\-(?<pos>0|1|2|3)|\-inset\-(?<negPos>0|1|2|3)))$/;
    const str1 = "-inset-0";
    assert.equal(regex1.exec(str1).groups.negPos, "0");
  });
});

describe("getGroupIndex", function () {
  const targetProperties = {
    Backgrounds: [
      "Background Image URL",
      "Background Attachment",
      "Background Clip",
      "Background Color",
      "Deprecated Background Opacity",
      "Background Origin",
      "Background Position",
      "Background Repeat",
      "Background Size",
      "Background Image",
      "Gradient Color Stops",
    ],
  };
  const targetGroups = defaultGroups.filter((g) => Object.keys(targetProperties).includes(g.type));

  it("should have filtered `targetGroups`", function () {
    assert.equal(targetGroups.length, Object.keys(targetProperties).length);
  });

  it(`should parse classnames`, function () {
    let name, actual, expected;
    name = "md:bg-[url('/image-md.jpg')]";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 0);
    expected = {
      index: 0,
      name: name,
      variants: "md:",
      parentType: "Backgrounds",
      body: "bg-[url('/",
      value: "'/image-md.jpg'",
      shorthand: "",
      leading: "",
      trailing: "",
      important: false,
    };
    assert.deepEqual(actual, expected);
  });

  it(`should get correct group index`, function () {
    let name, actual, expected;
    const groups = groupUtil.getGroups(targetGroups, mergedConfig);
    name = "md:bg-[url(some)]";
    actual = groupUtil.getGroupIndex(name, groups, mergedConfig.separator);
    expected = 0;
    assert.equal(actual, expected);
  });
});
