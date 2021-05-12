'use strict';

const path = require('path');
const resolveConfig = require('tailwindcss/resolveConfig');

const REFRESH_RATE = 1000;
let previousConfig = null;
let lastUpdate = null;
let mergedConfig = null;

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

function convertConfigToString(config) {
  switch (typeof config) {
    case 'string':
      return config;
    case 'object':
      return JSON.stringify(config);
    default:
      return config.toString();
  }
}

function resolve(twConfig) {
  const now = new Date().getTime();
  const newConfig = convertConfigToString(twConfig) !== convertConfigToString(previousConfig);
  const expired = now - lastUpdate > REFRESH_RATE;
  if (newConfig || expired) {
    previousConfig = twConfig;
    lastUpdate = now;
    const userConfig = loadConfig(twConfig);
    mergedConfig = resolveConfig(userConfig);
  }
  return mergedConfig;
}

module.exports = {
  resolve,
};
