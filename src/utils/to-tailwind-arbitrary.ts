export const toTailwindArbitrary = (rawValue: string) => {
  if (!rawValue) return "";

  let result = rawValue
    // 1. Replace line jumps and trim spaces at the beginning/end
    .replaceAll(/\s+/g, " ")
    .trim();

  // 2. Remove ALL spaces around commas and parentheses (except inside quotes)
  // to avoid pitfalls like `repeat( auto-fill, ... )`
  result = result.replaceAll(/\s*([,()]+)\s*/g, "$1");

  // 3. Replace remaining spaces with underscores, EXCEPT inside quotes
  result = result
    .replaceAll(/[^"\s]+|"[^"\\]*(?:\\.[^"\\]*)*"/g, (match) => {
      if (match.startsWith('"')) return match;
      return match.replaceAll(/\s/g, "_");
    })
    .replaceAll(/\s/g, "_");

  // 4. Remove remaining underscores around slashes '/'
  return result.replaceAll(/_+_?\/_+_?/g, "/");
};
