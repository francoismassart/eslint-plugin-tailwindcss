/**
 * @example
 * areSetsEqual(new Set([1, 2, 3]);, new Set([3, 2, 1])); // true
 */
export const areSetsEqual = <T>(a: Set<T>, b: Set<T>) =>
  a.size === b.size && [...a].every((value) => b.has(value));
