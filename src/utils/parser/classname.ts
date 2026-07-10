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

const topRightBottomLeftRegex = /^(?:inset|top|right|bottom|left)-/;
const marginPaddingRegex =
  /^(?:m[xytrlbs]?(?:s|e)?|p[xytrlbs]?(?:s|e)?|space-[xy])-(?!-)/;
const sizingRegex = /^(?:size|(?:(?:max|min)-)?(?:w|h|inline|block))-/;
const lineHeightRegex = /^(?:text-.*\/|leading-)/;
const maskImageRegex =
  /^mask-(?:linear-(?:from-|to-)?|radial-(?:from-|to-)|conic-(?:from-|to-)?|[trblxy]-(?:from-|to-))/;
const translateRegex = /^translate(?:-[xyz])?-/;
const scrollMarginPaddingRegex = /^scroll-[mp](?:[xystrble]|bs|be)?-/;

/**
 * Tell you if classname accepts generic numbers (e.g. 0, 1, 2, 3, etc.)
 * @example
 * allowsGenericNumbers(`inset-4`) // returns true;
 * allowsGenericNumbers(`columns-4`) // returns true;
 * allowsGenericNumbers(`z-100`) // returns true;
 * allowsGenericNumbers(`aspect-16/9`) // returns false;
 * @param absoluteClassname Don't use the negative prefix, e.g. `-mt-4` should be passed as `mt-4`
 * @returns a boolean
 */
