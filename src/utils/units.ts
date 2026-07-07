/**
 * Converts a string value to pixels number, only supports px and rem units.
 * @param value The string value to convert.
 * @returns The value in pixels or undefined if the conversion fails.
 */
export const convertStringValueToPx = (value: string): number | undefined => {
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:px|rem)$/.test(value)) return undefined;
  const ratio = value.endsWith("rem") ? 16 : 1;
  return Number.parseFloat(value) * ratio;
};
