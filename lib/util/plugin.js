/**
 * Remove dot prefix from custom classnames
 *
 * @param {string} className
 * @returns {string}
 */
function removeDotPrefix(className) {
  if (className[0] !== '.') return className;
  return className.slice(1);
}

/**
 * Apply Tailwind CSS classname prefix
 *
 * @param {string} prefix
 * @returns {Function}
 */
function applyPrefix(prefix) {
  return (className) => prefix + className;
}

/**
 * A custom helper function to extract custom utilities
 *
 * @param {Object} utilities
 * @returns {string[]}
 */
function addUtilities(utilities) {
  return Object.keys(utilities);
}

/**
 * Extract custom plugins
 *
 * @param {Object} config
 * @returns {Function}
 */
function extractPlugins(config) {
  // TODO Provide other helper functions from https://tailwindcss.com/docs/plugins
  // - addComponents(), for registering new component styles
  // - addBase(), for registering new base styles
  // - addVariant(), for registering custom variants
  return (plugin) => plugin.handler({ addUtilities, prefix: config.prefix, config });
}

/**
 * Generates an array of classnames from custom plugins
 *
 * @param {Object} config
 * @returns {string[]}
 */
function getCustomPlugins(config) {
  const customPlugins = config.plugins.flatMap(extractPlugins(config)).map(removeDotPrefix);
  if (config.prefix.length) {
    return customPlugins.map(applyPrefix(config.prefix));
  }
  return customPlugins;
}

module.exports = {
  getCustomPlugins,
};
