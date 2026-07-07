/**
 * @fileoverview Avoid unjustified arbitrary classnames.
 * @author François Massart
 */

import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext as TSESLintRuleContext } from "@typescript-eslint/utils/ts-eslint";

import urlCreator from "../url-creator";
import { compressTailwindArbitrary } from "../utils/compress-tailwind-arbitrary";
import {
  getThemeKeyPrefixesFromClassname,
  getThemePresetsFromPrefixes,
} from "../utils/get-theme-key-prefixes-from-classname";
import { joiner } from "../utils/joiner";
import { joinListElements } from "../utils/list-formatter";
import {
  parsePluginSettings,
  PluginSettings,
} from "../utils/parse-plugin-settings";
import {
  allowsGenericNumbers,
  getBaseClassname,
  getModifiersPrefix,
  hasPxNativePreset,
  supportsSpacing,
} from "../utils/parser/classname";
import {
  dissectAtomicNode,
  generateLocForClassname,
  getClassnamesFromValue,
} from "../utils/parser/node";
import { defineVisitors, GenericRuleContext } from "../utils/parser/visitors";
import {
  AtomicNode,
  createScriptVisitors,
  createTemplateVisitors,
} from "../utils/rule";
import { loadThemeWorker } from "../utils/tailwindcss-api";
import { toTailwindArbitrary } from "../utils/to-tailwind-arbitrary";
import { convertStringValueToPx } from "../utils/units";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "no-unnecessary-arbitrary-value";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds =
  | "issue:unnecessary-arbitrary"
  | "fix:unnecessary-arbitrary";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

const arbitraryRegEx = /^(?<classPrefix>[^[]+)-\[(?<arbitraryValue>[^\]]+)\]$/u;

