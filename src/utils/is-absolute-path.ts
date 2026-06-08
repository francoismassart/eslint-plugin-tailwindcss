import path from "node:path";

/**
 * Check if a given file path is absolute, regardless of the originating system
 * (Windows, macOS, or Linux).
 * @param {string} filepath - The path to test
 * @returns {boolean} true if the path is absolute, false if it is relative
 */
export function isAbsolutePath(filepath: string): boolean {
  if (typeof filepath !== "string" || filepath.trim() === "") {
    return false;
  }

  // path.isAbsolute() tests the path according to the current machine's system.
  // By combining .win32 and .posix, we cover all cases at once.
  return path.win32.isAbsolute(filepath) || path.posix.isAbsolute(filepath);
}
