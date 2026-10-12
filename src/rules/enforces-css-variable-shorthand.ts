/**
 * @fileoverview In Tailwind CSS v3, `bg-[--brand]` was implicitly wrapped in `var()`.
 * In v4 it is not anymore (it compiles to `background-color: --brand;`) and the dedicated
 * CSS variable shorthand must be used instead: `bg-(--brand)`.
 * @see https://tailwindcss.com/docs/upgrade-guide#using-variables-in-arbitrary-values
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

export const RULE_NAME = "enforces-css-variable-shorthand";

export type MessageIds = "issue:css-variable-shorthand";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

export const createRule = RuleCreator(urlCreator);

// `!`? `-`? utility `-[` type-hint? `--`variable fallback? `]` `/modifier`? `!`?
const bracketedVariableRegex =
  /^(!?-?[a-z][\w-]*?-)\[((?:[a-z-]+:)?--[\w-]+(?:,[^\]]+)?)\]((?:\/[^!]+)?!?)$/;

/**
 * Returns the v4 shorthand of a classname, or `undefined` if there is nothing to rewrite.
 * @example
 * toCssVariableShorthand(`hover:border-[--a]!`) // returns `hover:border-(--a)!`;
 * toCssVariableShorthand(`-mt-[--gap]`) // returns `-mt-(--gap)`;
 * toCssVariableShorthand(`bg-[--x,red]`) // returns `bg-(--x,red)`;
 * toCssVariableShorthand(`text-[length:--size]`) // returns `text-(length:--size)`;
 * toCssVariableShorthand(`bg-[var(--x)]`) // returns `undefined`;
 */
export const toCssVariableShorthand = (
  className: string,
): string | undefined => {
  const match = getBaseClassname(className).match(bracketedVariableRegex);
  if (!match) return undefined;
  const [, utility, value, modifier] = match;
  return `${getModifiersPrefix(className)}${utility}(${value})${modifier}`;
};

const bracketedCssVariables = (
  context: RuleContext,
  settings: PluginSettings,
  options: RuleOptions,
  literals: Array<AtomicNode>,
) => {
  const genericContext = context as unknown as GenericRuleContext;

  for (const node of literals) {
    const {
      originalClassNamesValue,
      start,
      end,
      prefix,
      suffix,
      ignoreFirst,
      ignoreLast,
    } = dissectAtomicNode(node, genericContext);

    // Early escape if the value is falsy or doesn't contain "--"
    if (!originalClassNamesValue || !originalClassNamesValue.includes("--")) {
      continue;
    }

    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);

    const fixable = node.type !== TSESTree.AST_NODE_TYPES.Identifier;

    const classNamesLength = classNames.length;
    for (let index = 0; index < classNamesLength; index++) {
      // Both edges of a template literal can hold a fragment of a "dynamic" classname
      if (index === 0 && ignoreFirst) continue;
      if (index === classNamesLength - 1 && ignoreLast) continue;

      const className = classNames[index];
      const patched = toCssVariableShorthand(className);
      if (patched === undefined) continue;

      context.report({
        loc: generateLocForClassname(
          node,
          className,
          originalClassNamesValue,
          genericContext,
        ),
        messageId: "issue:css-variable-shorthand",
        data: {
          className,
          patchedClassName: patched,
        },
        fix: fixable
          ? (fixer) => {
              // Create a fresh clone of the classNames array for THIS specific fix
              const localPatchedClassNames = [...classNames];
              localPatchedClassNames[index] = patched;

              const patchedValue =
                prefix +
                joiner({
                  classNames: localPatchedClassNames,
                  whitespaces,
                  headSpace,
                  tailSpace,
                }) +
                suffix;

              return fixer.replaceTextRange([start, end], patchedValue);
            }
          : undefined,
      });
    }
  }
};

export const enforcesCssVariableShorthand = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Enforces the `(--variable)` shorthand over `[--variable]` arbitrary values.",
    },
    messages: {
      "issue:css-variable-shorthand":
        "Class '{{className}}' should be written as '{{patchedClassName}}'",
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
  defaultOptions: [{}],
  create: (context, options) => {
    // Merged settings
    const settings = parsePluginSettings(context.settings);

    return defineVisitors(
      context as unknown as Readonly<GenericRuleContext>,
      // Template visitor is only used within Vue SFC files (inside <template> section).
      createTemplateVisitors(context, settings, options, bracketedCssVariables),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(context, settings, options, bracketedCssVariables),
    );
  },
});
