import { getBaseClassname, getModifiersPrefix } from "./classname";

/**
 * @example
 * groupByModifiersPrefix([`flex`, `flex-col`, `hover:bg-red-500`, `hover:text-black`])
 * // returns `Map` with
 * // "": [`flex`, `flex-col`]
 * // "hover:": [`bg-red-500`, `text-black`]
 */
export const groupByModifiersPrefix = (classNames: Array<string>) => {
  const groups: Map<string, Array<string>> = new Map();
  for (const className of classNames) {
    const baseClass = getBaseClassname(className);
    const modifiers = getModifiersPrefix(className);
    const list: Array<string> = groups.has(modifiers)
      ? groups.get(modifiers) || []
      : [];
    list?.push(baseClass);
    groups.set(modifiers, list);
  }
  return groups;
};
