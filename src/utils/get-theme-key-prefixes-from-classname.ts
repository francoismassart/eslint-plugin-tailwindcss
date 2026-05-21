import { getBaseClassname } from "./parser/classname";
import { Theme } from "./tailwindcss-api/types";

// Notes `divide-x-abc` retrieves presets from:
// - colors (e.g. `--color-ccc: #ccc;`)
// - borderColor (e.g. `--border-color-bbb: red;`)
// - divideColor (e.g. `--divide-color-ddd: green;`)
// so `divide-x-[...]` should check the 3 prefixes
// the order matters from the most generic prefix to the most specific

// classname: aspect-[4/3]
// or
// classname: aspect-
// `aspect-[...]` => `--aspect-`
export const getThemeKeyPrefixesFromClassname = (
  theme: Theme,
  classname: string,
) => {
  const baseClass = getBaseClassname(classname);
  switch (true) {
    /*
     * (Effects)
     */
    case baseClass.startsWith("inset-shadow-"): {
      return new Set(["--inset-shadow-"]);
    }
    /*
     * Layout
     */
    case baseClass.startsWith("aspect-"): {
      return new Set(["--aspect-"]);
    }
    case baseClass.startsWith("columns-"): {
      return new Set(["--container-", "--columns-"]);
    }
    case baseClass.startsWith("min-w-"): {
      return new Set(["--container-", "--min-w-"]);
    }
    case baseClass.startsWith("w-"): {
      return new Set(["--container-", "--w-"]);
    }
    case baseClass.startsWith("min-inline-"): {
      return new Set(["--container-"]);
    }
    case baseClass.startsWith("basis-"): {
      return new Set(["--container-"]);
    }
    case baseClass.startsWith("max-w-"): {
      return new Set(["--container-", "--max-w-"]);
    }
    case baseClass.startsWith("inline-"): {
      return new Set(["--container-"]);
    }
    case /^(inset|top|right|bottom|left)-/.test(baseClass): {
      return new Set(["--inset-"]);
    }
    case baseClass.startsWith("z-"): {
      return new Set(["--z-index-"]);
    }
    /*
     * Flexbox & Grid
     */
    case baseClass.startsWith("order-"): {
      return new Set(["--order-"]);
    }
    case baseClass.startsWith("grid-cols-"): {
      return new Set(["--grid-template-columns-"]);
    }
    case baseClass.startsWith("col-end-"): {
      return new Set(["--grid-column-end-"]);
    }
    case baseClass.startsWith("col-"): {
      return new Set(["--grid-column-"]);
    }
    case baseClass.startsWith("grid-rows-"): {
      return new Set(["--grid-template-rows-"]);
    }
    case baseClass.startsWith("row-start-"): {
      return new Set(["--grid-row-start-"]);
    }
    case baseClass.startsWith("row-end-"): {
      return new Set(["--grid-row-end-"]);
    }
    case baseClass.startsWith("auto-cols-"): {
      return new Set(["--grid-auto-columns-"]);
    }
    case baseClass.startsWith("auto-rows-"): {
      return new Set(["--grid-auto-rows-"]);
    }
    case baseClass.startsWith("gap-"): {
      return new Set(["--gap-"]);
    }
    /*
     * Spacing
     */
    case /^(p|px|py|ps|pe|pbs|pbe|pt|pr|pb|pl)-/.test(baseClass): {
      return new Set(["--padding-"]);
    }
    case /^(m|mx|my|ms|me|mbs|mbe|mt|mr|mb|ml)-/.test(baseClass): {
      return new Set(["--margin-"]);
    }
    /*
     * Sizing
     */
    // `min-w-`, `max-w-` and `w-` are detected via `container-` prefix, so we don't need to check them here
    case baseClass.startsWith("h-"): {
      return new Set(["--height-"]);
    }
    case baseClass.startsWith("min-h-"): {
      return new Set(["--height-", "--min-height-"]);
    }
    case baseClass.startsWith("max-h-"): {
      return new Set(["--height-", "--max-height-"]);
    }
    /*
     * (Effects)
     */
    case baseClass.startsWith("text-shadow-color-"): {
      return new Set(["--text-shadow-color-"]);
    }
    case baseClass.startsWith("text-shadow-"): {
      return new Set(["--text-shadow-"]);
    }
    /*
     * Typography
     */
    case baseClass.startsWith("font-stretch-"): {
      return new Set(["--font-stretch-"]);
    }
    case baseClass.startsWith("font-"): {
      return new Set(["--font-", "--font-weight-"]);
    }
    case baseClass.startsWith("text-"): {
      return new Set(["--text-", "--color-"]);
    }
    case baseClass.startsWith("tracking-"): {
      return new Set(["--tracking-"]);
    }
    case baseClass.startsWith("line-clamp-"): {
      return new Set(["--line-clamp-"]);
    }
    case baseClass.startsWith("leading-"): {
      return new Set(["--leading-"]);
    }
    case baseClass.startsWith("list-"): {
      return new Set(["--list-style-type-"]);
    }
    case baseClass.startsWith("decoration-link-"): {
      return new Set(["--text-decoration-color-"]);
    }
    case baseClass.startsWith("decoration-"): {
      return new Set(["--text-decoration-thickness-"]);
    }
    case baseClass.startsWith("underline-offset-"): {
      return new Set(["--text-underline-offset-"]);
    }
    /*
     * Backgrounds
     */
    case baseClass.startsWith("bg-"): {
      return new Set([
        "--background-image-",
        "--color-",
        "--background-color-",
      ]);
    }
    /*
     * (Tables)
     */
    case baseClass.startsWith("border-spacing-"): {
      return new Set(["--border-spacing-"]);
    }
    /*
     * Borders
     */
    case baseClass.startsWith("rounded-"): {
      return new Set(["--radius-"]);
    }
    case baseClass.startsWith("border-"): {
      return new Set(["--color-", "--border-color-", "--border-width-"]);
    }
    case baseClass.startsWith("divide-x"): {
      return new Set(["--border-width-", "--divide-width-"]);
    }
    case baseClass.startsWith("divide-y"): {
      return new Set(["--border-width-", "--divide-width-"]);
    }
    case baseClass.startsWith("divide-"): {
      return new Set(["--color-", "--border-color-", "--divide-color-"]);
    }
    case baseClass.startsWith("outline-offset-"): {
      return new Set(["--outline-offset-"]);
    }
    case baseClass.startsWith("outline-"): {
      return new Set(["--outline-width-", "--outline-color-"]);
    }
    /*
     * Effects
     */
    case baseClass.startsWith("shadow-color-"): {
      return new Set(["--shadow-color-"]);
    }
    case baseClass.startsWith("shadow-"): {
      return new Set(["--shadow-"]);
    }
    case baseClass.startsWith("opacity-"): {
      return new Set(["--opacity-"]);
    }
    /*
     * Filters
     */
    case baseClass.startsWith("blur-"): {
      return new Set(["--blur-"]);
    }
    case baseClass.startsWith("brightness-"): {
      return new Set(["--brightness-"]);
    }
    case baseClass.startsWith("contrast-"): {
      return new Set(["--contrast-"]);
    }
    case baseClass.startsWith("drop-shadow-"): {
      return new Set(["--drop-shadow-"]);
    }
    case baseClass.startsWith("grayscale-"): {
      return new Set(["--grayscale-"]);
    }
    case baseClass.startsWith("hue-rotate-"): {
      return new Set(["--hue-rotate-"]);
    }
    case baseClass.startsWith("invert-"): {
      return new Set(["--invert-"]);
    }
    case baseClass.startsWith("saturate-"): {
      return new Set(["--saturate-"]);
    }
    case baseClass.startsWith("sepia-"): {
      return new Set(["--sepia-"]);
    }
    case baseClass.startsWith("backdrop-blur-"): {
      return new Set(["--backdrop-blur-"]);
    }
    case baseClass.startsWith("backdrop-brightness-"): {
      return new Set(["--backdrop-brightness-"]);
    }
    case baseClass.startsWith("backdrop-contrast-"): {
      return new Set(["--backdrop-contrast-"]);
    }
    case baseClass.startsWith("backdrop-grayscale-"): {
      return new Set(["--backdrop-grayscale-"]);
    }
    case baseClass.startsWith("backdrop-hue-rotate-"): {
      return new Set(["--backdrop-hue-rotate-"]);
    }
    case baseClass.startsWith("backdrop-invert-"): {
      return new Set(["--backdrop-invert-"]);
    }
    case baseClass.startsWith("backdrop-opacity-"): {
      return new Set(["--backdrop-opacity-"]);
    }
    case baseClass.startsWith("backdrop-saturate-"): {
      return new Set(["--backdrop-saturate-"]);
    }
    case baseClass.startsWith("backdrop-sepia-"): {
      return new Set(["--backdrop-sepia-"]);
    }
    /*
     * Tables
     */
    /*
     * Transitions & Animation
     */
    case baseClass.startsWith("transition-"): {
      return new Set(["--transition-"]);
    }
    case baseClass.startsWith("duration-"): {
      return new Set(["--duration-"]);
    }
    case baseClass.startsWith("ease-"): {
      return new Set(["--ease-"]);
    }
    case baseClass.startsWith("delay-"): {
      return new Set(["--delay-"]);
    }
    case baseClass.startsWith("animate-"): {
      return new Set(["--animate-"]);
    }
    /*
     * Transforms
     */
    case baseClass.startsWith("perspective-origin-"): {
      return new Set(["--perspective-origin-"]);
    }
    case baseClass.startsWith("perspective-"): {
      return new Set(["--perspective-"]);
    }
    case baseClass.startsWith("rotate-"): {
      return new Set(["--rotate-"]);
    }
    case baseClass.startsWith("scale-"): {
      return new Set(["--scale-"]);
    }
    case baseClass.startsWith("skew-"): {
      return new Set(["--skew-"]);
    }
    case baseClass.startsWith("origin-"): {
      return new Set(["--origin-"]);
    }
    case baseClass.startsWith("translate-"): {
      return new Set(["--translate-"]);
    }
    /*
     * Interactivity
     */
    case baseClass.startsWith("caret-"): {
      return new Set(["--caret-color-"]);
    }
    case baseClass.startsWith("cursor-"): {
      return new Set(["--cursor-"]);
    }
    case /^scroll-(m|mx|my|ms|me|mbs|mbe|mt|mr|mb|ml)-/.test(baseClass): {
      return new Set(["--scroll-margin-"]);
    }
    case /^scroll-(p|px|py|ps|pe|pbs|pbe|pt|pr|pb|pl)-/.test(baseClass): {
      return new Set(["--scroll-padding-"]);
    }
    /*
     * SVG
     */
    case baseClass.startsWith("fill-"): {
      return new Set(["--fill-"]);
    }
    case baseClass.startsWith("stroke-"): {
      return new Set(["--stroke-", "--stroke-width-"]);
    }
    /*
     * Accessibility
     */
    default: {
      return new Set();
    }
  }
};
