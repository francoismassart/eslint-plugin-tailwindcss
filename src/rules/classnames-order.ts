/**
 * @fileoverview Enforces a consistent order for the Tailwind CSS classnames, based on the compiler.
 * @author François Massart
 */

import { TSESTree } from "@typescript-eslint/utils";
import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext as TSESLintRuleContext } from "@typescript-eslint/utils/ts-eslint";

import urlCreator from "../url-creator";
import { getCacheSettings, resetCache } from "../utils/cache";
import { joiner } from "../utils/joiner";
import {
  parsePluginSettings,
  PluginSettings,
} from "../utils/parse-plugin-settings";
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
import {
  clearWorkerCaches,
  getSortedClassNamesWorker,
} from "../utils/tailwindcss-api/index";

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "classnames-order";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds = "fix:sort";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

/**
 * Save the correct classnames order in a cache.
 * We only keep a string of classnames (with whitespaces)
 * @example "absolute flex"
 */
const correctClassOrderCache = new Set<string>();
let cacheCreationTime = Date.now();

const sortClassnames = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  // Cache settings
  const { cacheMaxSize, cacheMaxAge } = getCacheSettings(settings);
  // Clear the cache if it exceeds the maximum size or is too old
  const lastResetCorrect = resetCache(
    correctClassOrderCache,
    { cacheMaxSize, cacheMaxAge },
    cacheCreationTime,
  );
  if (lastResetCorrect !== -1) {
    correctClassOrderCache.clear();
    cacheCreationTime = Date.now();
    clearWorkerCaches();
  }
  // Main logic to check and report classnames order
  for (const node of literals) {
    const {
      originalClassNamesValue,
      start,
      end,
      prefix,
      suffix,
      ignoreFirst,
      ignoreLast,
    } = dissectAtomicNode(node, context as unknown as GenericRuleContext);

    // Process the extracted classnames and report
    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);

    const firstClass = ignoreFirst ? classNames.shift() : undefined;
    const lastClass = ignoreLast ? classNames.pop() : undefined;

    // Skip empty/Single className
    if (classNames.length <= 1) continue;

    const cacheKey = classNames.join(" ");

    if (correctClassOrderCache.has(cacheKey)) continue;

    const orderedClassNames = getSortedClassNamesWorker(
      settings.cssConfigPath,
      context.filename,
      classNames,
    );

    const orderedClassNamesKey = orderedClassNames.join(" ");
    if (cacheKey === orderedClassNamesKey) {
      correctClassOrderCache.add(cacheKey);
      continue; // Correct order -> next node now
    }

    // Shallow copy to avoid side effect due to reference
    // Modifying `orderedClassNames` directly would cause issues
    const patchedOrderedClassNames = [...orderedClassNames];
    if (firstClass) {
      patchedOrderedClassNames.unshift(firstClass);
    }
    if (lastClass) {
      patchedOrderedClassNames.push(lastClass);
    }

    // At this point, we are sure the order is invalid.
    let validatedClassNamesValue = joiner({
      classNames: patchedOrderedClassNames,
      whitespaces,
      headSpace,
      tailSpace,
    });

    validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;

    let fixApplied = false;
    // Report each classname that is not in the correct order
    for (const [index, className] of classNames.entries()) {
      if (className === orderedClassNames[index]) continue;

      const patchedLoc = generateLocForClassname(
        node,
        className,
        originalClassNamesValue,
        context as unknown as GenericRuleContext,
      );

      context.report({
        node: node as TSESTree.Node,
        loc: patchedLoc,
        messageId: "fix:sort",
        fix: fixApplied
          ? undefined
          : function (fixer) {
              fixApplied = true;
              return fixer.replaceTextRange(
                [start, end],
                validatedClassNamesValue,
              );
            },
      });
    }
  }
};

export const classnamesOrder = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Enforces a consistent order for the Tailwind CSS classnames, based on the compiler.",
    },
    hasSuggestions: false,
    messages: {
      "fix:sort": "Invalid Tailwind CSS classnames order",
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
      createTemplateVisitors(context, settings, options, sortClassnames),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(context, settings, options, sortClassnames),
    );
  },
});
