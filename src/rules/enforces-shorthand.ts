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

export const SHORTHAND_RULES: Record<string, ShorthandRule> = {
  padding: {
    // p, px, py, pt, pb, pl, pr, ps, pe, pbs, pbe
    pattern: /^(?<negative>)(?<prefix>p[xytbrlse]?|p(bs|be))-(?<value>.+)$/,
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
    pattern: /^(?<negative>-?)(?<prefix>m[xytbrlse]?|m(bs|be))-(?<value>.+)$/,
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
      /^(?<negative>)(?<prefix>border-[xytbrlse]|border-(bs|be))(-(?<value>.+))?$/,
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
      /^(?<negative>-?)(?<prefix>scroll-m[xytbrlse]?|scroll-m(bs|be))-(?<value>.+)$/,
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
      /^(?<negative>)(?<prefix>scroll-p[xytbrlse]?|scroll-p(bs|be))-(?<value>.+)$/,
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

const detectShorthands = (
  classNames: Array<string>,
  strategy: ShorthandRule,
): Map<string, Array<string>> => {
  const shorthands = new Map<string, Array<string>>();
  // We group by "sign + value" (e.g., "-100" and "100" are two distinct groups)
  const candidates = new Map<
    string,
    { negative: string; value: string; prefixes: Set<string> }
  >();

  for (let index = 0, total = classNames.length; index < total; index++) {
    const cls = classNames[index];
    const match = cls.match(strategy.pattern);
    if (!match?.groups) continue;

    const { negative = "", prefix, value = "" } = match.groups;
    const groupKey = `${negative}${value}`; // e.g. "-100"

    let data = candidates.get(groupKey);
    if (!data) {
      data = { negative, value, prefixes: new Set() };
      candidates.set(groupKey, data);
    }
    data.prefixes.add(prefix);
  }

  for (const data of candidates.values()) {
    const { negative, value, prefixes } = data;

    for (const [shorthand, combos] of Object.entries(strategy.strategies)) {
      for (let index = 0, total = combos.length; index < total; index++) {
        const combo = combos[index];

        let matchAll = true;
        for (const element of combo) {
          if (!prefixes.has(element)) {
            matchAll = false;
            break;
          }
        }

        if (matchAll) {
          const suffix = value ? `-${value}` : "";
          const resourceKey = `${negative}${shorthand}${suffix}`;
          const result = combo.map((p) => `${negative}${p}${suffix}`);
          shorthands.set(resourceKey, result);
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

  for (let n = 0, nLength = literals.length; n < nLength; n++) {
    const node = literals[n];
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, genericContext);

    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);
    if (classNames.length <= 1) continue;

    const groups = groupByModifiersPrefix(classNames);

    for (const [modifiers, baseCls] of groups.entries()) {
      if (baseCls.length <= 1) continue;

      const strategies = Object.values(SHORTHAND_RULES);
      for (let s = 0, sLength = strategies.length; s < sLength; s++) {
        const found = detectShorthands(baseCls, strategies[s]);

        for (const [shorthand, obsolete] of found) {
          const fullObsolete = new Set(obsolete.map((c) => `${modifiers}${c}`));
          const newShorthand = `${modifiers}${shorthand}`;
          const joinedObsolete = [...fullObsolete]
            .map((c) => `'${c}'`)
            .join(", ");

          const cleanBaseClassNames = classNames.filter(
            (cls) => !fullObsolete.has(cls),
          );
          cleanBaseClassNames.push(newShorthand);

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
                classnames: joinedObsolete,
                shorthand: newShorthand,
              },
              fix: (fixer) => {
                const validatedValue =
                  prefix +
                  joiner({
                    classNames: cleanBaseClassNames,
                    whitespaces,
                    headSpace,
                    tailSpace,
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
        "Classnames {{classnames}} could be replaced by the '{{shorthand}}' shorthand",
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
