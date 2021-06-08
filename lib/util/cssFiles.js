'use strict';

const fg = require('fast-glob');
const fs = require('fs');
const postcss = require('postcss');
const removeDuplicatesFromArray = require('./removeDuplicatesFromArray');

const REFRESH_RATE = 5000;
let previousGlobsResults = [];
let lastUpdate = new Date().getTime() - REFRESH_RATE;
let classnamesFromFiles = [];

/**
 * Read CSS files and extract classnames
 * @param {Array} patterns Glob patterns to locate files
 * @returns {Array} List of classnames
 */
const generateClassnamesListSync = (patterns) => {
  const now = new Date().getTime();
  const files = fg.sync(patterns);
  const newGlobs = previousGlobsResults.flat().join(',') != files.flat().join('');
  const expired = now - lastUpdate > REFRESH_RATE;
  if (newGlobs || expired) {
    previousGlobsResults = files;
    lastUpdate = now;
    let detectedClassnames = [];
    for (const file of files) {
      const data = fs.readFileSync(file, 'utf-8');
      const root = postcss.parse(data);
      root.walkRules((rule) => {
        const regexp = /\.([^\.\,\s\n]*)/gim;
        const matches = [...rule.selector.matchAll(regexp)];
        const classnames = matches.map((arr) => arr[1]);
        detectedClassnames.push(...classnames);
      });
      detectedClassnames = removeDuplicatesFromArray(detectedClassnames);
    }
    classnamesFromFiles = detectedClassnames;
  }
  return classnamesFromFiles;
};

module.exports = generateClassnamesListSync;
