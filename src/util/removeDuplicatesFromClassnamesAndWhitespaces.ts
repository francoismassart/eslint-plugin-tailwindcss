'use strict';

function removeDuplicatesFromClassnamesAndWhitespaces(
  orderedClassNames: string[],
  whitespaces: string[],
  headSpace: boolean,
  tailSpace: boolean
) {
  let previous = orderedClassNames[0];
  const offset = (!headSpace && !tailSpace) || tailSpace ? -1 : 0;
  for (let i = 1; i < orderedClassNames.length; i++) {
    const cls = orderedClassNames[i];
    // This function assumes that the list of classNames is ordered, so just comparing to the previous className is enough
    if (cls === previous) {
      orderedClassNames.splice(i, 1);
      whitespaces.splice(i + offset, 1);
      i--;
    }
    previous = cls;
  }
}

export default removeDuplicatesFromClassnamesAndWhitespaces;
