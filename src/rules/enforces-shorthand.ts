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
  generateLocForClassname,
  getClassnamesFromValue,
} from "../utils/parser/node";
import { defineVisitors, GenericRuleContext } from "../utils/parser/visitors";
import {
  AtomicNode,
  createScriptVisitors,
  createTemplateVisitors,
} from "../utils/rule";
import { isValidClassNameWorker } from "../utils/tailwindcss-api";

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

type ShorthandRule = {
  pattern: RegExp;
  strategies: Record<string, Array<Array<string>>>;
};

type ParsedCandidate = {
  negative: string;
  value: string;
  prefixes: Set<string>;
};

export const SHORTHAND_RULES: Record<string, ShorthandRule> = {
  padding: {
    // p, px, py, pt, pb, pl, pr, ps, pe, pbs, pbe
    pattern: /^(?<negative>)(?<prefix>p[xytbrlse]?|p(?:bs|be))-(?<value>.+)$/,
    strategies: {
      px: [
        ["pl", "pr"],
        ["ps", "pe"],
      ],
      py: [
        ["pt", "pb"],
        ["pbs", "pbe"],
      ],
      p: [["px", "py"]],
    },
  },
  margin: {
    // m, mx, my, mt, mb, ml, mr, ms, me, mbs, mbe
    pattern: /^(?<negative>-?)(?<prefix>m[xytbrlse]?|m(?:bs|be))-(?<value>.+)$/,
    strategies: {
      mx: [
        ["ml", "mr"],
        ["ms", "me"],
      ],
      my: [
        ["mt", "mb"],
        ["mbs", "mbe"],
      ],
      m: [["mx", "my"]],
    },
  },
  inset: {
    // top, right, bottom, left, inset, inset-x, inset-y
    pattern:
      /^(?<negative>-?)(?<prefix>inset(-[xy])?|top|right|bottom|left)-(?<value>.+)$/,
    strategies: {
      "inset-x": [["right", "left"]],
      "inset-y": [["top", "bottom"]],
      inset: [["inset-x", "inset-y"]],
    },
  },
  gap: {
    pattern: /^(?<negative>)(?<prefix>gap(-[xy])?)-(?<value>.+)$/,
    strategies: {
      gap: [["gap-x", "gap-y"]],
    },
  },
  size: {
    pattern: /^(?<negative>)(?<prefix>w|h)-(?<value>.+)$/,
    strategies: {
      size: [["w", "h"]],
    },
  },
  border: {
    // border-width, border-color
    pattern:
      /^(?<negative>)(?<prefix>border-[xytbrlse]|border-(?:bs|be))(-(?<value>.+))?$/,
    strategies: {
      "border-y": [
        ["border-t", "border-b"],
        ["border-bs", "border-be"],
      ],
      "border-x": [
        ["border-l", "border-r"],
        ["border-s", "border-e"],
      ],
      border: [["border-x", "border-y"]],
    },
  },
  borderSpacing: {
    pattern: /^(?<negative>)(?<prefix>border-spacing-[xy])-(?<value>.+)$/,
    strategies: {
      "border-spacing": [["border-spacing-x", "border-spacing-y"]],
    },
  },
  rounded: {
    pattern:
      /^(?<negative>-?)(?<prefix>rounded(?:-(?:ss|se|ee|es|tl|tr|br|bl|[stbrl]))?)-(?<value>[^-]+)$/,
    strategies: {
      "rounded-t": [
        ["rounded-tl", "rounded-tr"],
        ["rounded-ss", "rounded-se"],
      ],
      "rounded-r": [["rounded-tr", "rounded-br"]],
      "rounded-b": [
        ["rounded-bl", "rounded-br"],
        ["rounded-ee", "rounded-es"],
      ],
      "rounded-l": [["rounded-tl", "rounded-bl"]],
      rounded: [
        ["rounded-t", "rounded-b"],
        ["rounded-l", "rounded-r"],
        ["rounded-s", "rounded-e"],
      ],
    },
  },
  overflow: {
    pattern:
      /^(?<negative>)(?<prefix>overflow-[xy])-(?<value>auto|hidden|clip|visible|scroll)$/,
    strategies: {
      overflow: [["overflow-x", "overflow-y"]],
    },
  },
  overscroll: {
    pattern:
      /^(?<negative>)(?<prefix>overscroll-[xy])-(?<value>auto|contain|none)$/,
    strategies: {
      overscroll: [["overscroll-x", "overscroll-y"]],
    },
  },
  scale: {
    pattern: /^(?<negative>-?)(?<prefix>scale-[xy])-(?<value>.+)$/,
    strategies: {
      scale: [["scale-x", "scale-y"]],
    },
  },
  skew: {
    pattern: /^(?<negative>-?)(?<prefix>skew-[xy])-(?<value>.+)$/,
    strategies: {
      skew: [["skew-x", "skew-y"]],
    },
  },
  translate: {
    pattern: /^(?<negative>-?)(?<prefix>translate-[xy])-(?<value>.+)$/,
    strategies: {
      translate: [["translate-x", "translate-y"]],
    },
  },
  scrollMargin: {
    pattern:
      /^(?<negative>-?)(?<prefix>scroll-m[xytbrlse]?|scroll-m(?:bs|be))-(?<value>.+)$/,
    strategies: {
      "scroll-mx": [
        ["scroll-ml", "scroll-mr"],
        ["scroll-ms", "scroll-me"],
      ],
      "scroll-my": [
        ["scroll-mt", "scroll-mb"],
        ["scroll-mbs", "scroll-mbe"],
      ],
      "scroll-m": [["scroll-mx", "scroll-my"]],
    },
  },
  scrollPadding: {
    pattern:
      /^(?<negative>)(?<prefix>scroll-p[xytbrlse]?|scroll-p(?:bs|be))-(?<value>.+)$/,
    strategies: {
      "scroll-px": [
        ["scroll-pl", "scroll-pr"],
        ["scroll-ps", "scroll-pe"],
      ],
      "scroll-py": [
        ["scroll-pt", "scroll-pb"],
        ["scroll-pbs", "scroll-pbe"],
      ],
      "scroll-p": [["scroll-px", "scroll-py"]],
    },
  },
  truncate: {
    pattern:
      /^(?<negative>)(?<prefix>overflow-hidden|text-ellipsis|whitespace-nowrap)(?<value>)$/,
    strategies: {
      truncate: [["overflow-hidden", "text-ellipsis", "whitespace-nowrap"]],
    },
  },
};

