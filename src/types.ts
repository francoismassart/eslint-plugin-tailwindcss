import { TSESTree } from "@typescript-eslint/utils";
import { RuleFunction } from "@typescript-eslint/utils/ts-eslint";
import { AST as VueAST } from "vue-eslint-parser";

export interface PluginSharedSettings {
  /**
   * @description Path to the CSS stylesheet in your Tailwind project (v4+)
   * @example "src/styles/tailwind.css"
   */
  stylesheet?: string;
  /**
   * @description Path to Tailwind configuration file
   * @example "tailwind.config.js"
   */
  config?: string;
  /**
   * @description List of attributes/props that contain sortable Tailwind classes
   * @default []
   * @example ["className"]
   */
  attributes?: Array<string>;
  /**
   * @description List of functions and tagged templates that contain sortable Tailwind classes
   * @default []
   * @example ["clsx", "tw", "ctl"]
   */
  functions?: Array<string>;
  /**
   * @description Preserve whitespace around Tailwind classes when sorting
   * @default false
   */
  preserveWhitespace?: boolean;
  /**
   * @description Preserve duplicate classes inside a class list when sorting
   * @default false
   */
  preserveDuplicates?: boolean;
}
export interface SharedConfigurationSettings {
  tailwindcss?: PluginSharedSettings;
}
// return [node.valueSpan.fullStart.offset, node.valueSpan.end.offset];

type ParseLocation = {
  offset: number;
  line: number;
  column: number;
};

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

export type ValueSupportedNode =
  | TSESTree.JSXAttribute
  | TextAttribute
  | VueAST.VAttribute;

export type SupportedNode =
  | TSESTree.CallExpression
  | TSESTree.Literal
  | TSESTree.TemplateElement
  | TSESTree.TaggedTemplateExpression
  | ValueSupportedNode;

export type SupportedChildNode =
  | SupportedNode
  | TSESTree.Expression
  | TSESTree.TemplateElement
  | VueAST.ESLintExpression
  | VueAST.ESLintProperty
  | VueAST.ESLintTemplateElement
  | VueAST.ESLintSpreadElement;

export type ScriptVisitor = {
  /**
   * In JSX + inside <script> section of Vue SFC…
   * @example
   * const classes = ctl('flex');
   * …
   * <div className={classes}>CallExpression via a const</div>
   * @example
   * <div className={ctl('flex')}>CallExpression inside a prop</div>
   * @example
   * const called = ctl('flex');
   * </script>
   * <template><div :class="called">CallExpression declared in the script section of a Vue SFC</div></template>
   */
  CallExpression: RuleFunction<TSESTree.CallExpression>;
  /**
   * Only the JSXAttributes
   * @example
   * <div className={'flex'}>JSXAttributes</div>
   */
  JSXAttribute: RuleFunction<TSESTree.JSXAttribute>;
  /**
   * In JSX + inside <script> section of Vue SFC…
   * @example
   * const classes = tw`flex`;
   */
  TaggedTemplateExpression: RuleFunction<TSESTree.TaggedTemplateExpression>;
  /**
   * Useful for regular HTML (non JSX)
   * @example
   * <div class="flex">TextAttribute</div>
   */
  // @ts-expect-error Type 'TextAttribute' does not satisfy the constraint 'NodeOrTokenData'.
  TextAttribute: RuleFunction<TextAttribute>;
  // TODO can we use a different type for TextAttribute
};

export type TemplateVisitor = {
  /**
   * Tagged templates inside data bindings
   * @see https://github.com/vuejs/vue/issues/9721
   * @example
   * <template><div :class="flex">VAttribute</div></template>
   */
  VAttribute: RuleFunction<VueAST.VAttribute>;
};
