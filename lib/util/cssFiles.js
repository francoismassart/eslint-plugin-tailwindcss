// @ts-check
'use strict';

const fg = require('fast-glob');
const fs = require('fs');
const postcss = require('postcss');

const classRegexp = /\.([^\.\,\s\n\:\(\)\[\]\'~\+\>\*\\]*)/gim;

let lastUpdate = null;
let classnamesFromFiles = [];

/**
 * @type {Map<string, {
 *  timestamp: number;
 *  classes: ReadonlySet<string>
 * }>}
 */
const prevFileCache = new Map();

const SetHelper = {
  /**
   *
   * @template T
   * @param {Set<T>} set
   * @param {Iterable<T>} items
   */
  addMany: (set, items) => {
    for (const item of items) {
      set.add(item);
    }
  },
};

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
   * @type {Set<string>}
   */
  const detectedClassnames = new Set();
  /**
   * @type {Set<string>}
   */
  const filesSet = new Set();
  for (const { path: file, stats } of files) {
    const prevData = prevFileCache.get(file);
    const timestamp = stats?.mtimeMs;
    /**
     * @type {ReadonlySet<string>}
     */
    let classes;
    // file is not changed -> we do need to do extra work
    if (prevData && prevData?.timestamp === timestamp) {
      classes = prevData.classes;
    } else {
      /**
       * @type {Set<string>}
       */
      const curClasses = new Set();
      const data = fs.readFileSync(file, 'utf-8');
      const root = postcss.parse(data);
      root.walkRules((rule) => {
        for (const match of rule.selector.matchAll(classRegexp)) {
          curClasses.add(match[1]);
        }
      });

      classes = curClasses;

      if (timestamp) {
        prevFileCache.set(file, {
          classes,
          timestamp,
        });
      }
    }

    SetHelper.addMany(detectedClassnames, classes);
    filesSet.add(file);
  }
  // avoiding memory leak
  {
    /**
     * @type {string[]}
     */
    const keysToDelete = [];
    for (const cachedFilePath of prevFileCache.keys()) {
      if (!filesSet.has(cachedFilePath)) {
        keysToDelete.push(cachedFilePath);
      }
    }
    for (const key of keysToDelete) {
      prevFileCache.delete(key);
    }
  }
  classnamesFromFiles = [...detectedClassnames];
  return classnamesFromFiles;
};

module.exports = generateClassnamesListSync;