// Perfs: avoid recreating strategy keys
const STRATEGY_ENTRIES = Object.entries(SHORTHAND_RULES);

const detectShorthands = (
  settings: PluginSettings,
  context: GenericRuleContext,
  classNames: Array<string>,
  shorthandRule: ShorthandRule,
): Map<string, Array<string>> => {
  const shorthands = new Map<string, Array<string>>();
  const candidates = new Map<string, ParsedCandidate>();

  // Step 1: Indexing in O(N)
  for (let index = 0, total = classNames.length; index < total; index++) {
    // e.g. `-mx-foo`
    const currentClass = classNames[index];

    const match = currentClass.match(shorthandRule.pattern);
    if (!match?.groups) continue;

    // e.g. `negative`: `-`, `prefix`: `mx`, `value`: `foo`
    const { negative = "", prefix, value = "" } = match.groups;

    // e.g. `groupKey`: `-foo`
    const groupKey = `${negative}${value}`;
    let groupData = candidates.get(groupKey);
    if (!groupData) {
      groupData = { negative, value, prefixes: new Set() };
      candidates.set(groupKey, groupData);
    }
    // e.g. `mx` is added to prefixes for the group value `-foo`
    groupData.prefixes.add(prefix);
  }

  // Step 2: Check combinations only on valid candidates
  // `candidates` keys be like `-foo` with prefixes like `Set { "mx", "my" }`)
  for (const currentCandidate of candidates.values()) {
    const { negative, value, prefixes } = currentCandidate;
    const suffixValue = value ? `-${value}` : "";

    // e.g. [`mx`, `my`, `m`] for the `margin` strategy
    const strategyKeys = Object.keys(shorthandRule.strategies);
    const totalStrategies = strategyKeys.length;
    for (let index = 0; index < totalStrategies; index++) {
      // e.g. `mx`
      const key = strategyKeys[index];
      // e.g. `mx` => [["ml", "mr"], ["ms", "me"]]
      const combos = shorthandRule.strategies[key];

      const totalCombos = combos.length;
      for (let index = 0; index < totalCombos; index++) {
        // e.g. `["ml", "mr"]`
        const combo = combos[index];
        const totalComboParts = combo.length;
        let matchEntireCombo = true;

        // Must have all the parts of the combo to be a valid shorthand candidate
        for (let index = 0; index < totalComboParts; index++) {
          if (!prefixes.has(combo[index])) {
            matchEntireCombo = false;
            break;
          }
        }

        if (matchEntireCombo) {
          // e.g. `-mx-foo` for the combo `["ml", "mr"]` with the key `mx`
          const shorthandClass = `${negative}${key}${suffixValue}`;

          // Final check e.g. for `size-screen` which does not exist
          if (
            !isValidClassNameWorker(
              settings.cssConfigPath,
              context.filename,
              shorthandClass,
            )
          )
            continue;

          // Using `Array.from({length}, callback)` would be less performant
          const longhandClasses: Array<string> = Array.from({
            length: totalComboParts,
          });
          for (let index = 0; index < totalComboParts; index++) {
            longhandClasses[index] = `${negative}${combo[index]}${suffixValue}`;
          }
          // e.g. `-mx-foo` => `["-ml-foo", "-mr-foo"]`
          shorthands.set(shorthandClass, longhandClasses);
        }
      }
    }
  }
  return shorthands;
};

