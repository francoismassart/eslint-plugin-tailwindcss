/**
 * @fileoverview Avoid using multiple Tailwind CSS classnames when not required
 * @example "mx-3 my-3" could be replaced by "m-3"
 * @author François Massart
 */

import { TSESTree } from "@typescript-eslint/utils";
import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext as TSESLintRuleContext } from "@typescript-eslint/utils/ts-eslint";

import urlCreator from "../url-creator";
import { joiner } from "../utils/joiner";
import {
  parsePluginSettings,
  PluginSettings,
} from "../utils/parse-plugin-settings";
import { groupByModifiersPrefix } from "../utils/parser/groups";
import {
  dissectAtomicNode,
  getClassnamesFromValue,
} from "../utils/parser/node";
import { defineVisitors, GenericRuleContext } from "../utils/parser/visitors";
import {
  AtomicNode,
  createScriptVisitors,
  createTemplateVisitors,
} from "../utils/rule";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "enforces-shorthand";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds = "fix:use-shorthand";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

const detectShorthand = ({
  classNames,
  pattern,
  strategies,
}: {
  classNames: Array<string>;
  pattern: RegExp;
  strategies: Map<string, Array<string>>;
}) => {
  const shorthands = new Map<string, Array<string>>();
  const candidates = new Map<string, Array<string>>();

  // Filter related classes
  const targets = classNames.filter((cls) => pattern.test(cls));

  // Escape hatch
  if (targets.length <= 1) return shorthands;

  // Grouped by value
  for (const cls of targets) {
    const match = cls.match(pattern);
    if (match && match.groups) {
      const { prefix, value } = match.groups;
      if (!prefix) continue;
      // `value` group can be omitted for some shorthands
      // like for `truncate` (which replaces `overflow-hidden` + `text-ellipsis` + `whitespace-nowrap`)
      const valueKey = value || "";
      if (!candidates.has(valueKey)) candidates.set(valueKey, []);
      candidates.get(valueKey)?.push(prefix);
    }
  }

  // Check each value group for potential shorthands
  for (const [value, prefixes] of candidates.entries()) {
    // Escape hatch
    if (prefixes.length <= 1) continue;
    // Handle potential negative values
    const negativeCandidates = prefixes.filter((p) => p.startsWith("-"));
    const positiveCandidates = prefixes.filter((p) => !p.startsWith("-"));
    for (const [index, candidatePrefixes] of [
      negativeCandidates,
      positiveCandidates,
    ].entries()) {
      const n = index === 0 ? "-" : "";
      for (const [shorthand, parts] of strategies.entries()) {
        if (parts.every((part) => candidatePrefixes.includes(`${n}${part}`))) {
          const valueSuffix = value ? `-${value}` : "";
          shorthands.set(
            `${n}${shorthand}${valueSuffix}`,
            parts.map((part) => `${n}${part}${valueSuffix}`),
          );
        }
      }
    }
  }

  // shorthands → Map(1) { '-my-10' => [ '-mt-10', '-mb-10' ] }
  return shorthands;
};

const detectOverflowShorthand = (classNames: Array<string>) => {
  const pattern =
    /^(?<prefix>overflow-(x|y))-(?<value>auto|hidden|clip|visible|scroll)$/;
  const strategies = new Map<string, Array<string>>();
  strategies.set("overflow", ["overflow-x", "overflow-y"]);
  return detectShorthand({ classNames, pattern, strategies });
};

const detectOverscrollShorthand = (classNames: Array<string>) => {
  const pattern = /^(?<prefix>overscroll-(x|y))-(?<value>auto|contain|none)$/;
  const strategies = new Map<string, Array<string>>();
  strategies.set("overscroll", ["overscroll-x", "overscroll-y"]);
  return detectShorthand({ classNames, pattern, strategies });
};

const detectTopRightBottomLeftShorthand = (classNames: Array<string>) => {
  const pattern =
    /^(?<prefix>-?(inset(-(x|y))?|top|right|bottom|left))-(?<value>.+)$/;
  const strategies = new Map<string, Array<string>>();
  strategies.set("inset-x", ["right", "left"]);
  strategies.set("inset-y", ["top", "bottom"]);
  strategies.set("inset", ["inset-x", "inset-y"]);
  return detectShorthand({ classNames, pattern, strategies });
};

const detectGapShorthand = (classNames: Array<string>) => {
  const pattern = /^(?<prefix>(gap(-(x|y))?))-(?<value>.+)$/;
  const strategies = new Map<string, Array<string>>();
  strategies.set("gap", ["gap-x", "gap-y"]);
  return detectShorthand({ classNames, pattern, strategies });
};

const detectPaddingShorthand = (classNames: Array<string>) => {
  const pattern = /^(?<prefix>-?(?:p|px|py|pt|pb|pl|pr))-(?<value>.+)$/;
  const strategies = new Map<string, Array<string>>();
  strategies.set("px", ["pl", "pr"]);
  strategies.set("py", ["pt", "pb"]);
  strategies.set("p", ["px", "py"]);
  return detectShorthand({ classNames, pattern, strategies });
};

const detectMarginShorthand = (classNames: Array<string>) => {
  const pattern = /^(?<prefix>-?(?:m|mx|my|mt|mb|ml|mr))-(?<value>.+)$/;
  const strategies = new Map<string, Array<string>>();
  strategies.set("mx", ["ml", "mr"]);
  strategies.set("my", ["mt", "mb"]);
  strategies.set("m", ["mx", "my"]);
  return detectShorthand({ classNames, pattern, strategies });
};

