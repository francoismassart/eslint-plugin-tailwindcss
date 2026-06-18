import { segment } from "../segment";

// TODO retrieve the separator from Tailwind CSS config when it is possible
const separator = ":";

/**
 * @example
 * getBaseClassname(`hover:bg-red-500`) // returns `bg-red-500`;
 */
export const getBaseClassname = (classname: string) =>
  segment(classname, separator).pop() || classname;

/**
 * @example
 * getModifiersPrefix(`hover:bg-red-500`) // returns `hover:`;
 */
export const getModifiersPrefix = (classname: string) => {
  const parts = segment(classname, separator);
  if (parts.length === 1) return "";
  return parts.slice(0, -1).join(separator) + separator;
};

/**
 * @example
 * passRegexTest(`js-[a-z0-9-]+`, `js-custom`) // returns true;
 * passRegexTest(`js-[a-z0-9-]+`, `custom`) // returns false;
 * passRegexTest(`(js-[a-z0-9-]+`, `invalid-reg-ex`) // returns false;
 */
export const passRegexTest = (pattern: string, classname: string) => {
  try {
    const re = new RegExp(`^${pattern}$`);
    return re.test(classname);
  } catch (error) {
    console.error(`Invalid regex pattern: ${pattern}`, error);
    return false;
  }
};