const replaceByShorthands = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  const genericContext = context as unknown as GenericRuleContext;
  const totalLiterals = literals.length;

  for (let index = 0; index < totalLiterals; index++) {
    const node = literals[index];
    const {
      originalClassNamesValue,
      start,
      end,
      prefix,
      suffix,
      ignoreFirst,
      ignoreLast,
    } = dissectAtomicNode(node, genericContext);

    const classNamesObject = getClassnamesFromValue(originalClassNamesValue);
    let { classNames } = classNamesObject;

    const firstClass = ignoreFirst ? classNames.shift() : undefined;
    const lastClass = ignoreLast ? classNames.pop() : undefined;

    if (classNames.length <= 1) continue;

    const groups = groupByModifiersPrefix(classNames);

    for (const [modifiers, baseCls] of groups.entries()) {
      if (baseCls.length <= 1) continue;

      const total = STRATEGY_ENTRIES.length;
      // padding, margin...
      for (let index = 0; index < total; index++) {
        // e.g. Map(1) { 'mx' => [ 'ml', 'mr' ] }
        const foundReplacement = detectShorthands(
          settings,
          genericContext,
          baseCls,
          STRATEGY_ENTRIES[index][1],
        );

        for (const [shorthand, longhands] of foundReplacement) {
          // Prepend the modifiers to the longhands
          const fullObsolete = new Set(
            longhands.map((c) => `${modifiers}${c}`),
          );
          // Prepend the modifiers to the shorthand
          const newShorthand = `${modifiers}${shorthand}`;
          const joinedObsolete = [...fullObsolete];

          // Filter out the longhand classnames from the original classnames
          classNames = classNames.filter((cls) => !fullObsolete.has(cls));
          // ... and add the new shorthand
          classNames.push(newShorthand);

          for (const targetClassName of fullObsolete) {
            const patchedLoc = generateLocForClassname(
              node,
              targetClassName,
              originalClassNamesValue,
              genericContext,
            );

            context.report({
              node: node as TSESTree.Node,
              loc: patchedLoc,
              messageId: "fix:use-shorthand",
              data: {
                targetLonghand: targetClassName,
                otherLonghands: joinedObsolete
                  .filter((cls) => cls !== targetClassName)
                  .map((cls) => `'${cls}'`)
                  .join(", "),
                shorthand: newShorthand,
              },
              fix: (fixer) => {
                // Shallow copy to avoid side effect due to reference
                // Modifying `orderedClassNames` directly would cause issues
                const patchedClassNames = [...classNames];
                if (firstClass) {
                  patchedClassNames.unshift(firstClass);
                }
                if (lastClass) {
                  patchedClassNames.push(lastClass);
                }
                const validatedValue =
                  prefix +
                  joiner({
                    classNames: patchedClassNames,
                    whitespaces: classNamesObject.whitespaces,
                    headSpace: classNamesObject.headSpace,
                    tailSpace: classNamesObject.tailSpace,
                  }) +
                  suffix;
                return fixer.replaceTextRange([start, end], validatedValue);
              },
            });
          }
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
      "fix:use-shorthand":
        "'{{targetLonghand}}' can be merged with {{otherLonghands}} into '{{shorthand}}'",
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
