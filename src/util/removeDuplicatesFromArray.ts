'use strict';

function removeDuplicatesFromArray(arr: Iterable<string> | null | undefined) {
  return [...new Set(arr)];
}

export default removeDuplicatesFromArray;
