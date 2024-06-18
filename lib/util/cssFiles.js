'use strict';

const fg = require('fast-glob');
const fs = require('fs');
const postcss = require('postcss');

let previousGlobsResults = [];
let lastUpdate = null;
let classnamesFromFiles = [];

/**
 * Read CSS files and extract classnames
 * @param {Array} patterns Glob patterns to locate files
 * @param {Number} refreshRate Interval
 * @returns {Array} List of classnames
 */
const generateClassnamesListSync = (patterns, refreshRate = 5_000) => {
  const now = Date.now();
  const isExpired = lastUpdate === null || now - lastUpdate > refreshRate;

  if (!isExpired) {
    // console.log(`generateClassnamesListSync from cache (${classnamesFromFiles.length} classes)`);
    return classnamesFromFiles;
  }

  // console.log('generateClassnamesListSync EXPIRED');
  const files = fg.sync(patterns, { suppressErrors: true, stats: true });
  const hasNewFiles = previousGlobsResults.flat().join(',') != files.flat().join(',');

  if (!hasNewFiles) {
    // No new files from glob patterns
    return classnamesFromFiles;
  }

  // Update classnames from CSS files
  previousGlobsResults = files;
  lastUpdate = now;
  let detectedClassnames = new Set();
  for (const file of files) {
    const data = fs.readFileSync(file.path, 'utf-8');
    const root = postcss.parse(data);
    root.walkRules((rule) => {
      const regexp = /\.([^\.\,\s\n\:\(\)\[\]\'~\+\>\*\\]*)/gim;
      const matches = [...rule.selector.matchAll(regexp)];
      const classnames = matches.map((arr) => arr[1]);
      detectedClassnames = new Set([...detectedClassnames, ...classnames]);
    });
  }
  classnamesFromFiles = [...detectedClassnames];
  return classnamesFromFiles;
};

module.exports = generateClassnamesListSync;
