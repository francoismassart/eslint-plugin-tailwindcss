/**
 * @fileoverview Detects classnames which do not belong to Tailwind CSS.
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
import { passRegexTest } from "../utils/parser/classname";
import {
  dissectAtomicNode,
  generateLocForClassname,
  getClassnamesFromValue,
} from "../utils/parser/node";
import {
  appendProgramExitVisitor,
  defineVisitors,
  GenericRuleContext,
} from "../utils/parser/visitors";
import {
  AtomicNode,
  createScriptVisitors,
  createTemplateVisitors,
} from "../utils/rule";
import { isValidClassNamesWorker } from "../utils/tailwindcss-api";

export const RULE_NAME = "no-custom-classname";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds =
  | "issue:unknown-classname"
  | "fix:unknown-classname:remove";

export type RuleOptions = {
  whitelist: Array<string>;
};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

interface PreparedWhitelist {
  exactMatches: Set<string>;
  regexPatterns: Array<string>;
}

const prepareWhitelist = (
  whitelistOptions: Array<string> = [],
): PreparedWhitelist => {
  // Backslash, a dot, an asterisk, etc., we treat it as a regex
  const regexMagicSymbols = /[\\[\]{}()*+?^$|]/;

  const exactMatches = new Set(["dark", "group", "peer"]);
  const regexPatterns: Array<string> = [String.raw`(?:group|peer)\/[\w-]+`];

  for (const item of whitelistOptions) {
    if (regexMagicSymbols.test(item)) {
      regexPatterns.push(item);
    } else {
      exactMatches.add(item);
    }
  }

  return { exactMatches, regexPatterns };
};

const detectCustomClassnames = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  const parsedOptions: RuleOptions = options || { whitelist: [] };

  // Setup whitelist filters
  const { exactMatches, regexPatterns } = prepareWhitelist(
    parsedOptions.whitelist,
  );
  const genericContext = context as unknown as GenericRuleContext;

  const preparedNodes = literals.map((node) => {
    const dissected = dissectAtomicNode(node, genericContext);
    const parsed = getClassnamesFromValue(dissected.originalClassNamesValue);
    const candidates = parsed.classNames.filter((customClass, index) => {
      if (index === 0 && dissected.ignoreFirst) return false;
      if (index === parsed.classNames.length - 1 && dissected.ignoreLast)
        return false;
      if (exactMatches.has(customClass)) return false;
      return !regexPatterns.some((pattern) =>
        passRegexTest(pattern, customClass),
      );
    });
    return { node, ...dissected, ...parsed, candidates };
  });

  const candidates = preparedNodes.flatMap((node) => node.candidates);
  const validity = isValidClassNamesWorker(
    settings.cssConfigPath,
    context.filename,
    candidates,
    settings,
  );
  const validByClassName = new Map<string, boolean>();
  for (const [index, candidate] of candidates.entries()) {
    validByClassName.set(candidate, validity[index]);
  }

  for (const preparedNode of preparedNodes) {
    const {
      node,
      originalClassNamesValue,
      start,
      end,
      prefix,
      suffix,
      classNames,
      whitespaces,
      headSpace,
      tailSpace,
      candidates: nodeCandidates,
    } = preparedNode;

    // 1. Gather invalid classes in the node
    const invalidClassesInNode: Array<{ classname: string; type: string }> = [];

    for (const customClass of nodeCandidates) {
      if (validByClassName.get(customClass)) continue;

      invalidClassesInNode.push({ classname: customClass, type: node.type });
    }

    // All classes are valid, skip to the next node
    if (invalidClassesInNode.length === 0) continue;

    // 2. Emit reports with a surgical fix (one class targeted)
    for (const invalidClass of invalidClassesInNode) {
      const fixable = invalidClass.type !== TSESTree.AST_NODE_TYPES.Identifier;
      const patchedLoc = generateLocForClassname(
        node,
        invalidClass.classname,
        originalClassNamesValue,
        genericContext,
      );

      // Generate the fix exclusive to THIS iteration of the class
      let patchedValue: string;
      if (fixable) {
        patchedValue = joiner({
          classNames,
          whitespaces,
          headSpace,
          tailSpace,
          // Only remove the current class, other invalid ones remain
          validator: (candidate) => candidate !== invalidClass.classname,
        });

        patchedValue = prefix + patchedValue + suffix;
      }
      context.report({
        loc: patchedLoc,
        messageId: "issue:unknown-classname",
        data: { classname: invalidClass.classname },
        suggest: fixable
          ? [
              {
                messageId: "fix:unknown-classname:remove",
                data: { classname: invalidClass.classname },
                fix: (fixer) =>
                  fixer.replaceTextRange([start, end], patchedValue),
              },
            ]
          : [],
      });
    }
  }
};

export const noCustomClassname = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Detects classnames which do not belong to Tailwind CSS.",
    },
    hasSuggestions: true,
    messages: {
      "issue:unknown-classname": `Classname '{{classname}}' is not a Tailwind CSS class`,
      "fix:unknown-classname:remove":
        "Remove unknown classname '{{classname}}'",
    },
    // Schema is also parsed by `eslint-doc-generator`
    schema: [
      {
        type: "object",
        properties: {
          whitelist: {
            description:
              "List of classnames to ignore (whitelist). Exact match or regular expression.",
            type: "array",
            items: { type: "string", minLength: 0 },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ whitelist: [] }],
    type: "suggestion",
  },
  /**
   * About `defaultOptions`:
   * - `defaultOptions` is not parsed to generate the documentation
   * - `defaultOptions` is used when options are NOT provided in the rules configuration
   * - If some configuration is provided as the second argument, `defaultOptions` is ignored completely (not merged)
   * - In other words, the `defaultOptions` is only used when the rule is used WITHOUT any configuration
   */
  defaultOptions: [{ whitelist: [] }],
  create: (context, options) => {
    // Merged settings
    const settings = parsePluginSettings(context.settings);

    const literals: Array<AtomicNode> = [];
    const collectLiterals = (
      _context: RuleContext,
      _settings: PluginSettings,
      _options: RuleOptions,
      foundLiterals: Array<AtomicNode>,
    ) => literals.push(...foundLiterals);

    const visitors = defineVisitors(
      context as unknown as Readonly<GenericRuleContext>,
      // Template visitor is only used within Vue SFC files (inside <template> section).
      createTemplateVisitors(
        context,
        settings,
        options[0],
        collectLiterals,
      ),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(
        context,
        settings,
        options[0],
        collectLiterals,
      ),
    );

    return appendProgramExitVisitor(visitors, () =>
      detectCustomClassnames(context, settings, options[0], literals),
    );
  },
});
