/**
 * @fileoverview Tailwind CSS can express the same utility in several ways, e.g. an arbitrary
 * variant which has a first-class equivalent (`[&>*]:flex-1` vs `*:flex-1`) or a spelling which
 * was renamed in v4 (`bg-gradient-to-r` vs `bg-linear-to-r`).
 * Since v4.3.0 the compiler knows the canonical form of every candidate, so we ask it.
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
import { canonicalizeCandidatesWorker } from "../utils/tailwindcss-api";

export const RULE_NAME = "enforces-canonical-classname";

export type MessageIds = "issue:non-canonical-classname";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RuleOptions = {};

type Options = [RuleOptions];

type RuleContext = TSESLintRuleContext<MessageIds, Options>;

export const createRule = RuleCreator(urlCreator);

const nonCanonicalClassnames = (
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

    // Early escape if the value is falsy
    if (!originalClassNamesValue) continue;

    const { classNames, whitespaces, headSpace, tailSpace } =
      getClassnamesFromValue(originalClassNamesValue);

    // A single round trip per node, the worker caches each classname
    const canonicalClassNames = canonicalizeCandidatesWorker(
      settings.cssConfigPath,
      context.filename,
      classNames,
      settings,
    );

    const nonCanonicalClassesInNode: Array<{
      index: number; // Keep track of its position for surgical fixing
      classname: string;
      patched: string;
    }> = [];

    const classNamesLength = classNames.length;
    for (let index = 0; index < classNamesLength; index++) {
      // Both edges of a template literal can hold a fragment of a "dynamic" classname
      if (index === 0 && ignoreFirst) continue;
      if (index === classNamesLength - 1 && ignoreLast) continue;

      const targetClassName = classNames[index];
      const patched = canonicalClassNames[index];

      if (patched === targetClassName) continue;

      nonCanonicalClassesInNode.push({
        index,
        classname: targetClassName,
        patched,
      });
    }

    if (nonCanonicalClassesInNode.length === 0) continue;

    const fixable = node.type !== TSESTree.AST_NODE_TYPES.Identifier;

    for (const nonCanonicalClass of nonCanonicalClassesInNode) {
      const patchedLoc = generateLocForClassname(
        node,
        nonCanonicalClass.classname,
        originalClassNamesValue,
        genericContext,
      );

      context.report({
        loc: patchedLoc,
        messageId: "issue:non-canonical-classname",
        data: {
          className: nonCanonicalClass.classname,
          patchedClassName: nonCanonicalClass.patched,
        },
        fix: fixable
          ? (fixer) => {
              // Create a fresh clone of the classNames array for THIS specific fix
              const localPatchedClassNames = [...classNames];
              localPatchedClassNames[nonCanonicalClass.index] =
                nonCanonicalClass.patched;

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

export const enforcesCanonicalClassname = createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Enforces the canonical spelling of a classname, as resolved by the Tailwind CSS compiler.",
    },
    messages: {
      "issue:non-canonical-classname":
        "Class '{{className}}' can be written as '{{patchedClassName}}'",
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
      createTemplateVisitors(
        context,
        settings,
        options,
        nonCanonicalClassnames,
      ),
      // Script visitor is used within both JSX and Vue SFC files (inside <script> section).
      createScriptVisitors(context, settings, options, nonCanonicalClassnames),
    );
  },
});
