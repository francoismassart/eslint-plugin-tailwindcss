import { areSetsEqual } from "./set";

export const mapGetKeyFromSetValues = <T, V>(
  map: Map<Set<T>, V>,
  values: Set<T>,
): Set<T> | undefined => {
  for (const [key] of map.entries()) {
    if (areSetsEqual(key, values)) {
      return key;
    }
  }
  return undefined;
};
