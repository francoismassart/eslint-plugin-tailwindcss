const { runAsWorker } = require('synckit');
const { resolve } = require('./customConfig');

runAsWorker(async (twConfig) => {
  const tailwindUtils = await resolve(twConfig);
  return tailwindUtils.context.tailwindConfig;
});
