const { runAsWorker } = require('synckit');
const { resolve } = require('./customConfig');

runAsWorker(async (twConfig, classNames) => {
  const tailwindUtils = resolve(twConfig);
  if (!tailwindUtils.context) {
    await tailwindUtils.loadConfig(twConfig);
  }
  return tailwindUtils.getSortedClassNames(classNames);
});
