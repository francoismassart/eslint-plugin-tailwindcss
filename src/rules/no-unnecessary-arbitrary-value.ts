/**
 * @fileoverview Avoid unjustified arbitrary classnames.
 * @author François Massart
 */

import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import {
  RuleContext as TSESLintRuleContext,
  RuleFixer,
} from "@typescript-eslint/utils/ts-eslint";

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

const arbitraryRegEx =
  /^(?<classPrefix>[^[]+)-\[(?<arbitraryValue>[^\]]+)\]!?$/u;

/**
 * Determines final signs and absolute text fragments from arbitrary value configurations.
 */
function resolveValueSign(value: string, initiallyNegative: boolean) {
  // eslint-disable-next-line unicorn/prefer-code-point
  const isHyphen = value.charCodeAt(0) === 45; // '-'
  const finalIsNegative = isHyphen ? !initiallyNegative : initiallyNegative;
  const cleanedValue = isHyphen ? value.slice(1) : value;
  return { minusSign: finalIsNegative ? "-" : "", cleanedValue };
}

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
      let baseClass = getBaseClassname(targetClassName);
      let bang = "";

      if (baseClass.startsWith("!")) {
        bang = "!";
        baseClass = baseClass.slice(1);
      }
      if (baseClass.endsWith("!")) {
        bang = "!";
        baseClass = baseClass.slice(0, -1);
      }

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
      const { classPrefix = "", arbitraryValue = "" } = match.groups;
      const compressedArbitraryValue =
        compressTailwindArbitrary(arbitraryValue);
      const matchingPresets: Array<string> = [];

      // 1. Check for px native presets e.g. `my-[1px]` → `my-px`
      if (
        ["-1px", "1px"].includes(compressedArbitraryValue) &&
        hasPxNativePreset(absBaseClass)
      ) {
        const { minusSign } = resolveValueSign(
          compressedArbitraryValue,
          !!negativePrefix,
        );
        matchingPresets.push(`${modifiers}${minusSign}${classPrefix}-px`);
      }

      // 2. Looking into the defined presets for EXACT preset matches
      for (const currentPrefix of prefixes) {
        for (const [presetKey, presetValue] of presetKeys.entries()) {
          // Does not match
          if (!presetKey.startsWith(currentPrefix)) continue;

          const compressedPresetValue = toTailwindArbitrary(presetValue);
          const { minusSign, cleanedValue } = resolveValueSign(
            compressedArbitraryValue,
            !!negativePrefix,
          );

          if (compressedPresetValue === cleanedValue) {
            const presetName = presetKey.slice(currentPrefix.length);
            matchingPresets.push(
              `${modifiers}${minusSign}${classPrefix}-${presetName}${bang}`,
            );
          }
        }
      }

      // 3. Check against generic numbers e.g. `z-[0]`
      if (
        acceptGenericNumberSuffix &&
        /^-?\d+(?:\.\d+)?$/.test(compressedArbitraryValue)
      ) {
        const { minusSign, cleanedValue } = resolveValueSign(
          compressedArbitraryValue,
          !!negativePrefix,
        );
        matchingPresets.push(
          `${modifiers}${minusSign}${classPrefix}-${cleanedValue}${bang}`,
        );
      }

      // 4. Check for spacing based presets e.g. `my-[2px]` → `my-2`
      if (supportsSpacing(absBaseClass)) {
        const spacingPresets = getThemePresetsFromPrefixes(
          theme,
          new Set(["--spacing"]),
        );
        const spacingValue = spacingPresets.get("--spacing") || "0.25rem";

        const { minusSign, cleanedValue } = resolveValueSign(
          compressedArbitraryValue,
          !!negativePrefix,
        );

        const spacingValueInPx = convertStringValueToPx(spacingValue);
        const valueInPx = convertStringValueToPx(cleanedValue);

        if (valueInPx !== undefined && spacingValueInPx !== undefined) {
          const genericPresetValue = valueInPx / spacingValueInPx;

          if (Number.isInteger(genericPresetValue)) {
            matchingPresets.push(
              `${modifiers}${minusSign}${classPrefix}-${genericPresetValue}${bang}`,
            );
          }
        }
      }

      if (matchingPresets.length === 0) continue;

      const patchedLoc = generateLocForClassname(
        node,
        targetClassName,
        originalClassNamesValue,
        genericContext,
      );

      const withQuotes = matchingPresets.map((cls) => `'${cls}'`);
      const verbosePatches = joinListElements(withQuotes);

      const generateFixer = (cls: string) => {
        const fixer = (fixer: RuleFixer) => {
          const clonedClassNames = [...classNames];
          clonedClassNames[index] = cls;

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
        };
        return fixer;
      };

      context.report({
        loc: patchedLoc,
        messageId: "issue:unnecessary-arbitrary",
        data: {
          arbitraryClass: targetClassName,
          presetClasses: verbosePatches,
        },
        fix:
          matchingPresets.length === 0
            ? undefined
            : generateFixer(matchingPresets[0]),

        suggest: matchingPresets.slice(1).map((cls) => ({
          messageId: "fix:unnecessary-arbitrary",
          data: {
            arbitraryClass: targetClassName,
            presetClass: cls,
          },
          fix: generateFixer(cls),
        })),
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
