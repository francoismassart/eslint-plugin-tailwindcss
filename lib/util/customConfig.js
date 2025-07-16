'use strict';

const { TailwindUtils } = require('tailwind-api-utils');

// for nativewind preset
process.env.TAILWIND_MODE = 'build';

const CHECK_REFRESH_RATE = 10_000;
let lastCheck = new Map();
/**
 * @type {Map<string, TailwindUtils}>}
 */
let mergedConfig = new Map();

function resolve(twConfig) {
  const newConfig = mergedConfig.get(twConfig) === undefined;
  const now = Date.now();
  const expired = now - lastCheck.get(twConfig) > CHECK_REFRESH_RATE;
  if (newConfig || expired) {
    lastCheck.set(twConfig, now);
    const tailwindUtils = new TailwindUtils();
    mergedConfig.set(twConfig, tailwindUtils);
  }
  return mergedConfig.get(twConfig);
}

module.exports = {
  resolve,
};
