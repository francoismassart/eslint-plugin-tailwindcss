'use strict';

const fg = require('fast-glob');
const fs = require('fs');
const postcss = require('postcss');

const classRegexp = /\.([^\.\,\s\n\:\(\)\[\]\'~\+\>\*\\]*)/gim;

let lastUpdate = null;
let classnamesFromFiles = [];

/**
 * @type {Map<string, number}
 */
const prevEditedTimestamp = new Map()

/**
 * Read CSS files and extract classnames
 * @param {Array} patterns Glob patterns to locate files
 * @param {Number} refreshRate Interval
 * @returns {Array} List of classnames
 */
const generateClassnamesListSync = (patterns, refreshRate = 5_000) => {
  const now = new Date().getTime();
  const expired = lastUpdate === null || now - lastUpdate > refreshRate;

  if (!expired) {
    return classnamesFromFiles;
  }
  const files = fg.sync(patterns, { suppressErrors: true, stats: true });
  lastUpdate = now;

  /**
   * @type {Set<string}
   */
  const detectedClassnames = new Set();
  /**
   * @type {Set<string>}
   */
  const filesSet = new Set();
  for (const { path: file, stats } of files) {
    filesSet.add(file);
    if (!stats) {} 
    // file is not changed -> we do need to do extra work
    else if (prevEditedTimestamp.get(file) === stats.mtimeMs) {
      continue;
    } else {
      prevEditedTimestamp.set(file, stats.mtimeMs);
    }
    const data = fs.readFileSync(file, 'utf-8');
    const root = postcss.parse(data);
    root.walkRules((rule) => {
      for (const match of rule.selector.matchAll(classRegexp)) {
        detectedClassnames.add(match[1]);
      }
    });
  }
  // avoiding memory leak
  {
    /**
     * @type {string[]}
     */
    const keysToDelete = []
    for (const cachedFilePath of prevEditedTimestamp.keys()) {
      if (!filesSet.has(cachedFilePath)) {
        keysToDelete.push(cachedFilePath);
      }
    }
    for (const key of keysToDelete) {
      prevEditedTimestamp.delete(key);
    }
 }
  classnamesFromFiles = [...detectedClassnames];
  return classnamesFromFiles
};

module.exports = generateClassnamesListSync;
