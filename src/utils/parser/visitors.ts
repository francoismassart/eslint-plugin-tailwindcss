import { RuleContext, RuleListener } from "@typescript-eslint/utils/ts-eslint";

export type GenericRuleContext = RuleContext<"", []>;

/**
 * @see https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/#from-context-to-sourcecode
 */
const getParserServices = (context: Readonly<GenericRuleContext>) => {
  if (!context.sourceCode) {
    throw new Error(
      "Unsupported parser (`context.parserServices` is deprecated…)",
    );
  }
  return context.sourceCode.parserServices;
};

/**
 * @see parserServices https://eslint.org/docs/developer-guide/working-with-rules#the-context-object
 */
export const defineVisitors = (
  context: Readonly<GenericRuleContext>,
  templateBodyVisitor: RuleListener,
  scriptVisitor: RuleListener,
) => {
  const parserServices = getParserServices(context);
  if (
    parserServices === undefined ||
    // @ts-expect-error The "defineTemplateBodyVisitor" only exists on "vue-eslint-parser"
    parserServices["defineTemplateBodyVisitor"] === undefined
  ) {
    // Default parser
    return scriptVisitor;
  }

  // @see https://eslint.org/docs/developer-guide/working-with-rules#the-context-object
  // @ts-expect-error Using "vue-eslint-parser" requires this setup
  return parserServices.defineTemplateBodyVisitor(
    templateBodyVisitor,
    scriptVisitor,
  );
};

/**
 * Append work to the end of a file traversal without replacing a parser's own
 * `Program:exit` listener (Vue uses one internally for template visitors).
 */
export const appendProgramExitVisitor = (
  visitors: RuleListener,
  callback: () => void,
): RuleListener => {
  const originalProgramExit = visitors["Program:exit"];
  return {
    ...visitors,
    "Program:exit": (node) => {
      if (typeof originalProgramExit === "function") {
        originalProgramExit(node);
      }
      callback();
    },
  };
};
