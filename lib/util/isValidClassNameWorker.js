const { runAsWorker } = require('synckit');
const { resolve } = require('./customConfig');

runAsWorker(async (twConfig, className) => {
  const tailwindUtils = await resolve(twConfig);
  return tailwindUtils.isValidClassName(className);
});
