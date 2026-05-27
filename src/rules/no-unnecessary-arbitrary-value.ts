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
  getBaseClassname,
  getModifiersPrefix,
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

const arbitraryRegEx = /^(?<classPrefix>.*?)-\[(?<arbitraryValue>.*)\]$/;

const checkArbitraryClassnames = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  // console.log(options);
  // console.log(settings);
  const genericContext = context as unknown as GenericRuleContext;
  for (const node of literals) {
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, genericContext);
    // Process the extracted classnames and report
    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);
    for (const [index, targetClassName] of classNames.entries()) {
      const baseClass = getBaseClassname(targetClassName);
      const negativePrefix = baseClass.startsWith("-") ? "-" : "";
      const absBaseClass = negativePrefix ? baseClass.slice(1) : baseClass;
      const modifiers = getModifiersPrefix(targetClassName);
      const match = absBaseClass.match(arbitraryRegEx);

      if (!match?.groups) continue;

      // if arbitrary value matches a preset value, report it as an error
      const theme = loadThemeWorker(settings.cssConfigPath);
      // Get the config prefix based on the classname (e.g. `aspect-[...]` => `--aspect-`)
      const prefixes = getThemeKeyPrefixesFromClassname(absBaseClass);
      // Retrieves all the keys for the config prefix (e.g. `--aspect-` => `--aspect-auto`, `--aspect-square`, `--aspect-video`, etc.)
      const presets = getThemePresetsFromPrefixes(theme, prefixes);
      // new Map([["--stroke-width-hairline", "0.5"]])
      const { classPrefix = "", arbitraryValue = "" } = match.groups;
      const compressed = compressTailwindArbitrary(arbitraryValue);
      // Filter the list of keys to keep only the ones that match the arbitrary value pattern (e.g. `aspect-video` matches the arbitrary value "16/9")
      const matchingPresets: Array<string> = [];
      for (const prefix of prefixes) {
        for (const [key, value] of presets.entries()) {
          if (!key.startsWith(prefix)) continue;
          const presetName = key.slice(prefix.length);
          const converted = toTailwindArbitrary(value);
          if (converted === compressed) {
            matchingPresets.push(
              `${modifiers}${negativePrefix}${classPrefix}-${presetName}`,
            );
          }
        }
      }
      // If several keys are found we use suggestions instead of a fix, otherwise we can directly fix the classname
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

// TODO new rule to check
// --text-tiny: 0.625rem; /* text-tiny */
// /* https://tailwindcss.com/docs/font-size#customizing-your-theme */
// --text-tiny--line-height: 1.5rem; /* text-tiny-line-height */
// --text-tiny--letter-spacing: 0.125rem; /* text-tiny-letter-spacing */
// --text-tiny--font-weight: 500; /* text-tiny-font-weight */
// for unnecessary line-height, letter-spacing and font-weight classnames
