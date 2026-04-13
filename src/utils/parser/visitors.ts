import { RuleContext, RuleListener } from "@typescript-eslint/utils/ts-eslint";

export type GenericRuleContext = RuleContext<"", []>;

/**
 * @see https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/#from-context-to-sourcecode
 */
const getParserServices = (context: Readonly<GenericRuleContext>) => {
  // TODO Enable this check if we can
  /*/
  if (!context.sourceCode) {
    throw new Error(
      "Unsupported parser (`context.parserServices` is deprecated…)"
    );
  }
  //*/
  return context.sourceCode
    ? // Modern ESLint parsers provide a `parserServices` property
      context.sourceCode.parserServices
    : // TODO This property is deprecated, make sure this is not used and remove it
      context.parserServices;
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
