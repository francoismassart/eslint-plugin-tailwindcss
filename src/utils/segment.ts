/**
 * @fileoverview This file is a copy from Tailwind CSS's source code.
 * @see https://github.com/tailwindlabs/tailwindcss/blob/aad601711fd43d5bf2966a8c30767a6945aaf451/packages/tailwindcss/src/utils/segment.ts
 * @description Ensure strings are consumed as-is when using internal segment()
 * @see https://github.com/tailwindlabs/tailwindcss/pull/13608
 */

/* eslint-disable unicorn/prefer-code-point */
/* eslint-disable unicorn/number-literal-case */

const BACKSLASH = 0x5c;
const OPEN_CURLY = 0x7b;
const CLOSE_CURLY = 0x7d;
const OPEN_PAREN = 0x28;
const CLOSE_PAREN = 0x29;
const OPEN_BRACKET = 0x5b;
const CLOSE_BRACKET = 0x5d;
const DOUBLE_QUOTE = 0x22;
const SINGLE_QUOTE = 0x27;

// This is a shared buffer that is used to keep track of the current nesting level
// of parens, brackets, and braces. It is used to determine if a character is at
// the top-level of a string. This is a performance optimization to avoid memory
// allocations on every call to `segment`.
const closingBracketStack = new Uint8Array(256);

/**
 * This splits a string on a top-level character.
 *
 * Regex doesn't support recursion (at least not the JS-flavored version),
 * so we have to use a tiny state machine to keep track of paren placement.
 *
 * Expected behavior using commas:
 * var(--a, 0 0 1px rgb(0, 0, 0)), 0 0 1px rgb(0, 0, 0)
 *        ┬              ┬  ┬    ┬
 *        x              x  x    ╰──────── Split because top-level
 *        ╰──────────────┴──┴───────────── Ignored b/c inside >= 1 levels of parens
 */
export function segment(input: string, separator: string) {
  // SAFETY: We can use an index into a shared buffer because this function is
  // synchronous, non-recursive, and runs in a single-threaded environment.
  let stackPos = 0;
  const parts: Array<string> = [];
  let lastPos = 0;
  const length_ = input.length;

  const separatorCode = separator.charCodeAt(0);

  for (let index = 0; index < length_; index++) {
    const char = input.charCodeAt(index);

    if (stackPos === 0 && char === separatorCode) {
      parts.push(input.slice(lastPos, index));
      lastPos = index + 1;
      continue;
    }

    switch (char) {
      case BACKSLASH: {
        // The next character is escaped, so we skip it.
        index += 1;
        break;
      }
      // Strings should be handled as-is until the end of the string. No need to
      // worry about balancing parens, brackets, or curlies inside a string.
      case SINGLE_QUOTE:
      case DOUBLE_QUOTE: {
        // Ensure we don't go out of bounds.
        while (++index < length_) {
          const nextChar = input.charCodeAt(index);

          // The next character is escaped, so we skip it.
          if (nextChar === BACKSLASH) {
            index += 1;
            continue;
          }

          if (nextChar === char) {
            break;
          }
        }
        break;
      }
      case OPEN_PAREN: {
        closingBracketStack[stackPos] = CLOSE_PAREN;
        stackPos++;
        break;
      }
      case OPEN_BRACKET: {
        closingBracketStack[stackPos] = CLOSE_BRACKET;
        stackPos++;
        break;
      }
      case OPEN_CURLY: {
        closingBracketStack[stackPos] = CLOSE_CURLY;
        stackPos++;
        break;
      }
      case CLOSE_BRACKET:
      case CLOSE_CURLY:
      case CLOSE_PAREN: {
        if (stackPos > 0 && char === closingBracketStack[stackPos - 1]) {
          // SAFETY: The buffer does not need to be mutated because the stack is
          // only ever read from or written to its current position. Its current
          // position is only ever incremented after writing to it. Meaning that
          // the buffer can be dirty for the next use and still be correct since
          // reading/writing always starts at position `0`.
          stackPos--;
        }
        break;
      }
    }
  }

  parts.push(input.slice(lastPos));

  return parts;
}