export const allowsGenericNumbers = (absoluteClassname: string) => {
  // N.B. Use the same order as in the docs 😇

  // https://tailwindcss.com/docs/columns (<unitless>)
  if (absoluteClassname.startsWith("columns-")) return true;
  // https://tailwindcss.com/docs/top-right-bottom-left (<spacing>)
  if (topRightBottomLeftRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/z-index (<unitless>)
  if (absoluteClassname.startsWith("z-")) return true;
  // https://tailwindcss.com/docs/flex-basis (<spacing>)
  if (absoluteClassname.startsWith("basis-")) return true;
  // https://tailwindcss.com/docs/flex (<unitless>)
  if (absoluteClassname.startsWith("flex-")) return true;
  // https://tailwindcss.com/docs/flex-grow (<unitless>)
  if (absoluteClassname.startsWith("grow-")) return true;
  // https://tailwindcss.com/docs/flex-shrink (<unitless>)
  if (absoluteClassname.startsWith("shrink-")) return true;
  // https://tailwindcss.com/docs/order (<unitless>)
  if (absoluteClassname.startsWith("order-")) return true;
  // https://tailwindcss.com/docs/grid-template-columns (<unitless>)
  if (absoluteClassname.startsWith("grid-cols-")) return true;
  // https://tailwindcss.com/docs/grid-column (<unitless>)
  // https://tailwindcss.com/docs/grid-row (<unitless>)
  if (/^(?:col|row)(?:-(?:span|start|end))?-/.test(absoluteClassname))
    return true;
  // https://tailwindcss.com/docs/grid-template-rows (<unitless>)
  if (absoluteClassname.startsWith("grid-rows-")) return true;
  // https://tailwindcss.com/docs/gap (<spacing>)
  if (absoluteClassname.startsWith("gap-")) return true;
  // https://tailwindcss.com/docs/padding (<spacing>)
  // https://tailwindcss.com/docs/margin (<spacing>)
  if (marginPaddingRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/width (<spacing>)
  // https://tailwindcss.com/docs/min-width (<spacing>)
  // https://tailwindcss.com/docs/max-width (<spacing>)
  // https://tailwindcss.com/docs/height (<spacing>)
  // https://tailwindcss.com/docs/min-height (<spacing>)
  // https://tailwindcss.com/docs/max-height (<spacing>)
  // https://tailwindcss.com/docs/inline-size (<spacing>)
  // https://tailwindcss.com/docs/min-inline-size (<spacing>)
  // https://tailwindcss.com/docs/max-inline-size (<spacing>)
  // https://tailwindcss.com/docs/block-size (<spacing>)
  // https://tailwindcss.com/docs/min-block-size (<spacing>)
  // https://tailwindcss.com/docs/max-block-size (<spacing>)
  if (sizingRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/line-clamp (<unitless>)
  if (absoluteClassname.startsWith("line-clamp-")) return true;
  // https://tailwindcss.com/docs/line-height (<spacing>)
  if (lineHeightRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/text-decoration-thickness (px)
  if (absoluteClassname.startsWith("decoration-")) return true;
  // https://tailwindcss.com/docs/text-underline-offset (px)
  if (absoluteClassname.startsWith("underline-offset-")) return true;
  // https://tailwindcss.com/docs/text-indent (<spacing>)
  if (absoluteClassname.startsWith("indent-")) return true;
  // https://tailwindcss.com/docs/tab-size (<unitless>)
  if (absoluteClassname.startsWith("tab-")) return true;
  // https://tailwindcss.com/docs/border-width (px)
  if (
    /^(?:border(?:-(?:[xystrble]|bs|be))?|divide-[xy])-/.test(absoluteClassname)
  )
    return true;
  // https://tailwindcss.com/docs/outline-width (px)
  if (absoluteClassname.startsWith("outline-")) return true;
  // https://tailwindcss.com/docs/outline-offset (px)
  if (absoluteClassname.startsWith("outline-offset-")) return true;
  // https://tailwindcss.com/docs/box-shadow (px)
  if (absoluteClassname.startsWith("ring-")) return true;
  if (absoluteClassname.startsWith("inset-ring-")) return true;
  // https://tailwindcss.com/docs/opacity (%)
  if (absoluteClassname.startsWith("opacity-")) return true;
  // https://tailwindcss.com/docs/mask-image (deg, <spacing>)
  if (maskImageRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/filter-brightness (%)
  if (absoluteClassname.startsWith("brightness--")) return true;
  // https://tailwindcss.com/docs/filter-contrast (%)
  if (absoluteClassname.startsWith("contrast--")) return true;
  // https://tailwindcss.com/docs/filter-grayscale (%)
  if (absoluteClassname.startsWith("grayscale-")) return true;
  // https://tailwindcss.com/docs/filter-hue-rotate (deg)
  if (absoluteClassname.startsWith("hue-rotate-")) return true;
  // https://tailwindcss.com/docs/filter-invert (%)
  if (absoluteClassname.startsWith("invert-")) return true;
  // https://tailwindcss.com/docs/filter-saturate (%)
  if (absoluteClassname.startsWith("saturate-")) return true;
  // https://tailwindcss.com/docs/filter-sepia (%)
  if (absoluteClassname.startsWith("sepia-")) return true;
  // https://tailwindcss.com/docs/backdrop-filter-brightness (%)
  if (absoluteClassname.startsWith("backdrop-brightness-")) return true;
  // https://tailwindcss.com/docs/backdrop-filter-contrast (%)
  if (absoluteClassname.startsWith("backdrop-contrast-")) return true;
  // https://tailwindcss.com/docs/backdrop-filter-grayscale (%)
  if (absoluteClassname.startsWith("backdrop-grayscale-")) return true;
  // https://tailwindcss.com/docs/backdrop-filter-hue-rotate (deg)
  if (absoluteClassname.startsWith("backdrop-hue-rotate-")) return true;
  // https://tailwindcss.com/docs/backdrop-filter-invert (%)
  if (absoluteClassname.startsWith("backdrop-invert-")) return true;
  // https://tailwindcss.com/docs/backdrop-filter-opacity (%)
  if (absoluteClassname.startsWith("backdrop-opacity-")) return true;
  // https://tailwindcss.com/docs/backdrop-filter-saturate (%)
  if (absoluteClassname.startsWith("backdrop-saturate-")) return true;
  // https://tailwindcss.com/docs/backdrop-filter-sepia (%)
  if (absoluteClassname.startsWith("backdrop-sepia-")) return true;
  // https://tailwindcss.com/docs/border-spacing (<spacing>)
  if (absoluteClassname.startsWith("border-spacing-")) return true;
  // https://tailwindcss.com/docs/transition-duration  (ms)
  if (absoluteClassname.startsWith("duration-")) return true;
  // https://tailwindcss.com/docs/transition-delay (ms)
  if (absoluteClassname.startsWith("delay-")) return true;
  // https://tailwindcss.com/docs/rotate (deg)
  if (absoluteClassname.startsWith("rotate-")) return true;
  // https://tailwindcss.com/docs/scale (%)
  if (absoluteClassname.startsWith("scale-")) return true;
  // https://tailwindcss.com/docs/skew (deg)
  if (absoluteClassname.startsWith("skew-")) return true;
  // https://tailwindcss.com/docs/translate (<spacing>)
  if (translateRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/zoom (%)
  if (absoluteClassname.startsWith("zoom-")) return true;
  // https://tailwindcss.com/docs/scroll-margin (<spacing>)
  // https://tailwindcss.com/docs/scroll-padding (<spacing>)
  if (scrollMarginPaddingRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/stroke-width (<unitless>)
  if (absoluteClassname.startsWith("stroke-")) return true;
  return false;
};

/**
 * Tell you if classname could be based on spacing (padding, margin, gap, etc.)
 * @example
 * supportsSpacing(`inset-4`) // returns true;
 * supportsSpacing(`columns-4`) // returns false;
 * supportsSpacing(`z-100`) // returns false;
 * @param absoluteClassname Don't use the negative prefix, e.g. `-mt-4` should be passed as `mt-4`
 * @returns a boolean
 */
export const supportsSpacing = (absoluteClassname: string) => {
  // N.B. Use the same order as in the docs 😇

  // https://tailwindcss.com/docs/top-right-bottom-left
  if (topRightBottomLeftRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/flex-basis
  if (absoluteClassname.startsWith("basis-")) return true;
  // https://tailwindcss.com/docs/gap
  if (absoluteClassname.startsWith("gap-")) return true;
  // https://tailwindcss.com/docs/padding
  // https://tailwindcss.com/docs/margin
  if (marginPaddingRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/width
  // https://tailwindcss.com/docs/min-width
  // https://tailwindcss.com/docs/max-width
  // https://tailwindcss.com/docs/height
  // https://tailwindcss.com/docs/min-height
  // https://tailwindcss.com/docs/max-height
  // https://tailwindcss.com/docs/inline-size
  // https://tailwindcss.com/docs/min-inline-size
  // https://tailwindcss.com/docs/max-inline-size
  // https://tailwindcss.com/docs/block-size
  // https://tailwindcss.com/docs/min-block-size
  // https://tailwindcss.com/docs/max-block-size
  if (sizingRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/line-height
  if (lineHeightRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/text-indent
  if (absoluteClassname.startsWith("indent-")) return true;
  // https://tailwindcss.com/docs/mask-image
  if (maskImageRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/border-spacing
  if (absoluteClassname.startsWith("border-spacing-")) return true;
  // https://tailwindcss.com/docs/translate
  if (translateRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/scroll-margin
  // https://tailwindcss.com/docs/scroll-padding
  if (scrollMarginPaddingRegex.test(absoluteClassname)) return true;
  return false;
};

/**
 * Tell you if classname support the `-px` value
 * @example
 * hasPxNativePreset(`inset-4`) // returns true;
 * hasPxNativePreset(`columns-4`) // returns false;
 * @param absoluteClassname Don't use the negative prefix, e.g. `-mt-4` should be passed as `mt-4`
 * @returns a boolean
 */
export const hasPxNativePreset = (absoluteClassname: string) => {
  // N.B. Use the same order as in the docs 😇

  // https://tailwindcss.com/docs/top-right-bottom-left
  if (topRightBottomLeftRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/padding
  // https://tailwindcss.com/docs/margin
  if (marginPaddingRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/width
  // https://tailwindcss.com/docs/min-width
  // https://tailwindcss.com/docs/max-width
  // https://tailwindcss.com/docs/height
  // https://tailwindcss.com/docs/min-height
  // https://tailwindcss.com/docs/max-height
  // https://tailwindcss.com/docs/inline-size
  // https://tailwindcss.com/docs/min-inline-size
  // https://tailwindcss.com/docs/max-inline-size
  // https://tailwindcss.com/docs/block-size
  // https://tailwindcss.com/docs/min-block-size
  // https://tailwindcss.com/docs/max-block-size
  if (sizingRegex.test(absoluteClassname)) return true;
  // https://tailwindcss.com/docs/text-indent
  if (absoluteClassname.startsWith("indent-")) return true;
  // https://tailwindcss.com/docs/translate
  if (translateRegex.test(absoluteClassname)) return true;
  return false;
};
