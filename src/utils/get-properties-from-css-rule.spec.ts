import { expect, test } from "vitest";

import { getPropertiesFromCssRule } from "./get-properties-from-css-rule";

test(`List properties from CSS rule`, () => {
  [
    {
      // Simple
      rule: `.outline-offset-0 { outline-offset: 0px; }`,
      props: new Set(["outline-offset"]),
    },
    {
      // Multiple properties
      rule: `.outline-2 { outline-style: var(--tw-outline-style); outline-width: 2px; }`,
      props: new Set(["outline-style", "outline-width"]),
    },
    {
      // Media query
      rule: `@media (prefers-color-scheme: dark) { .dark:bg-gray-700:where(.system,.system *) { background-color: var(--color-gray-700); } }`,
      props: new Set(["background-color"]),
    },
    {
      // Media query
      rule: `.font-semibold { --tw-font-weight: var(--font-weight-semibold); font-weight: var(--font-weight-semibold); }`,
      props: new Set(["--tw-font-weight", "font-weight"]),
    },
  ].map(({ rule, props }) => {
    expect(getPropertiesFromCssRule(rule)).toEqual(props);
  });
});
