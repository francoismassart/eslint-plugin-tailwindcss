'use strict';

function removeDuplicatesFromClassnamesAndWhitespaces(classNames, whitespaces, headSpace, tailSpace) {
  const uniqueSet = new Set(classNames);
  if (uniqueSet.size === classNames.length) {
    return;
  }
  const offset = (!headSpace && !tailSpace) || tailSpace ? -1 : 0;
  uniqueSet.forEach((cls) => {
    let duplicatedInstances = classNames.filter((el) => el === cls).length - 1;
    while (duplicatedInstances > 0) {
      const idx = classNames.lastIndexOf(cls);
      classNames.splice(idx, 1);
      whitespaces.splice(idx + offset, 1);
      duplicatedInstances--;
    }
  });
}

module.exports = removeDuplicatesFromClassnamesAndWhitespaces;
