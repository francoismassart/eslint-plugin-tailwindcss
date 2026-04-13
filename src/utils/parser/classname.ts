/**
 * @example
 * getBaseClassname(`hover:bg-red-500`) // returns `bg-red-500`;
 */
export const getBaseClassname = (classname: string) =>
  classname.split(":").pop() || classname;

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
