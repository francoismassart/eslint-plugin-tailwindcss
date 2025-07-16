const { runAsWorker } = require('synckit');
const { resolve } = require('./customConfig');

runAsWorker(async (twConfig) => {
  const tailwindUtils = resolve(twConfig);
  if (!tailwindUtils.context) {
    await tailwindUtils.loadConfig(twConfig);
  }
  return tailwindUtils.context.tailwindConfig;
});
