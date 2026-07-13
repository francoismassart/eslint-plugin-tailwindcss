/**
 * @fileoverview In v3 you could mark a utility as important by placing an `!` at the beginning of the utility name (but after any variants).
 * In v4 you should place the `!` at the very end of the class name instead. The old way is still supported for compatibility but is deprecated.
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

export { ESLintUtils } from "@typescript-eslint/utils";

export const RULE_NAME = "important-modifier-suffix";

// Message IDs don't need to be prefixed, I just find it easier to keep track of them this way
export type MessageIds = "issue:important-modifier-prefix";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

// The Rule creator returns a function that is used to create a well-typed ESLint rule
// The parameter passed into RuleCreator is a URL generator function.
export const createRule = RuleCreator(urlCreator);

const importantPrefixClassnames = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  const genericContext = context as unknown as GenericRuleContext;

  // Session cache to avoid re-testing identical classes within the same node/file
  const checkedClasses = new Set<string>();

  const totalLiterals = literals.length;
  for (let index = 0; index < totalLiterals; index++) {
    const node = literals[index];
    const { originalClassNamesValue, start, end, prefix, suffix } =
      dissectAtomicNode(node, genericContext);

    // Early escape if the value is falsy or doesn't contain any brackets (no arbitrary value possible)
    if (!originalClassNamesValue || !originalClassNamesValue.includes("!"))
      continue;

    // 1. Gather invalid classes in the node
    const invalidClassesInNode: Array<{
      classname: string;
      patched: string;
      type: string;
    }> = [];

    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);
    const classNamesLength = classNames.length;
    const patchedClassNames = [...classNames];

    for (let index = 0; index < classNamesLength; index++) {
      const targetClassName = classNames[index];

      // Individual early escape for classnames that don't contain brackets
      if (!targetClassName.includes("!")) continue;

      // Local cache
      if (checkedClasses.has(targetClassName)) continue;
      checkedClasses.add(targetClassName);

      const modifiers = getModifiersPrefix(targetClassName);
      const baseClass = getBaseClassname(targetClassName);

      if (!baseClass.startsWith("!")) {
        continue;
      }

      const patched = `${modifiers}${baseClass.slice(1)}!`;
      invalidClassesInNode.push({
        classname: targetClassName,
        patched: patched,
        type: node.type,
      });
      patchedClassNames[index] = patched;
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
          classNames: patchedClassNames,
          whitespaces,
          headSpace,
          tailSpace,
        });

        patchedValue = prefix + patchedValue + suffix;
      }
      context.report({
        loc: patchedLoc,
        messageId: "issue:important-modifier-prefix",
        data: {
          className: invalidClass.classname,
          patchedClassName: invalidClass.patched,
        },
        fix: fixable
          ? (fixer) => fixer.replaceTextRange([start, end], patchedValue)
          : undefined,
      });
    }
  }
};

export const importantModifierSuffix = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "In v4 you should place the `!` at the very end of the class name.",
    },
    messages: {
      "issue:important-modifier-prefix":
        "Class '{{className}}' should place '!' at the very end ('{{patchedClassName}}')",
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
        importantPrefixClassnames,
      ),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(
        context,
        settings,
        options,
        importantPrefixClassnames,
      ),
    );
  },
});
