type JoinerOptions = {
  classNames: Array<string>;
  whitespaces: Array<string>;
  headSpace: boolean;
  tailSpace: boolean;
  validator?: (candidate: string) => boolean;
};
/**
 * Helper function to join classnames with whitespaces, and preserve head/tail spaces if needed.
 */
export const joiner = ({
  classNames,
  whitespaces,
  headSpace,
  tailSpace,
  validator = () => true,
}: JoinerOptions) => {
  // Make a copy of whitespaces because we don't want to mutate the original array
  // (Remember that ESLint runs several times and we don't want to mess up the whitespaces for the next runs)
  const spaces = [...whitespaces];

  const head = headSpace ? spaces.shift() : "";
  const tail = tailSpace ? spaces.pop() : "";

  const validatedClasses: Array<string> = [];
  for (const [index, className] of classNames.entries()) {
    if (!validator(className)) continue;
    const spacer =
      validatedClasses.length === 0 ? "" : (spaces[index - 1] ?? " ");
    validatedClasses.push(spacer + className);
  }

  if (validatedClasses.length === 0) return "";
  return head + validatedClasses.join("") + tail;
};
