import { expect, test, vi } from "vitest";

import { defineVisitors, GenericRuleContext } from "./visitors";

const modernContext: GenericRuleContext = {
  sourceCode: {
    parserServices: {},
  },
  parserServices: {},
} as GenericRuleContext;

const oldContext: GenericRuleContext = {
  parserServices: {
    defineTemplateBodyVisitor: () => {},
  },
} as unknown as GenericRuleContext;

test("`parserServices.defineTemplateBodyVisitor` should be called only with `oldContext`", () => {
  // @ts-expect-error `oldContext` is not a valid context for modern parser
  const spy = vi.spyOn(oldContext.parserServices, "defineTemplateBodyVisitor");
  defineVisitors(modernContext, {}, {});
  expect(spy).toHaveBeenCalledTimes(0);
  defineVisitors(oldContext, {}, {});
  expect(spy).toHaveBeenCalledTimes(1);
});
