"use strict";

const resolveConfig = require("tailwindcss/resolveConfig");

function loadConfig(path) {
  console.info("loadConfig");
  console.info("typeof path " + typeof path + " " + path);

  let config;
  try {
    console.debug("config");
    config = require(path);
    console.debug(config);
  } catch (err) {
    config = {};
  } finally {
    return config;
  }
}

function xxx() {
  const mergedConfig = resolveConfig(userConfig);
}

module.exports = {
  loadConfig,
};
