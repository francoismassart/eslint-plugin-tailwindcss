'use strict';

const { TailwindUtils } = require('tailwind-api-utils');

// for nativewind preset
process.env.TAILWIND_MODE = 'build';

const CHECK_REFRESH_RATE = 1_000;
let lastCheck = null;
/**
 * @type {Map<string, TailwindUtils}>}
 */
let mergedConfig = new Map();

function resolve(twConfig) {
  const newConfig = mergedConfig.get(twConfig) === undefined;
  const now = Date.now();
  const expired = now - lastCheck > CHECK_REFRESH_RATE;
  if (newConfig || expired) {
    lastCheck = now;
    const tailwindUtils = new TailwindUtils();
    tailwindUtils.loadConfig(twConfig);
    mergedConfig.set(twConfig, tailwindUtils);
  }
  return mergedConfig.get(twConfig);
}

module.exports = {
  resolve,
};
