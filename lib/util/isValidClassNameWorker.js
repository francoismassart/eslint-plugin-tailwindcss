const { runAsWorker } = require('synckit');
const { resolve } = require('./customConfig');

runAsWorker(async (twConfig, className) => {
  const tailwindUtils = resolve(twConfig);
  if (!tailwindUtils.context) {
    await tailwindUtils.loadConfig(twConfig);
  }
  return tailwindUtils.isValidClassName(className);
});
