const { runAsWorker } = require('synckit');
const { resolve } = require('./customConfig');

runAsWorker(async (twConfig, classNames) => {
  const tailwindUtils = await resolve(twConfig);
  return tailwindUtils.getSortedClassNames(classNames);
});
