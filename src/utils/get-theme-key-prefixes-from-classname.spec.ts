import { expect, test } from "vitest";

import { withAllPresetsSettings } from "../utils/parser/test-helpers";
import { loadThemeWorker } from "../utils/tailwindcss-api";
import { getThemeKeyPrefixesFromClassname } from "./get-theme-key-prefixes-from-classname";

const theme = loadThemeWorker(withAllPresetsSettings.cssConfigPath);

test(`Get the theme key prefixes from classname`, () => {
  [
    /*
     * Layout
     */
    {
      classname: "aspect-retro",
      prefixes: new Set(["--aspect-"]),
    },
    {
      classname: "columns-side-menu",
      prefixes: new Set(["--container-", "--columns-"]),
    },
    {
      classname: "min-w-micro",
      prefixes: new Set(["--container-", "--min-w-"]),
    },
    {
      classname: "w-micro",
      prefixes: new Set(["--container-", "--w-"]),
    },
    {
      classname: "min-inline-micro",
      prefixes: new Set(["--container-"]),
    },
    {
      classname: "basis-micro",
      prefixes: new Set(["--container-"]),
    },
    {
      classname: "max-w-micro",
      prefixes: new Set(["--container-", "--max-w-"]),
    },
    {
      classname: "inline-micro",
      prefixes: new Set(["--container-"]),
    },
    {
      classname: "inset-x-pi",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "inset-y-pi",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "inset-s-pi",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "inset-e-pi",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "inset-bs-pi",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "inset-be-pi",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "inset-",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "top-",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "right-",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "bottom-",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "left-",
      prefixes: new Set(["--inset-"]),
    },
    {
      classname: "z-dropdown",
      prefixes: new Set(["--z-index-"]),
    },
    /*
     * Flexbox & Grid
     */
    {
      classname: "order-revolution",
      prefixes: new Set(["--order-"]),
    },
    {
      classname: "grid-cols-cards",
      prefixes: new Set(["--grid-template-columns-"]),
    },
    {
      classname: "col-main",
      prefixes: new Set(["--grid-column-"]),
    },
    {
      classname: "col-end-last-of-us",
      prefixes: new Set(["--grid-column-end-"]),
    },
    {
      classname: "grid-rows-screen-3",
      prefixes: new Set(["--grid-template-rows-"]),
    },
    {
      classname: "row-start-top",
      prefixes: new Set(["--grid-row-start-"]),
    },
    {
      classname: "row-end-bottomus",
      prefixes: new Set(["--grid-row-end-"]),
    },
    {
      classname: "auto-cols-thirteen",
      prefixes: new Set(["--grid-auto-columns-"]),
    },
    {
      classname: "auto-rows-thumb",
      prefixes: new Set(["--grid-auto-rows-"]),
    },
    {
      classname: "gap-chunky",
      prefixes: new Set(["--gap-"]),
    },
    /*
     * Spacing
     */
    {
      classname: "p-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "px-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "py-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "ps-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "pe-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "pbs-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "pbe-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "pt-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "pr-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "pb-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "pl-safe",
      prefixes: new Set(["--padding-"]),
    },
    {
      classname: "m-huge",
      prefixes: new Set(["--margin-"]),
    },
    /*
     * Sizing
     */
    // Width is already tested as part of the "Layout" section, so we only test height here
    {
      classname: "h-effeil",
      prefixes: new Set(["--height-"]),
    },
    {
      classname: "min-h-ride",
      prefixes: new Set(["--height-", "--min-height-"]),
    },
    {
      classname: "max-h-ride",
      prefixes: new Set(["--height-", "--max-height-"]),
    },
    /*
     * Typography
     */
    {
      classname: "font-display",
      prefixes: new Set(["--font-", "--font-weight-"]),
    },
    {
      classname: "text-tiny",
      prefixes: new Set(["--text-", "--color-"]),
    },
    {
      classname: "font-extrablack",
      prefixes: new Set(["--font-", "--font-weight-"]),
    },
    {
      classname: "font-stretch-ultra-condensed",
      prefixes: new Set(["--font-stretch-"]),
    },
    {
      classname: "tracking-caps",
      prefixes: new Set(["--tracking-"]),
    },
    {
      classname: "tracking-caps",
      prefixes: new Set(["--tracking-"]),
    },
    {
      classname: "line-clamp-long",
      prefixes: new Set(["--line-clamp-"]),
    },
    {
      classname: "leading-article",
      prefixes: new Set(["--leading-"]),
    },
    {
      classname: "list-emoji",
      prefixes: new Set(["--list-style-type-"]),
    },
    {
      classname: "decoration-link-hover",
      prefixes: new Set(["--text-decoration-color-"]),
    },
    {
      classname: "decoration-thick",
      prefixes: new Set(["--text-decoration-thickness-"]),
    },
    {
      classname: "underline-offset-deep",
      prefixes: new Set(["--text-underline-offset-"]),
    },
    /*
     * Backgrounds
     */
    {
      classname: "bg-page-dark",
      prefixes: new Set([
        "--background-image-",
        "--color-",
        "--background-color-",
      ]),
    },
    /*
     * Borders
     */
    {
      classname: "rounded-5xl",
      prefixes: new Set(["--radius-"]),
    },
    {
      classname: "border-input-heavy",
      prefixes: new Set(["--color-", "--border-color-", "--border-width-"]),
    },
    {
      classname: "border-input-muted",
      prefixes: new Set(["--color-", "--border-color-", "--border-width-"]),
    },
    {
      classname: "divide-faded",
      prefixes: new Set(["--color-", "--border-color-", "--divide-color-"]),
    },
    {
      classname: "divide-x-thin",
      prefixes: new Set(["--border-width-", "--divide-width-"]),
    },
    {
      classname: "outline-focus-ring",
      prefixes: new Set(["--outline-width-", "--outline-color-"]),
    },
    {
      classname: "outline-accessible-blue",
      prefixes: new Set(["--outline-width-", "--outline-color-"]),
    },
    {
      classname: "outline-offset-inset",
      prefixes: new Set(["--outline-offset-"]),
    },
    /*
     * Effects
     */
    {
      classname: "shadow-3xl",
      prefixes: new Set(["--shadow-"]),
    },
    {
      classname: "inset-shadow-md",
      prefixes: new Set(["--inset-shadow-"]),
    },
    {
      classname: "shadow-color-field",
      prefixes: new Set(["--shadow-color-"]),
    },
    {
      classname: "text-shadow-color-matrix",
      prefixes: new Set(["--text-shadow-color-"]),
    },
    {
      classname: "text-shadow-xl",
      prefixes: new Set(["--text-shadow-"]),
    },
    {
      classname: "opacity-ghost",
      prefixes: new Set(["--opacity-"]),
    },
    /*
     * Filters
     */
    {
      classname: "blur-2xs",
      prefixes: new Set(["--blur-"]),
    },
    {
      classname: "brightness-intense",
      prefixes: new Set(["--brightness-"]),
    },
    {
      classname: "contrast-enhanced",
      prefixes: new Set(["--contrast-"]),
    },
    {
      classname: "drop-shadow-3xl",
      prefixes: new Set(["--drop-shadow-"]),
    },
    {
      classname: "grayscale-subtle",
      prefixes: new Set(["--grayscale-"]),
    },
    {
      classname: "hue-rotate-half",
      prefixes: new Set(["--hue-rotate-"]),
    },
    {
      classname: "invert-partial",
      prefixes: new Set(["--invert-"]),
    },
    {
      classname: "saturate-pop",
      prefixes: new Set(["--saturate-"]),
    },
    {
      classname: "sepia-warm",
      prefixes: new Set(["--sepia-"]),
    },
    {
      classname: "backdrop-blur-2xs",
      prefixes: new Set(["--backdrop-blur-"]),
    },
    {
      classname: "backdrop-brightness-intense",
      prefixes: new Set(["--backdrop-brightness-"]),
    },
    {
      classname: "backdrop-contrast-enhanced",
      prefixes: new Set(["--backdrop-contrast-"]),
    },
    {
      classname: "backdrop-grayscale-subtle",
      prefixes: new Set(["--backdrop-grayscale-"]),
    },
    {
      classname: "backdrop-hue-rotate-half",
      prefixes: new Set(["--backdrop-hue-rotate-"]),
    },
    {
      classname: "backdrop-invert-partial",
      prefixes: new Set(["--backdrop-invert-"]),
    },
    {
      classname: "backdrop-opacity-third",
      prefixes: new Set(["--backdrop-opacity-"]),
    },
    {
      classname: "backdrop-saturate-pop",
      prefixes: new Set(["--backdrop-saturate-"]),
    },
    {
      classname: "backdrop-sepia-warm",
      prefixes: new Set(["--backdrop-sepia-"]),
    },
    /*
     * Tables
     */
    {
      classname: "border-spacing-wide",
      prefixes: new Set(["--border-spacing-"]),
    },
    /*
     * Transitions & Animation
     */
    {
      classname: "transition-kart",
      prefixes: new Set(["--transition-"]),
    },
    {
      classname: "duration-epic",
      prefixes: new Set(["--duration-"]),
    },
    {
      classname: "ease-expo",
      prefixes: new Set(["--ease-"]),
    },
    {
      classname: "delay-staggered",
      prefixes: new Set(["--delay-"]),
    },
    {
      classname: "animate-wiggle",
      prefixes: new Set(["--animate-"]),
    },
    /*
     * Transforms
     */
    {
      classname: "perspective-remote",
      prefixes: new Set(["--perspective-"]),
    },
    {
      classname: "perspective-origin-dramatic",
      prefixes: new Set(["--perspective-origin-"]),
    },
    {
      classname: "rotate-half",
      prefixes: new Set(["--rotate-"]),
    },
    {
      classname: "scale-giant",
      prefixes: new Set(["--scale-"]),
    },
    {
      classname: "skew-subtle",
      prefixes: new Set(["--skew-"]),
    },
    {
      classname: "origin-card-hinge",
      prefixes: new Set(["--origin-"]),
    },
    {
      classname: "translate-popup",
      prefixes: new Set(["--translate-"]),
    },
    /*
     * Interactivity
     */
    {
      classname: "caret-coke-red",
      prefixes: new Set(["--caret-color-"]),
    },
    {
      classname: "cursor-vulkan",
      prefixes: new Set(["--cursor-"]),
    },
    {
      classname: "scroll-m-cozy",
      prefixes: new Set(["--scroll-margin-"]),
    },
    {
      classname: "scroll-p-xs",
      prefixes: new Set(["--scroll-padding-"]),
    },
    /*
     * SVG
     */
    {
      classname: "fill-ikea-blue",
      prefixes: new Set(["--fill-"]),
    },
    {
      classname: "stroke-ikea-yellow",
      prefixes: new Set(["--stroke-", "--stroke-width-"]),
    },
    {
      classname: "stroke-hairline",
      prefixes: new Set(["--stroke-", "--stroke-width-"]),
    },
    /*
     * Accessibility
     */
  ].map(({ classname, prefixes }) => {
    expect(getThemeKeyPrefixesFromClassname(theme, classname)).toEqual(
      prefixes,
    );
  });
});
