import { expect, test } from "vitest";

import { defineVisitors, GenericRuleContext } from "./visitors";

const obsoleteContext: GenericRuleContext = {
  parserServices: {
    defineTemplateBodyVisitor: () => {},
  },
} as unknown as GenericRuleContext;

test("Using an `obsoleteContext` should throw an error", () => {
  expect(() => defineVisitors(obsoleteContext, {}, {})).toThrowError();
});