const detectSizeShorthand = (classNames: Array<string>) => {
  const pattern = /^(?<prefix>-?(?:w|h))-(?<value>.+)$/;
  const strategies = new Map<string, Array<string>>();
  strategies.set("size", ["w", "h"]);
  return detectShorthand({ classNames, pattern, strategies });
};

const detectTruncateShorthand = (classNames: Array<string>) => {
  const pattern =
    /^(?<prefix>(?:overflow-hidden|text-ellipsis|whitespace-nowrap))$/;
  const strategies = new Map<string, Array<string>>();
  strategies.set("truncate", [
    "overflow-hidden",
    "text-ellipsis",
    "whitespace-nowrap",
  ]);
  return detectShorthand({ classNames, pattern, strategies });
};

// rounded s e t r b l ss se ee es tl tr br bl https://tailwindcss.com/docs/border-radius
const detectRoundedShorthand = (classNames: Array<string>) => {
  const pattern =
    /^(?<prefix>(rounded(-(s|e|t|r|b|l|ss|se|ee|es|tl|tr|br|bl))?))-(?<value>.+)$/;
  const strategies = new Map<string, Array<string>>();
  strategies.set("rounded-t", ["rounded-tl", "rounded-tr"]);
  strategies.set("rounded-t", ["rounded-ss", "rounded-se"]);
  strategies.set("rounded-r", ["rounded-tr", "rounded-br"]);
  strategies.set("rounded-b", ["rounded-bl", "rounded-br"]);
  strategies.set("rounded-b", ["rounded-ee", "rounded-es"]);
  strategies.set("rounded-l", ["rounded-tl", "rounded-bl"]);
  strategies.set("rounded", ["rounded-t", "rounded-b"]);
  strategies.set("rounded", ["rounded-l", "rounded-r"]);
  strategies.set("rounded", ["rounded-s", "rounded-e"]);
  return detectShorthand({ classNames, pattern, strategies });
};

const replaceByShorthands = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  // console.log(options);
  for (const node of literals) {
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, context as unknown as GenericRuleContext);
    // Process the extracted classnames and report
    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);
    // Skip empty/Single className
    if (classNames.length <= 1) continue;

    // Group by modifier
    const groups = groupByModifiersPrefix(classNames);

    for (const [modifiers, baseCls] of groups.entries()) {
      if (baseCls.length <= 1) continue;

      const overflowClasses = detectOverflowShorthand(baseCls);
      const overscrollClasses = detectOverscrollShorthand(baseCls);
      const topRightBottomLeftClasses =
        detectTopRightBottomLeftShorthand(baseCls);
      const gapClasses = detectGapShorthand(baseCls);
      const paddingClasses = detectPaddingShorthand(baseCls);
      const marginClasses = detectMarginShorthand(baseCls);
      const sizeClasses = detectSizeShorthand(baseCls);
      // TODO ? https://tailwindcss.com/docs/font-size vs https://tailwindcss.com/docs/line-height combo
      const truncateClasses = detectTruncateShorthand(baseCls);
      const roundedClasses = detectRoundedShorthand(baseCls);
      // border x y s e bs be t r b l https://tailwindcss.com/docs/border-width
      // border color x y s e bs be t r b l
      // border-spacing-x y
      // scale x y z => scale scale-3d
      // skew x y
      // translate x y z => translate translate-3d
      // scroll-m trbl x y...
      // scroll-p...

      const allShorthands = new Map<string, Array<string>>([
        ...overflowClasses.entries(),
        ...overscrollClasses.entries(),
        ...topRightBottomLeftClasses.entries(),
        ...gapClasses.entries(),
        ...paddingClasses.entries(),
        ...marginClasses.entries(),
        ...sizeClasses.entries(),
        ...truncateClasses.entries(),
        ...roundedClasses.entries(),
      ]);

      for (const [shorthand, obsoleteClasses] of allShorthands.entries()) {
        const fullObsoleteClasses = new Set(
          obsoleteClasses.map((cls) => `${modifiers}${cls}`),
        );

        const parsedClassNames = classNames.filter(
          (cls) => !fullObsoleteClasses.has(cls),
        );
        parsedClassNames.push(modifiers + shorthand);

        // Generates the validated/sorted attribute value
        let validatedClassNamesValue = joiner({
          classNames: parsedClassNames,
          whitespaces,
          headSpace,
          tailSpace,
        });

        if (originalClassNamesValue !== validatedClassNamesValue) {
          // console.log("originalClassNamesValue:", [originalClassNamesValue]);
          // console.log("validatedClassNamesValue:", [validatedClassNamesValue]);
          validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;
          context.report({
            node: node as TSESTree.Node,
            messageId: "fix:use-shorthand",
            data: {
              classnames: obsoleteClasses
                .map((cls) => `'${modifiers + cls}'`)
                .join(", "),
              shorthand: `${modifiers}${shorthand}`,
            },
            fix: function (fixer) {
              return fixer.replaceTextRange(
                [start, end],
                validatedClassNamesValue,
              );
            },
          });
        }
      }
    }
  }
};

export const enforcesShorthand = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Avoid using multiple Tailwind CSS classnames when not required.",
    },
    hasSuggestions: false,
    messages: {
      "fix:use-shorthand": `Classnames {{classnames}} could be replaced by the '{{shorthand}}' shorthand!`,
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
    type: "suggestion",
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
      createTemplateVisitors(context, settings, options, replaceByShorthands),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(context, settings, options, replaceByShorthands),
    );
  },
});
