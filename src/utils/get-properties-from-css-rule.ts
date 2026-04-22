import postcss from "postcss";

export const getPropertiesFromCssRule = (cssRule: string): Set<string> => {
  const properties = new Set<string>();
  const parsed = postcss.parse(cssRule);
  parsed.walkRules((rule) => {
    rule.walkDecls((decl) => {
      properties.add(decl.prop);
    });
  });
  return properties;
};
