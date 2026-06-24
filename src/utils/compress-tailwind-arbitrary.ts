/**
 * Compresses a Tailwind CSS arbitrary value by removing unnecessary underscores and formatting it correctly.
 * @param value The arbitrary value to compress.
 * @returns The compressed arbitrary value.
 * @example
 * compressTailwindArbitrary("16_/_9") // returns "16/9"
 */
export const compressTailwindArbitrary = (value: string): string => {
  if (!value) return "";

  return (
    value
      // 1. Trim underscores from the start and end
      .replaceAll(/^_+|_+$/g, "")
      // 2. Remove underscores around operators: , ( ) / + *
      //    Using a wrapper group lets us clean both sides in one go
      .replaceAll(/_*([,()/+*])_*/g, "$1")
      // 3. Collapse any remaining multiple underscores into a single underscore
      .replaceAll(/_{2,}/g, "_")
  );
};
