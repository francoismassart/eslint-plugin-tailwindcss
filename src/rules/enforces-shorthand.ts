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
) => {
  const shorthands = new Map<string, Array<string>>();
  // We group by "sign + value" (e.g., "-100" and "100" are two distinct groups)
  const candidates = new Map<
    string,
    { negative: string; value: string; prefixes: Set<string> }
  >();

  for (const cls of classNames) {
    const match = cls.match(strategy.pattern);
    if (!match?.groups) continue;

    const { negative = "", prefix, value = "" } = match.groups;
    const groupKey = `${negative}${value}`; // e.g. "-100"

    if (!candidates.has(groupKey)) {
      candidates.set(groupKey, { negative, value, prefixes: new Set() });
    }
    candidates.get(groupKey)?.prefixes.add(prefix);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, data] of candidates) {
    const { negative, value, prefixes } = data;
    for (const [shorthand, combos] of Object.entries(strategy.strategies)) {
      for (const combo of combos) {
        if (combo.every((p) => prefixes.has(p))) {
          const resourceKey = value
            ? `${negative}${shorthand}-${value}`
            : `${negative}${shorthand}`;
          const result = combo.map((p) =>
            value ? `${negative}${p}-${value}` : `${negative}${p}`,
          );
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
  for (const node of literals) {
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, context as unknown as GenericRuleContext);

    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);
    if (classNames.length <= 1) continue;

    const groups = groupByModifiersPrefix(classNames);
    let currentClassNames = [...classNames];

    for (const [modifiers, baseCls] of groups.entries()) {
      if (baseCls.length <= 1) continue;

      for (const strategy of Object.values(SHORTHAND_RULES)) {
        const found = detectShorthands(baseCls, strategy);

        for (const [shorthand, obsolete] of found) {
          const fullObsolete = new Set(obsolete.map((c) => `${modifiers}${c}`));
          const newShorthand = `${modifiers}${shorthand}`;

          currentClassNames = currentClassNames
            .filter((cls) => !fullObsolete.has(cls))
            // eslint-disable-next-line unicorn/prefer-spread
            .concat(newShorthand);

          context.report({
            node: node as TSESTree.Node,
            messageId: "fix:use-shorthand",
            data: {
              classnames: [...fullObsolete].map((c) => `'${c}'`).join(", "),
              shorthand: newShorthand,
            },
            fix: (fixer) => {
              const validatedValue =
                prefix +
                joiner({
                  classNames: currentClassNames,
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
