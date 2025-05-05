const { createSyncFn } = require('synckit');

const getTailwindConfig = createSyncFn(require.resolve('./getTailwindConfigWorker.js'));
const getSortedClassNames = createSyncFn(require.resolve('./getSortedClassNamesWorker.js'));
const isValidClassName = createSyncFn(require.resolve('./isValidClassNameWorker.js'));

module.exports = {
  getTailwindConfig,
  getSortedClassNames,
  isValidClassName,
};
