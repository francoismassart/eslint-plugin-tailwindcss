// TODO retrieve the separator from Tailwind CSS config
const separator = ":";

/**
 * @example
 * getBaseClassname(`hover:bg-red-500`) // returns `bg-red-500`;
 */
export const getBaseClassname = (classname: string) =>
  // TODO see segment.ts about the gotchas about arbitrary values and ":" usage in (), etc.
  classname.split(separator).pop() || classname;

/**
 * @example
 * getModifiersPrefix(`hover:bg-red-500`) // returns `hover:`;
 */
export const getModifiersPrefix = (classname: string) => {
  // TODO see segment.ts about the gotchas about arbitrary values and ":" usage in (), etc.
  const lastIndex = classname.lastIndexOf(separator);
  if (lastIndex === -1) return "";
  return classname.slice(0, Math.max(0, lastIndex + 1));
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
