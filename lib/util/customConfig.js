'use strict';

const path = require('path');
const resolveConfig = require('tailwindcss/resolveConfig');

function loadConfig(config) {
  let loadedConfig = null;
  if (typeof config === 'string') {
    const resolved = path.resolve();
    try {
      loadedConfig = require(resolved + '/' + config);
    } catch (err) {
      loadedConfig = {};
    } finally {
      return loadedConfig;
    }
  } else {
    if (typeof config === 'object' && config !== null) {
      return config;
    }
    return {};
  }
}

function resolve(twConfig) {
  const userConfig = loadConfig(twConfig);
  const mergedConfig = resolveConfig(userConfig);
  return mergedConfig;
}

module.exports = {
  resolve,
};
