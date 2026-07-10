import { TSESTree } from "@typescript-eslint/utils";

export type TextAttribute = {
  type: "TextAttribute";
  name: string;
  value: string;
  valueSpan: {
    start: ParseLocation;
    end: ParseLocation;
    fullStart: ParseLocation;
  };
};

export type GenericElement = {
  name: string;
  attributes: Array<TextAttribute>;
  type: string;
};

export type SupportedAttribute = TSESTree.JSXAttribute | TextAttribute;
