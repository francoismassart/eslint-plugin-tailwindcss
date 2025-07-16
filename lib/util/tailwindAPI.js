const { createSyncFn } = require('synckit');

const { resolve } = require('./customConfig');
const getTailwindConfigWorker = createSyncFn(require.resolve('./getTailwindConfigWorker.js'));
const getSortedClassNamesWorker = createSyncFn(require.resolve('./getSortedClassNamesWorker.js'));
const isValidClassNameWorker = createSyncFn(require.resolve('./isValidClassNameWorker.js'));

const getTailwindConfig = (twConfig) => {
  const utils = resolve(twConfig);
  if (utils.isV4) {
    return getTailwindConfigWorker(twConfig);
  }
  if (!utils.context) {
    utils.loadConfigV3(twConfig);
  }
  return utils.context.tailwindConfig;
};

const getSortedClassNames = (twConfig, classNames) => {
  const utils = resolve(twConfig);
  if (utils.isV4) {
    return getSortedClassNamesWorker(twConfig, classNames);
  }
  if (!utils.context) {
    utils.loadConfigV3(twConfig);
  }
  return utils.getSortedClassNames(classNames);
};

const isValidClassName = (twConfig, className) => {
  const utils = resolve(twConfig);
  if (utils.isV4) {
    return isValidClassNameWorker(twConfig, className);
  }
  if (!utils.context) {
    utils.loadConfigV3(twConfig);
  }
  return utils.isValidClassName(className);
};

module.exports = {
  getTailwindConfig,
  getSortedClassNames,
  isValidClassName,
};
