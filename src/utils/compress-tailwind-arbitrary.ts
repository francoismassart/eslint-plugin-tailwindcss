/**
 * Compresses a Tailwind CSS arbitrary value by removing unnecessary underscores and formatting it correctly.
 * @param value The arbitrary value to compress.
 * @returns The compressed arbitrary value.
 * @example
 * compressTailwindArbitrary("16_/_9") // returns "[16/9]"
 */
export const compressTailwindArbitrary = (value: string) => {
  if (!value) return "";

  return (
    value
      // 1. Replace line jumps and trim spaces at the beginning/end
      .replaceAll(/^_+|_+$/g, "")

      // 2. Remove underscores around commas and parentheses
      .replaceAll(/_*([,()]+)_*/g, "$1")

      // 3. Remove underscores around slashes
      .replaceAll(/_+\/_+|_\/|\/_/g, "/")

      // 4. CORRECTION : Merge remaining multiple underscores (e.g., __ -> _)
      .replaceAll(/_{2,}/g, "_")
  );
};