const checkArbitraryClassnames = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  const genericContext = context as unknown as GenericRuleContext;

  const theme = loadThemeWorker(settings.cssConfigPath, context.filename);

  for (const node of literals) {
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, genericContext);

    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);

    for (const [index, targetClassName] of classNames.entries()) {
      // Very early escape hatch
      if (!targetClassName.includes("[")) continue;

      // e.g. "dark:-m-[5px]" → "-m-[5px]"
      const baseClass = getBaseClassname(targetClassName);
      const negativePrefix = baseClass.startsWith("-") ? "-" : "";
      // e.g. "-m-[5px]" → "m-[5px]"
      const absBaseClass = negativePrefix ? baseClass.slice(1) : baseClass;

      // e.g. "m-[5px]" → { classPrefix: "m", arbitraryValue: "5px" }
      const match = absBaseClass.match(arbitraryRegEx);
      if (!match?.groups) continue;

      // e.g. "dark:-m-[5px]" → "dark:"
      const modifiers = getModifiersPrefix(targetClassName);

      // Get the config prefix based on the classname
      // e.g. "divide-x-abc" → ["--color-", "--border-color-", "--divide-color-"]
      const prefixes = getThemeKeyPrefixesFromClassname(absBaseClass);

      // Should not happen, but just in case
      if (prefixes.size === 0) continue;

      // Retrieves all the possible keys
      const presetKeys = getThemePresetsFromPrefixes(theme, prefixes);

      const acceptGenericNumberSuffix = allowsGenericNumbers(absBaseClass);

      // No chance of finding a match
      if (presetKeys.size === 0 && !acceptGenericNumberSuffix) continue;

      const { classPrefix = "", arbitraryValue = "" } = match.groups;

      const compressedArbitraryValue =
        compressTailwindArbitrary(arbitraryValue);
      const matchingPresets: Array<string> = [];

      // 1. Highest priority: Looking into the defined presets for EXACT matches
      for (const prefix of prefixes) {
        for (const [presetKey, presetValue] of presetKeys.entries()) {
          // Does not match
          if (!presetKey.startsWith(prefix)) continue;

          const compressedPresetValue = toTailwindArbitrary(presetValue);
          if (compressedPresetValue === compressedArbitraryValue) {
            const presetName = presetKey.slice(prefix.length);
            matchingPresets.push(
              `${modifiers}${negativePrefix}${classPrefix}-${presetName}`,
            );
          }
        }
      }

      if (matchingPresets.length === 0 && !acceptGenericNumberSuffix) continue;

      // 2. Check against generic numbers e.g. `z-[0]`
      if (/^-?\d+(?:\.\d+)?$/.test(compressedArbitraryValue)) {
        let computedValue = compressedArbitraryValue;
        let isNegative = !!negativePrefix;
        // Faster than `.startsWith("-")`
        // eslint-disable-next-line unicorn/prefer-code-point
        if (compressedArbitraryValue.charCodeAt(0) === 45) {
          computedValue = computedValue.slice(1);
          isNegative = !isNegative;
        }
        matchingPresets.push(
          `${modifiers}${isNegative ? "-" : ""}${classPrefix}-${computedValue}`,
        );
      }

      // 3. Check for px native presets e.g. `my-[1px]` → `my-px`
      if (
        matchingPresets.length === 0 &&
        ["-1px", "1px"].includes(compressedArbitraryValue) &&
        hasPxNativePreset(absBaseClass)
      ) {
        let isNegative = !!negativePrefix;
        // Faster than `.startsWith("-")`
        // eslint-disable-next-line unicorn/prefer-code-point
        if (compressedArbitraryValue.charCodeAt(0) === 45)
          isNegative = !isNegative;
        matchingPresets.push(
          `${modifiers}${isNegative ? "-" : ""}${classPrefix}-px`,
        );
      }

      // 4. Finally, check for spacing based presets e.g. `my-[2px]` → `my-2` (if spacing is 1px)
      if (matchingPresets.length === 0 && supportsSpacing(absBaseClass)) {
        // TODO 1. compressedArbitraryValue compatible ? <number>px, <number>rem, <number>, etc.
        const spacingPresets = getThemePresetsFromPrefixes(
          theme,
          new Set(["--spacing"]),
        );
        let spacingValue = "0.25rem"; // Fallback default
        if (spacingPresets.has("--spacing")) {
          spacingValue = spacingPresets.get("--spacing") as string;
        }

        // Convert spacingValue to px
        const spacingValueInPx = convertStringValueToPx(spacingValue);
        // Convert compressedArbitraryValue to px
        const valueInPx = convertStringValueToPx(compressedArbitraryValue);
        if (valueInPx === undefined || spacingValueInPx === undefined) continue;
        const genericPresetValue = valueInPx / spacingValueInPx;
        // Only accepts integer values for now
        if (Number.isInteger(genericPresetValue)) {
          matchingPresets.push(
            `${modifiers}${negativePrefix}${classPrefix}-${genericPresetValue}`,
          );
        }
      }

      if (matchingPresets.length === 0) continue;

      // The location of the problematic classname
      const patchedLoc = generateLocForClassname(
        node,
        targetClassName,
        originalClassNamesValue,
        genericContext,
      );

      const withQuotes = matchingPresets.map((cls) => `'${cls}'`);
      const verbosePatches = joinListElements(withQuotes);

      context.report({
        loc: patchedLoc,
        messageId: "issue:unnecessary-arbitrary",
        data: {
          arbitraryClass: targetClassName,
          presetClasses: verbosePatches,
        },
        suggest: matchingPresets.map((cls) => {
          return {
            messageId: "fix:unnecessary-arbitrary",
            data: {
              arbitraryClass: targetClassName,
              presetClass: cls,
            },
            fix: (fixer) => {
              const clonedClassNames = [...classNames];
              // Patch the problematic classname
              clonedClassNames[index] = cls;
              // Generates the "cleaned" attribute value
              const patchedValue = joiner({
                classNames: clonedClassNames,
                whitespaces,
                headSpace,
                tailSpace,
                validator: (candidate) => candidate !== targetClassName,
              });
              return fixer.replaceTextRange(
                [start, end],
                prefix + patchedValue + suffix,
              );
            },
          };
        }),
      });
    }
  }
};

export const noUnnecessaryArbitraryValue = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Avoid unjustified arbitrary classnames.",
    },
    hasSuggestions: true,
    messages: {
      "issue:unnecessary-arbitrary": `No need for arbitrary '{{arbitraryClass}}', use {{presetClasses}} instead`,
      "fix:unnecessary-arbitrary": `Replace '{{arbitraryClass}}' by '{{presetClass}}'`,
    },
    fixable: "code",
    // Schema is also parsed by `eslint-doc-generator`
    schema: [
      {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    ],
    defaultOptions: [{}],
    type: "problem",
  },
  /**
   * About `defaultOptions`:
   * - `defaultOptions` is not parsed to generate the documentation
   * - `defaultOptions` is used when options are NOT provided in the rules configuration
   * - If some configuration is provided as the second argument, `defaultOptions` is ignored completely (not merged)
   * - In other words, the `defaultOptions` is only used when the rule is used WITHOUT any configuration
   */
  defaultOptions: [{}],
  create: (context, options) => {
    // Merged settings
    const settings = parsePluginSettings(context.settings);

    return defineVisitors(
      context as unknown as Readonly<GenericRuleContext>,
      // Template visitor is only used within Vue SFC files (inside <template> section).
      createTemplateVisitors(
        context,
        settings,
        options,
        checkArbitraryClassnames,
      ),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(
        context,
        settings,
        options,
        checkArbitraryClassnames,
      ),
    );
  },
});
