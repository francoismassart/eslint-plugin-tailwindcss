var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/configs/rules.ts
var rules_default;
var init_rules = __esm({
  "src/configs/rules.ts"() {
    "use strict";
    rules_default = {
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/enforces-negative-arbitrary-values": "warn",
      "tailwindcss/enforces-shorthand": "warn",
      "tailwindcss/migration-from-tailwind-2": "warn",
      "tailwindcss/no-arbitrary-value": "off",
      "tailwindcss/no-custom-classname": "warn",
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/no-unnecessary-arbitrary-value": "warn"
    };
  }
});

// src/configs/flat-recommended.ts
var plugin, flat_recommended_default;
var init_flat_recommended = __esm({
  async "src/configs/flat-recommended.ts"() {
    "use strict";
    init_rules();
    plugin = await init_index().then(() => index_exports);
    flat_recommended_default = [
      {
        name: "tailwindcss:base",
        plugins: {
          get tailwindcss() {
            return plugin;
          }
        },
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true
            }
          }
        }
      },
      {
        name: "tailwindcss:rules",
        rules: rules_default
      }
    ];
  }
});

// src/configs/recommended.ts
var recommended_default;
var init_recommended = __esm({
  "src/configs/recommended.ts"() {
    "use strict";
    init_rules();
    recommended_default = {
      plugins: ["tailwindcss"],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: rules_default
    };
  }
});

// src/configs/index.ts
var configs;
var init_configs = __esm({
  async "src/configs/index.ts"() {
    "use strict";
    await init_flat_recommended();
    init_recommended();
    configs = {
      recommended: recommended_default,
      "flat/recommended": flat_recommended_default
    };
  }
});

// src/util/regex.ts
var regex_exports = {};
__export(regex_exports, {
  escapeRegex: () => escapeRegex,
  separatorRegEx: () => separatorRegEx
});
function escapeRegex(input) {
  return input.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
}
var separatorRegEx;
var init_regex = __esm({
  "src/util/regex.ts"() {
    "use strict";
    separatorRegEx = /([\t\n\f\r ]+)/;
  }
});

// src/util/removeDuplicatesFromArray.ts
var removeDuplicatesFromArray_exports = {};
__export(removeDuplicatesFromArray_exports, {
  default: () => removeDuplicatesFromArray_default
});
function removeDuplicatesFromArray(arr) {
  return [...new Set(arr)];
}
var removeDuplicatesFromArray_default;
var init_removeDuplicatesFromArray = __esm({
  "src/util/removeDuplicatesFromArray.ts"() {
    "use strict";
    removeDuplicatesFromArray_default = removeDuplicatesFromArray;
  }
});

// src/util/ast.ts
var ast_exports = {};
__export(ast_exports, {
  default: () => ast_default
});
function calleeToString(calleeNode) {
  if (calleeNode.type === "Identifier") {
    return calleeNode.name;
  }
  if (calleeNode.type === "MemberExpression") {
    return `${calleeNode.object.name}.${calleeNode.property.name}`;
  }
}
function isClassAttribute(node, classRegex) {
  if (!node.name) {
    return false;
  }
  let name2 = "";
  switch (node.type) {
    case "TextAttribute":
      name2 = node.name;
      break;
    case "JSXAttribute":
      if (node.name.type === "JSXNamespacedName") {
        const ns = node.name.namespace.name || "";
        name2 = (ns.length ? ns + ":" : "") + node.name.name.name;
      } else {
        name2 = node.name.name;
      }
      break;
    default:
      name2 = node.name.name;
  }
  return new RegExp(classRegex).test(name2);
}
function isVueClassAttribute(node, classRegex) {
  const re = new RegExp(classRegex);
  let name2 = "";
  switch (true) {
    case (node.key && node.key.name && re.test(node.key.name)):
      return true;
    case (node.key && node.key.name && node.key.name.name && node.key.argument && node.key.argument.name && /^bind$/.test(node.key.name.name) && re.test(node.key.argument.name)):
      return true;
    default:
      return false;
  }
}
function isVLiteralValue(node) {
  return node.value && node.value.type === "VLiteral";
}
function isArrayExpression(node) {
  return node.value && node.value.type === "VExpressionContainer" && node.value.expression && node.value.expression.type === "ArrayExpression";
}
function isObjectExpression(node) {
  return node.value && node.value.type === "VExpressionContainer" && node.value.expression && node.value.expression.type === "ObjectExpression";
}
function isVueValidAttributeValue(node) {
  switch (true) {
    case isVLiteralValue(node):
    // Simple string
    case isArrayExpression(node):
    // ['tw-unknown-class']
    case isObjectExpression(node):
      return true;
    default:
      return false;
  }
}
function isLiteralAttributeValue(node) {
  if (node.type === "TextAttribute" && node.name === "class" && typeof node.value === "string") {
    return true;
  }
  if (node.value) {
    switch (node.value.type) {
      case "Literal":
        return !/\{|\?|\}/.test(node.value.value);
      case "JSXExpressionContainer":
        return node.value.expression.type === "Literal";
    }
  }
  return false;
}
function isValidJSXAttribute(node, classRegex) {
  if (!isClassAttribute(node, classRegex)) {
    return false;
  }
  if (!isLiteralAttributeValue(node)) {
    return false;
  }
  return true;
}
function isValidVueAttribute(node, classRegex) {
  if (!isVueClassAttribute(node, classRegex)) {
    return false;
  }
  if (!isVueValidAttributeValue(node)) {
    return false;
  }
  return true;
}
function extractRangeFromNode(node) {
  if (node.type === "TextAttribute" && node.name === "class") {
    return [node.valueSpan.fullStart.offset, node.valueSpan.end.offset];
  }
  if (node.value === void 0) {
    return [0, 0];
  }
  switch (node.value.type) {
    case "JSXExpressionContainer":
      return node.value.expression.range;
    default:
      return node.value.range;
  }
}
function extractValueFromNode(node) {
  if (node.type === "TextAttribute" && node.name === "class") {
    return node.value;
  }
  if (node.value === void 0) {
    return node.value;
  }
  switch (node.value.type) {
    case "JSXExpressionContainer":
      return node.value.expression.value;
    case "VExpressionContainer":
      switch (node.value.expression.type) {
        case "ArrayExpression":
          return node.value.expression.elements;
        case "ObjectExpression":
          return node.value.expression.properties;
      }
      return node.value.expression.value;
    default:
      return node.value.value;
  }
}
function extractClassnamesFromValue(classStr) {
  if (typeof classStr !== "string") {
    return { classNames: [], whitespaces: [], headSpace: false, tailSpace: false };
  }
  let parts = classStr.split(separatorRegEx);
  if (parts[0] === "") {
    parts.shift();
  }
  if (parts[parts.length - 1] === "") {
    parts.pop();
  }
  let headSpace = separatorRegEx.test(parts[0]);
  let tailSpace = separatorRegEx.test(parts[parts.length - 1]);
  const isClass = (_, i) => headSpace ? i % 2 !== 0 : i % 2 === 0;
  const isNotClass = (_, i) => headSpace ? i % 2 === 0 : i % 2 !== 0;
  let classNames = parts.filter(isClass);
  let whitespaces = parts.filter(isNotClass);
  return { classNames, whitespaces, headSpace, tailSpace };
}
function parseNodeRecursive(rootNode, childNode, cb, skipConditional = false, isolate = false, ignoredKeys = []) {
  let originalClassNamesValue;
  let classNames;
  if (childNode === null) {
    originalClassNamesValue = extractValueFromNode(rootNode);
    ({ classNames } = extractClassnamesFromValue(originalClassNamesValue));
    classNames = removeDuplicatesFromArray2(classNames);
    if (classNames.length === 0) {
      return;
    }
    cb(classNames, rootNode);
  } else if (childNode === void 0) {
    return;
  } else {
    const forceIsolation = skipConditional ? true : isolate;
    let trim = false;
    switch (childNode.type) {
      case "TemplateLiteral":
        childNode.expressions.forEach((exp) => {
          parseNodeRecursive(rootNode, exp, cb, skipConditional, forceIsolation, ignoredKeys);
        });
        childNode.quasis.forEach((quasis) => {
          parseNodeRecursive(rootNode, quasis, cb, skipConditional, isolate, ignoredKeys);
        });
        return;
      case "ConditionalExpression":
        parseNodeRecursive(rootNode, childNode.consequent, cb, skipConditional, forceIsolation, ignoredKeys);
        parseNodeRecursive(rootNode, childNode.alternate, cb, skipConditional, forceIsolation, ignoredKeys);
        return;
      case "LogicalExpression":
        parseNodeRecursive(rootNode, childNode.right, cb, skipConditional, forceIsolation, ignoredKeys);
        return;
      case "ArrayExpression":
        childNode.elements.forEach((el) => {
          parseNodeRecursive(rootNode, el, cb, skipConditional, forceIsolation, ignoredKeys);
        });
        return;
      case "ObjectExpression":
        childNode.properties.forEach((prop) => {
          const isUsedByClassNamesPlugin = rootNode.callee && rootNode.callee.name === "classnames" || rootNode.type === "VAttribute";
          if (prop.type === "SpreadElement") {
            return;
          }
          if (prop.key.type === "Identifier" && ignoredKeys.includes(prop.key.name)) {
            return;
          }
          parseNodeRecursive(
            rootNode,
            isUsedByClassNamesPlugin ? prop.key : prop.value,
            cb,
            skipConditional,
            forceIsolation,
            ignoredKeys
          );
        });
        return;
      case "Property":
        parseNodeRecursive(rootNode, childNode.key, cb, skipConditional, forceIsolation, ignoredKeys);
        return;
      case "Literal":
        trim = true;
        originalClassNamesValue = childNode.value;
        break;
      case "TemplateElement":
        originalClassNamesValue = childNode.value.raw;
        break;
    }
    ({ classNames } = extractClassnamesFromValue(originalClassNamesValue));
    classNames = removeDuplicatesFromArray2(classNames);
    if (classNames.length === 0) {
      return;
    }
    const targetNode = isolate ? null : rootNode;
    cb(classNames, targetNode);
  }
}
function getTemplateElementPrefix(text, raw) {
  const idx = text.indexOf(raw);
  if (idx === 0) {
    return "";
  }
  return text.split(raw).shift();
}
function getTemplateElementSuffix(text, raw) {
  if (text.indexOf(raw) === -1) {
    return "";
  }
  return text.split(raw).pop();
}
function getTemplateElementBody(text, prefix, suffix) {
  let arr = text.split(prefix);
  arr.shift();
  let body = arr.join(prefix);
  arr = body.split(suffix);
  arr.pop();
  return arr.join(suffix);
}
var removeDuplicatesFromArray2, ast_default;
var init_ast = __esm({
  "src/util/ast.ts"() {
    "use strict";
    init_regex();
    removeDuplicatesFromArray2 = (init_removeDuplicatesFromArray(), __toCommonJS(removeDuplicatesFromArray_exports));
    ast_default = {
      calleeToString,
      extractRangeFromNode,
      extractValueFromNode,
      extractClassnamesFromValue,
      isClassAttribute,
      isLiteralAttributeValue,
      isArrayExpression,
      isObjectExpression,
      isValidJSXAttribute,
      isValidVueAttribute,
      isVLiteralValue,
      parseNodeRecursive,
      getTemplateElementPrefix,
      getTemplateElementSuffix,
      getTemplateElementBody
    };
  }
});

// src/util/customConfig.ts
var customConfig_exports = {};
__export(customConfig_exports, {
  default: () => customConfig_default
});
import fs from "fs";
import path from "path";
import resolveConfig from "tailwindcss/resolveConfig";
function requireUncached(module) {
  delete __require.cache[__require.resolve(module)];
  if (twLoadConfig === null) {
    return __require(module);
  } else {
    return twLoadConfig.loadConfig(module);
  }
}
function loadConfig(config) {
  let loadedConfig = null;
  if (typeof config === "string") {
    const resolvedPath = path.isAbsolute(config) ? config : path.join(path.resolve(), config);
    try {
      const stats = fs.statSync(resolvedPath);
      const mtime = `${stats.mtime || ""}`;
      if (stats === null) {
        loadedConfig = {};
      } else if (lastModifiedDate !== mtime) {
        lastModifiedDate = mtime;
        loadedConfig = requireUncached(resolvedPath);
      } else {
        loadedConfig = null;
      }
    } catch (err) {
      loadedConfig = {};
    } finally {
      return loadedConfig;
    }
  } else {
    if (typeof config === "object" && config !== null) {
      return config;
    }
    return {};
  }
}
function convertConfigToString(config) {
  switch (typeof config) {
    case "string":
      return config;
    case "object":
      return JSON.stringify(config);
    default:
      return config.toString();
  }
}
function resolve(twConfig) {
  const newConfig = convertConfigToString(twConfig) !== convertConfigToString(previousConfig);
  const now = Date.now();
  const expired = now - (lastCheck ?? 0) > CHECK_REFRESH_RATE;
  if (newConfig || expired) {
    previousConfig = twConfig;
    lastCheck = now;
    const userConfig = loadConfig(twConfig);
    if (userConfig !== null) {
      mergedConfig = resolveConfig(userConfig);
    }
  }
  return mergedConfig;
}
var twLoadConfig, CHECK_REFRESH_RATE, previousConfig, lastCheck, mergedConfig, lastModifiedDate, customConfig_default;
var init_customConfig = __esm({
  "src/util/customConfig.ts"() {
    "use strict";
    try {
      twLoadConfig = __require("tailwindcss/lib/lib/load-config");
    } catch (err) {
      twLoadConfig = null;
    }
    CHECK_REFRESH_RATE = 1e3;
    previousConfig = null;
    lastCheck = null;
    mergedConfig = null;
    lastModifiedDate = null;
    customConfig_default = {
      resolve
    };
  }
});

// src/util/docsUrl.ts
var docsUrl_exports = {};
__export(docsUrl_exports, {
  default: () => docsUrl_default
});
function docsUrl(ruleName) {
  return `https://github.com/francoismassart/eslint-plugin-tailwindcss/tree/master/docs/rules/${ruleName}.md`;
}
var docsUrl_default;
var init_docsUrl = __esm({
  "src/util/docsUrl.ts"() {
    "use strict";
    docsUrl_default = docsUrl;
  }
});

// src/util/parser.ts
var parser_exports = {};
__export(parser_exports, {
  default: () => parser_default
});
function defineTemplateBodyVisitor(context, templateBodyVisitor, scriptVisitor) {
  const parserServices = getParserServices(context);
  if (parserServices == null || parserServices.defineTemplateBodyVisitor == null) {
    return scriptVisitor;
  }
  return parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
}
function getParserServices(context) {
  return context.sourceCode ? context.sourceCode.parserServices : context.parserServices;
}
var parser_default;
var init_parser = __esm({
  "src/util/parser.ts"() {
    "use strict";
    parser_default = {
      defineTemplateBodyVisitor
    };
  }
});

// src/util/prettier/order.ts
function bigSign(bigIntValue) {
  return (bigIntValue > 0n) - (bigIntValue < 0n);
}
function prefixCandidate(context, selector) {
  let prefix = context.tailwindConfig.prefix;
  return typeof prefix === "function" ? prefix(selector) : prefix + selector;
}
function getClassOrderPolyfill(classes, { env }) {
  let parasiteUtilities = /* @__PURE__ */ new Set([prefixCandidate(env.context, "group"), prefixCandidate(env.context, "peer")]);
  let classNamesWithOrder = [];
  for (let className of classes) {
    let order2 = env.generateRules(/* @__PURE__ */ new Set([className]), env.context).sort(([a], [z]) => bigSign(z - a))[0]?.[0] ?? null;
    if (order2 === null && parasiteUtilities.has(className)) {
      order2 = env.context.layerOrder.components;
    }
    classNamesWithOrder.push([className, order2]);
  }
  return classNamesWithOrder;
}
function sortClasses(classStr, { env, ignoreFirst = false, ignoreLast = false }) {
  if (typeof classStr !== "string" || classStr === "") {
    return classStr;
  }
  if (classStr.includes("{{")) {
    return classStr;
  }
  let result = "";
  let parts = classStr.split(separatorRegEx);
  let classes = parts.filter((_, i) => i % 2 === 0);
  let whitespace = parts.filter((_, i) => i % 2 !== 0);
  if (classes[classes.length - 1] === "") {
    classes.pop();
  }
  let prefix = "";
  if (ignoreFirst) {
    prefix = `${classes.shift() ?? ""}${whitespace.shift() ?? ""}`;
  }
  let suffix = "";
  if (ignoreLast) {
    suffix = `${whitespace.pop() ?? ""}${classes.pop() ?? ""}`;
  }
  let classNamesWithOrder = env.context.getClassOrder ? env.context.getClassOrder(classes) : getClassOrderPolyfill(classes, { env });
  classes = classNamesWithOrder.sort(([, a], [, z]) => {
    if (a === z) return 0;
    if (a === null) return -1;
    if (z === null) return 1;
    return bigSign(a - z);
  }).map(([className]) => className);
  for (let i = 0; i < classes.length; i++) {
    result += `${classes[i]}${whitespace[i] ?? ""}`;
  }
  return prefix + result + suffix;
}
function order(unordered, context) {
  const sorted = sortClasses(unordered.join(" "), { env: { context } });
  return sorted;
}
var order_default;
var init_order = __esm({
  "src/util/prettier/order.ts"() {
    "use strict";
    init_regex();
    order_default = order;
  }
});

// src/util/removeDuplicatesFromClassnamesAndWhitespaces.ts
function removeDuplicatesFromClassnamesAndWhitespaces(orderedClassNames, whitespaces, headSpace, tailSpace) {
  let previous = orderedClassNames[0];
  const offset = !headSpace && !tailSpace || tailSpace ? -1 : 0;
  for (let i = 1; i < orderedClassNames.length; i++) {
    const cls = orderedClassNames[i];
    if (cls === previous) {
      orderedClassNames.splice(i, 1);
      whitespaces.splice(i + offset, 1);
      i--;
    }
    previous = cls;
  }
}
var removeDuplicatesFromClassnamesAndWhitespaces_default;
var init_removeDuplicatesFromClassnamesAndWhitespaces = __esm({
  "src/util/removeDuplicatesFromClassnamesAndWhitespaces.ts"() {
    "use strict";
    removeDuplicatesFromClassnamesAndWhitespaces_default = removeDuplicatesFromClassnamesAndWhitespaces;
  }
});

// src/util/settings.ts
var settings_exports = {};
__export(settings_exports, {
  default: () => settings_default
});
function getOption(context, name2) {
  const options = context.options[0] || {};
  if (options[name2] != void 0) {
    return options[name2];
  }
  if (context.settings && context.settings.tailwindcss && context.settings.tailwindcss[name2] != void 0) {
    return context.settings.tailwindcss[name2];
  }
  switch (name2) {
    case "callees":
      return ["classnames", "clsx", "ctl", "cva", "tv"];
    case "ignoredKeys":
      return ["compoundVariants", "defaultVariants"];
    case "classRegex":
      return "^class(Name)?$";
    case "config":
      if (resolveDefaultConfigPathAlias === null) {
        return "tailwind.config.js";
      } else {
        return resolveDefaultConfigPathAlias();
      }
    case "cssFiles":
      return ["**/*.css", "!**/node_modules", "!**/.*", "!**/dist", "!**/build"];
    case "cssFilesRefreshRate":
      return 5e3;
    case "removeDuplicates":
      return true;
    case "skipClassAttribute":
      return false;
    case "tags":
      return [];
    case "whitelist":
      return [];
  }
}
var resolveDefaultConfigPathAlias, settings_default;
var init_settings = __esm({
  "src/util/settings.ts"() {
    "use strict";
    try {
      const { resolveDefaultConfigPath } = __require("tailwindcss/lib/util/resolveConfigPath");
      resolveDefaultConfigPathAlias = resolveDefaultConfigPath;
    } catch (err) {
      resolveDefaultConfigPathAlias = null;
    }
    settings_default = getOption;
  }
});

// src/rules/classnames-order.ts
var createContextFallback, INVALID_CLASSNAMES_ORDER_MSG, contextFallbackCache, classnames_order_default;
var init_classnames_order = __esm({
  "src/rules/classnames-order.ts"() {
    "use strict";
    init_ast();
    init_customConfig();
    init_docsUrl();
    init_parser();
    init_order();
    init_removeDuplicatesFromClassnamesAndWhitespaces();
    init_settings();
    createContextFallback = __require("tailwindcss/lib/lib/setupContextUtils").createContext;
    INVALID_CLASSNAMES_ORDER_MSG = "Invalid Tailwind CSS classnames order";
    contextFallbackCache = /* @__PURE__ */ new WeakMap();
    classnames_order_default = {
      meta: {
        docs: {
          description: "Enforce a consistent and logical order of the Tailwind CSS classnames",
          category: "Stylistic Issues",
          recommended: false,
          url: docsUrl_default("classnames-order")
        },
        messages: {
          invalidOrder: INVALID_CLASSNAMES_ORDER_MSG
        },
        fixable: "code",
        schema: [
          {
            type: "object",
            properties: {
              callees: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              ignoredKeys: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              config: {
                // returned from `loadConfig()` utility
                type: ["string", "object"]
              },
              removeDuplicates: {
                // default: true,
                type: "boolean"
              },
              tags: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              }
            }
          }
        ]
      },
      create: function(context) {
        const callees = settings_default(context, "callees");
        const skipClassAttribute = settings_default(context, "skipClassAttribute");
        const tags = settings_default(context, "tags");
        const twConfig = settings_default(context, "config");
        const classRegex = settings_default(context, "classRegex");
        const removeDuplicates = settings_default(context, "removeDuplicates");
        const mergedConfig2 = customConfig_default.resolve(twConfig);
        const contextFallback = (
          // Set the created contextFallback in the cache if it does not exist yet.
          (contextFallbackCache.has(mergedConfig2) ? contextFallbackCache : contextFallbackCache.set(mergedConfig2, createContextFallback(mergedConfig2))).get(mergedConfig2)
        );
        const sortNodeArgumentValue = (node, arg = null) => {
          let originalClassNamesValue = null;
          let start = null;
          let end = null;
          let prefix = "";
          let suffix = "";
          if (arg === null) {
            originalClassNamesValue = ast_default.extractValueFromNode(node);
            const range = ast_default.extractRangeFromNode(node);
            if (node.type === "TextAttribute") {
              start = range[0];
              end = range[1];
            } else {
              start = range[0] + 1;
              end = range[1] - 1;
            }
          } else {
            switch (arg.type) {
              case "Identifier":
                return;
              case "TemplateLiteral":
                arg.expressions.forEach((exp) => {
                  sortNodeArgumentValue(node, exp);
                });
                arg.quasis.forEach((quasis) => {
                  sortNodeArgumentValue(node, quasis);
                });
                return;
              case "ConditionalExpression":
                sortNodeArgumentValue(node, arg.consequent);
                sortNodeArgumentValue(node, arg.alternate);
                return;
              case "LogicalExpression":
                sortNodeArgumentValue(node, arg.right);
                return;
              case "ArrayExpression":
                arg.elements.forEach((el) => {
                  sortNodeArgumentValue(node, el);
                });
                return;
              case "ObjectExpression":
                const isUsedByClassNamesPlugin = node.callee && node.callee.name === "classnames";
                const isVue = node.key && node.key.type === "VDirectiveKey";
                arg.properties.forEach((prop) => {
                  const propVal = isUsedByClassNamesPlugin || isVue ? prop.key : prop.value;
                  sortNodeArgumentValue(node, propVal);
                });
                return;
              case "Property":
                sortNodeArgumentValue(node, arg.key);
                break;
              case "Literal":
                originalClassNamesValue = arg.value;
                start = arg.range[0] + 1;
                end = arg.range[1] - 1;
                break;
              case "TemplateElement":
                originalClassNamesValue = arg.value.raw;
                if (originalClassNamesValue === "") {
                  return;
                }
                start = arg.range[0];
                end = arg.range[1];
                const txt = context.getSourceCode().getText(arg);
                prefix = ast_default.getTemplateElementPrefix(txt, originalClassNamesValue);
                suffix = ast_default.getTemplateElementSuffix(txt, originalClassNamesValue);
                originalClassNamesValue = ast_default.getTemplateElementBody(txt, prefix, suffix);
                break;
            }
          }
          let { classNames, whitespaces, headSpace, tailSpace } = ast_default.extractClassnamesFromValue(originalClassNamesValue);
          if (classNames.length <= 1) {
            return;
          }
          let orderedClassNames = order_default(classNames, contextFallback).split(" ");
          if (removeDuplicates) {
            removeDuplicatesFromClassnamesAndWhitespaces_default(orderedClassNames, whitespaces, headSpace, tailSpace);
          }
          let validatedClassNamesValue = "";
          for (let i = 0; i < orderedClassNames.length; i++) {
            const w = whitespaces[i] ?? "";
            const cls = orderedClassNames[i];
            validatedClassNamesValue += headSpace ? `${w}${cls}` : `${cls}${w}`;
            if (headSpace && tailSpace && i === orderedClassNames.length - 1) {
              validatedClassNamesValue += whitespaces[whitespaces.length - 1] ?? "";
            }
          }
          if (originalClassNamesValue !== validatedClassNamesValue) {
            validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;
            context.report({
              node,
              messageId: "invalidOrder",
              fix: function(fixer) {
                return fixer.replaceTextRange([start, end], validatedClassNamesValue);
              }
            });
          }
        };
        const attributeVisitor = function(node) {
          if (!ast_default.isClassAttribute(node, classRegex) || skipClassAttribute) {
            return;
          }
          if (ast_default.isLiteralAttributeValue(node)) {
            sortNodeArgumentValue(node);
          } else if (node.value && node.value.type === "JSXExpressionContainer") {
            sortNodeArgumentValue(node, node.value.expression);
          }
        };
        const callExpressionVisitor = function(node) {
          const calleeStr = ast_default.calleeToString(node.callee);
          if (callees.findIndex((name2) => calleeStr === name2) === -1) {
            return;
          }
          node.arguments.forEach((arg) => {
            sortNodeArgumentValue(node, arg);
          });
        };
        const scriptVisitor = {
          JSXAttribute: attributeVisitor,
          TextAttribute: attributeVisitor,
          CallExpression: callExpressionVisitor,
          TaggedTemplateExpression: function(node) {
            if (!tags.includes(node.tag.name ?? node.tag.object?.name ?? node.tag.callee?.name)) {
              return;
            }
            sortNodeArgumentValue(node, node.quasi);
          }
        };
        const templateVisitor = {
          CallExpression: callExpressionVisitor,
          /*
          Tagged templates inside data bindings
          https://github.com/vuejs/vue/issues/9721
          */
          VAttribute: function(node) {
            switch (true) {
              case !ast_default.isValidVueAttribute(node, classRegex):
                return;
              case ast_default.isVLiteralValue(node):
                sortNodeArgumentValue(node, null);
                break;
              case ast_default.isArrayExpression(node):
                node.value.expression.elements.forEach((arg) => {
                  sortNodeArgumentValue(node, arg);
                });
                break;
              case ast_default.isObjectExpression(node):
                node.value.expression.properties.forEach((prop) => {
                  sortNodeArgumentValue(node, prop);
                });
                break;
            }
          }
        };
        return parser_default.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
      }
    };
  }
});

// src/util/types/angle.ts
var units, mergedAngleValues, angle_default;
var init_angle = __esm({
  "src/util/types/angle.ts"() {
    "use strict";
    units = ["deg", "grad", "rad", "turn"];
    mergedAngleValues = [
      `\\-?(\\d{1,}(\\.\\d{1,})?|\\.\\d{1,})(${units.join("|")})`,
      `calc\\(.{1,}\\)`,
      `var\\(\\-\\-[A-Za-z\\-]{1,}\\)`
    ];
    angle_default = {
      mergedAngleValues
    };
  }
});

// src/util/types/color.ts
var cssNamedColors, hexRGBA, RGBIntegers, RGBPercentages, supportedRGBA, RGBAPercentages, optionalColorPrefixedVar, mandatoryColorPrefixed, notHSLAPlusWildcard, supportedHSL, colorValues, mergedColorValues, color_default;
var init_color = __esm({
  "src/util/types/color.ts"() {
    "use strict";
    cssNamedColors = [
      "indianred",
      "lightcoral",
      "salmon",
      "darksalmon",
      "lightsalmon",
      "crimson",
      "red",
      "firebrick",
      "darkred",
      "pink",
      "lightpink",
      "hotpink",
      "deeppink",
      "mediumvioletred",
      "palevioletred",
      "coral",
      "tomato",
      "orangered",
      "darkorange",
      "orange",
      "gold",
      "yellow",
      "lightyellow",
      "lemonchiffon",
      "lightgoldenrodyellow",
      "papayawhip",
      "moccasin",
      "peachpuff",
      "palegoldenrod",
      "khaki",
      "darkkhaki",
      "lavender",
      "thistle",
      "plum",
      "violet",
      "orchid",
      "fuchsia",
      "magenta",
      "mediumorchid",
      "mediumpurple",
      "blueviolet",
      "darkviolet",
      "darkorchid",
      "darkmagenta",
      "purple",
      "rebeccapurple",
      "indigo",
      "mediumslateblue",
      "slateblue",
      "darkslateblue",
      "greenyellow",
      "chartreuse",
      "lawngreen",
      "lime",
      "limegreen",
      "palegreen",
      "lightgreen",
      "mediumspringgreen",
      "springgreen",
      "mediumseagreen",
      "seagreen",
      "forestgreen",
      "green",
      "darkgreen",
      "yellowgreen",
      "olivedrab",
      "olive",
      "darkolivegreen",
      "mediumaquamarine",
      "darkseagreen",
      "lightseagreen",
      "darkcyan",
      "teal",
      "aqua",
      "cyan",
      "lightcyan",
      "paleturquoise",
      "aquamarine",
      "turquoise",
      "mediumturquoise",
      "darkturquoise",
      "cadetblue",
      "steelblue",
      "lightsteelblue",
      "powderblue",
      "lightblue",
      "skyblue",
      "lightskyblue",
      "deepskyblue",
      "dodgerblue",
      "cornflowerblue",
      "royalblue",
      "blue",
      "mediumblue",
      "darkblue",
      "navy",
      "midnightblue",
      "cornsilk",
      "blanchedalmond",
      "bisque",
      "navajowhite",
      "wheat",
      "burlywood",
      "tan",
      "rosybrown",
      "sandybrown",
      "goldenrod",
      "darkgoldenrod",
      "peru",
      "chocolate",
      "saddlebrown",
      "sienna",
      "brown",
      "maroon",
      "white",
      "snow",
      "honeydew",
      "mintcream",
      "azure",
      "aliceblue",
      "ghostwhite",
      "whitesmoke",
      "seashell",
      "beige",
      "oldlace",
      "floralwhite",
      "ivory",
      "antiquewhite",
      "linen",
      "lavenderblush",
      "mistyrose",
      "gainsboro",
      "lightgray",
      "lightgrey",
      "silver",
      "darkgray",
      "darkgrey",
      "gray",
      "grey",
      "dimgray",
      "dimgrey",
      "lightslategray",
      "lightslategrey",
      "slategray",
      "slategrey",
      "darkslategray",
      "darkslategrey",
      "black",
      "transparent",
      "currentColor"
    ];
    hexRGBA = "\\#(([0-9A-Fa-f]{8})|([0-9A-Fa-f]{6})|([0-9A-Fa-f]{4})|([0-9A-Fa-f]{3}))";
    RGBIntegers = "rgb\\(\\d{1,3}\\,\\d{1,3}\\,\\d{1,3}\\)";
    RGBPercentages = "rgb\\(\\d{1,3}%\\,\\d{1,3}%\\,\\d{1,3}%\\)";
    supportedRGBA = "rgba\\(\\d{1,3}\\,\\d{1,3}\\,\\d{1,3}\\,\\d*(\\.\\d*)?%?\\)";
    RGBAPercentages = "rgba\\(\\d{1,3}%\\,\\d{1,3}%\\,\\d{1,3}%\\,\\d*(\\.\\d*)?%?\\)";
    optionalColorPrefixedVar = "(color\\:)?var\\(\\-\\-[A-Za-z\\-]{1,}\\)";
    mandatoryColorPrefixed = "color\\:(?!(hsla\\()).{1,}";
    notHSLAPlusWildcard = "(?!(hsla\\()).{1,}";
    supportedHSL = "hsl\\(\\d{1,3}%?\\,\\d{1,3}%?\\,\\d{1,3}%?\\)";
    colorValues = [hexRGBA, RGBIntegers, RGBPercentages, supportedRGBA, supportedHSL];
    mergedColorValues = [...cssNamedColors, ...colorValues];
    color_default = {
      cssNamedColors,
      colorValues,
      mergedColorValues,
      RGBAPercentages,
      optionalColorPrefixedVar,
      mandatoryColorPrefixed,
      notHSLAPlusWildcard
    };
  }
});

// src/util/types/length.ts
var fontUnits, viewportUnits, absoluteUnits, perInchUnits, otherUnits, mergedUnits, selectedUnits, absoluteValues, relativeValues, globalValues, mergedValues, mergedLengthValues, mergedUnitsRegEx, selectedUnitsRegEx, anyCalcRegEx, validZeroRegEx, length_default;
var init_length = __esm({
  "src/util/types/length.ts"() {
    "use strict";
    init_removeDuplicatesFromArray();
    fontUnits = ["cap", "ch", "em", "ex", "ic", "lh", "rem", "rlh"];
    viewportUnits = ["vb", "vh", "vi", "vw", "vmin", "vmax"];
    absoluteUnits = ["px", "mm", "cm", "in", "pt", "pc"];
    perInchUnits = ["lin", "pt", "mm"];
    otherUnits = ["%"];
    mergedUnits = removeDuplicatesFromArray_default([
      ...fontUnits,
      ...viewportUnits,
      ...absoluteUnits,
      ...perInchUnits,
      ...otherUnits
    ]);
    selectedUnits = mergedUnits.filter((el) => {
      return !["cap", "ic", "vb", "vi"].includes(el);
    });
    absoluteValues = ["0", "xx\\-small", "x\\-small", "small", "medium", "large", "x\\-large", "xx\\-large"];
    relativeValues = ["larger", "smaller"];
    globalValues = ["inherit", "initial", "unset"];
    mergedValues = [...absoluteValues, ...relativeValues, ...globalValues];
    mergedLengthValues = [`\\-?\\d*\\.?\\d*(${mergedUnits.join("|")})`, ...mergedValues];
    mergedLengthValues.push("length\\:var\\(\\-\\-[a-z\\-]{1,}\\)");
    mergedUnitsRegEx = `\\[(\\d{1,}(\\.\\d{1,})?|(\\.\\d{1,})?)(${mergedUnits.join("|")})\\]`;
    selectedUnitsRegEx = `\\[(\\d{1,}(\\.\\d{1,})?|(\\.\\d{1,})?)(${selectedUnits.join("|")})\\]`;
    anyCalcRegEx = `\\[calc\\(.{1,}\\)\\]`;
    validZeroRegEx = `^(0(\\.0{1,})?|\\.0{1,})(${mergedUnits.join("|")})?$`;
    length_default = {
      anyCalcRegEx,
      mergedLengthValues,
      mergedUnits,
      mergedUnitsRegEx,
      mergedValues,
      selectedUnits,
      selectedUnitsRegEx,
      validZeroRegEx
    };
  }
});

// src/util/groupMethods.ts
var groupMethods_exports = {};
__export(groupMethods_exports, {
  default: () => groupMethods_default
});
function escapeSpecialChars(str) {
  return str.replace(/\W/g, "\\$&");
}
function generateOptionalOpacitySuffix(config) {
  const opacityKeys = !config.theme["opacity"] ? [] : Object.keys(config.theme["opacity"]);
  opacityKeys.push("\\[(\\d*\\.?\\d*)%?\\]");
  return `(\\/(${opacityKeys.join("|")}))?`;
}
function generateOptions(propName, keys, config, isNegative = false) {
  const opacitySuffixes = generateOptionalOpacitySuffix(config);
  const genericArbitraryOption = "\\[(.*)\\]";
  const defaultKeyIndex = keys.findIndex((v) => v === "DEFAULT");
  if (defaultKeyIndex > -1) {
    keys.splice(defaultKeyIndex, 1);
  }
  const escapedKeys = keys.map((k) => escapeSpecialChars(k));
  switch (propName) {
    case "dark":
      if (config.darkMode === "class") {
        return "dark";
      } else if (Array.isArray(config.darkMode) && config.darkMode.length === 2 && config.darkMode[0] === "class") {
        let value = "";
        const res = /^\.(?<classnameValue>[A-Z0-9\:\-\_\[\d\]]*)$/gi.exec(config.darkMode[1]);
        if (res && res.groups) {
          if (res.groups.classnameValue) {
            value = res.groups.classnameValue;
          }
        }
        return value;
      } else {
        return "";
      }
    case "arbitraryProperties":
      escapedKeys.push(genericArbitraryOption);
      return "(" + escapedKeys.join("|") + ")";
    case "colors":
    case "accentColor":
    case "borderColor":
    case "boxShadowColor":
    case "divideColor":
    case "fill":
    case "outlineColor":
    case "textColor":
    case "stroke":
    case "gradientColorStopPositions":
      const options = [];
      keys.forEach((k) => {
        const color = config.theme[propName][k] || config.theme.colors[k];
        if (typeof color === "string") {
          options.push(escapeSpecialChars(k) + opacitySuffixes);
        } else {
          const variants = Object.keys(color).map((colorKey) => escapeSpecialChars(colorKey));
          const defaultIndex = variants.findIndex((v) => v === "DEFAULT");
          const hasDefault = defaultIndex > -1;
          if (hasDefault) {
            variants.splice(defaultIndex, 1);
          }
          options.push(k + "(\\-(" + variants.join("|") + "))" + (hasDefault ? "?" : "") + opacitySuffixes);
        }
      });
      const arbitraryColors = [...color_default.mergedColorValues];
      switch (propName) {
        case "fill":
          arbitraryColors.push(`(?!(angle|length|list):).{1,}`);
          break;
        case "gradientColorStopPositions":
          arbitraryColors.push(color_default.RGBAPercentages);
          arbitraryColors.push(color_default.optionalColorPrefixedVar);
          arbitraryColors.push(color_default.notHSLAPlusWildcard);
          break;
        case "textColor":
          arbitraryColors.push(color_default.RGBAPercentages);
          arbitraryColors.push(color_default.mandatoryColorPrefixed);
          break;
        default:
          arbitraryColors.push(color_default.mandatoryColorPrefixed);
      }
      options.push(`\\[(${arbitraryColors.join("|")})\\]`);
      return "(" + options.join("|") + ")";
    case "borderSpacing":
    case "borderWidth":
    case "divideWidth":
    case "fontSize":
    case "outlineWidth":
    case "outlineOffset":
    case "ringWidth":
    case "ringOffsetWidth":
    case "textUnderlineOffset":
      escapedKeys.push(length_default.selectedUnitsRegEx);
      escapedKeys.push(length_default.anyCalcRegEx);
      escapedKeys.push(`\\[length\\:.{1,}\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "strokeWidth":
      escapedKeys.push(length_default.selectedUnitsRegEx);
      escapedKeys.push(length_default.anyCalcRegEx);
      escapedKeys.push(`\\[length\\:calc\\(.{1,}\\)\\]`);
      escapedKeys.push(`\\[length\\:(.{1,})(${length_default.selectedUnits.join("|")})?\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "gap":
    case "height":
    case "lineHeight":
    case "maxHeight":
    case "size":
    case "maxWidth":
    case "minHeight":
    case "minWidth":
    case "padding":
    case "width":
    case "blur":
    case "brightness":
    case "contrast":
    case "grayscale":
    case "invert":
    case "saturate":
    case "sepia":
    case "backdropBlur":
    case "backdropBrightness":
    case "backdropContrast":
    case "backdropGrayscale":
    case "backdropInvert":
    case "backdropOpacity":
    case "backdropSaturate":
    case "backdropSepia":
    case "transitionDuration":
    case "transitionTimingFunction":
    case "transitionDelay":
    case "animation":
    case "transformOrigin":
    case "scale":
    case "cursor":
      escapedKeys.push(length_default.mergedUnitsRegEx);
      escapedKeys.push(`\\[(?!(angle|color|length|list):).{1,}\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "backdropHueRotate":
    case "hueRotate":
    case "inset":
    case "letterSpacing":
    case "margin":
    case "scrollMargin":
    case "skew":
    case "space":
    case "textIndent":
    case "translate":
      escapedKeys.push(length_default.mergedUnitsRegEx);
      escapedKeys.push(`\\[(?!(angle|color|length|list):).{1,}\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "backgroundOpacity":
    case "borderOpacity":
    case "opacity":
    case "ringOpacity":
      escapedKeys.push(`\\[(0(\\.\\d{1,})?|\\.\\d{1,}|1)\\]`);
      escapedKeys.push(length_default.anyCalcRegEx);
      escapedKeys.push(`\\[var\\(\\-\\-[A-Za-z\\-]{1,}\\)\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "rotate":
      escapedKeys.push(`\\[(${angle_default.mergedAngleValues.join("|")})\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "gridTemplateColumns":
    case "gridColumn":
    case "gridColumnStart":
    case "gridColumnEnd":
    case "gridTemplateRows":
    case "gridRow":
    case "gridRowStart":
    case "gridRowEnd":
    case "gridAutoColumns":
    case "gridAutoRows":
      escapedKeys.push(`\\[(?!(angle|color|length):).{1,}\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "listStyleType":
      escapedKeys.push(`\\[(?!(angle|color|length|list):).{1,}\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "objectPosition":
      escapedKeys.push(`\\[(?!(angle|color|length):).{1,}\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "backgroundPosition":
    case "boxShadow":
    case "dropShadow":
    case "transitionProperty":
      escapedKeys.push(`\\[(?!((angle|color|length|list):)|#|var\\().{1,}\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "backgroundSize":
      escapedKeys.push(`\\[length:.{1,}\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "backgroundImageUrl":
      escapedKeys.push(`.{1,}`);
      return "(" + escapedKeys.join("|") + ")";
    case "backgroundImage":
      escapedKeys.push(`\\[url\\(.{1,}\\)\\]`);
      return "(" + escapedKeys.join("|") + ")";
    case "order":
    case "zIndex":
      escapedKeys.push(genericArbitraryOption);
      return "(" + escapedKeys.join("|") + ")";
    case "fontWeight":
    case "typography":
    case "lineClamp":
      return "(" + escapedKeys.join("|") + ")";
    case "aspectRatio":
    case "flexGrow":
    case "flexShrink":
    case "fontFamily":
    case "flex":
    case "borderRadius":
    default:
      escapedKeys.push(genericArbitraryOption);
      return "(" + escapedKeys.join("|") + ")";
  }
}
function patchRegex(re, config) {
  if (!cachedRegexes.has(config)) {
    cachedRegexes.set(config, {});
  }
  const cache = cachedRegexes.get(config);
  if (re in cache) {
    return cache[re];
  }
  let patched = "\\!?";
  if (config.prefix.length) {
    patched += escapeSpecialChars(config.prefix);
  }
  let replaced = re;
  const propsRe = /\$\{(\-?[a-z]*)\}/gi;
  const res = replaced.matchAll(propsRe);
  const resArray = [...res];
  const props = resArray.map((arr) => arr[1]);
  if (props.length === 0) {
    return cache[re] = `${patched}(${replaced})`;
  }
  props.forEach((prop) => {
    const token = new RegExp("\\$\\{" + prop + "\\}");
    const isNegative = prop.substr(0, 1) === "-";
    const absoluteProp = isNegative ? prop.substr(1) : prop;
    if (prop === "dark") {
      replaced = replaced.replace(token, generateOptions(absoluteProp, [], config, isNegative));
      return `${patched}(${replaced})`;
    } else if (prop === "arbitraryProperties") {
      replaced = replaced.replace(
        new RegExp("\\$\\{" + absoluteProp + "\\}"),
        generateOptions(absoluteProp, [], config, isNegative)
      );
      return `${patched}(${replaced})`;
    } else if (prop === "backgroundImageUrl") {
      replaced = replaced.replace(new RegExp("\\$\\{" + prop + "\\}"), generateOptions(prop, [], config, false));
      return `${patched}(${replaced})`;
    } else if (!config.theme || !config.theme[absoluteProp]) {
      return;
    }
    const keys = Object.keys(config.theme[absoluteProp]).filter((key) => {
      if (isNegative) {
        const val = config.theme[absoluteProp][key];
        const isCalc = typeof val === "string" && val.indexOf("calc") === 0;
        const num = parseFloat(val);
        if (isCalc) {
          return true;
        }
        if (isNaN(num)) {
          return false;
        }
      } else if (key[0] === "-") {
        return false;
      }
      return true;
    }).map((key) => {
      if (isNegative && key[0] === "-") {
        return key.substring(1);
      }
      return key;
    });
    if (keys.length === 0 || replaced.match(token) === null) {
      return;
    }
    const opts = generateOptions(absoluteProp, keys, config, isNegative);
    replaced = replaced.replace(token, opts);
  });
  return cache[re] = `${patched}(${replaced})`;
}
function getGroups(groupsConfig, twConfig = null) {
  const groups2 = [];
  groupsConfig.forEach((group) => {
    group.members.forEach((prop) => {
      if (typeof prop.members === "string") {
        groups2.push(prop.members);
      } else {
        prop.members.forEach((subprop) => {
          groups2.push(subprop.members);
        });
      }
    });
  });
  if (twConfig === null) {
    return groups2;
  }
  return groups2.map((re) => patchRegex(re, twConfig));
}
function initGroupSlots(groups2) {
  const slots = [];
  groups2.forEach((g) => slots.push([]));
  return slots;
}
function getGroupIndex(name2, arr, separator = ":") {
  const classSuffix = getSuffix(name2, separator);
  let idx = arr.findIndex((pattern) => {
    const classRe = new RegExp(`^(${pattern})$`);
    return classRe.test(classSuffix);
  }, classSuffix);
  return idx;
}
function getGroupConfigKeys(groupsConfig) {
  const groups2 = [];
  groupsConfig.forEach((group) => {
    group.members.forEach((prop) => {
      if (typeof prop.members === "string") {
        groups2.push(prop.configKey ? prop.configKey : null);
      } else {
        prop.members.forEach((subprop) => {
          groups2.push(subprop.configKey ? subprop.configKey : null);
        });
      }
    });
  });
  return groups2;
}
function getPrefix(name2, separator) {
  const rootSeparator = String.raw`(?<!\[[a-z0-9\-]*)(${separator})(?![a-z0-9\-]*\])`;
  const rootSeparatorRegex = new RegExp(rootSeparator);
  let classname = name2;
  let index = 0;
  let results;
  while ((results = rootSeparatorRegex.exec(classname)) !== null) {
    const newIndex = results.index + separator.length;
    index += newIndex;
    classname = classname.substring(newIndex);
  }
  return index ? name2.substring(0, index) : "";
}
function getArbitraryProperty(name2, separator) {
  const arbitraryPropPattern = String.raw`^\[([a-z\-]*)${separator}\.*`;
  const arbitraryPropRegExp = new RegExp(arbitraryPropPattern);
  const results = arbitraryPropRegExp.exec(name2);
  return results === null ? "" : results[1];
}
function getSuffix(className, separator = ":") {
  const prefix = getPrefix(className, separator);
  return className.substring(prefix.length);
}
function findInGroup(name2, group, config, parentType = null) {
  if (typeof group.members === "string") {
    const pattern = patchRegex(group.members, config);
    const classRe = new RegExp(`^(${pattern})$`);
    if (classRe.test(name2)) {
      const res = classRe.exec(name2);
      let value = "";
      if (res && res.groups) {
        if (res.groups.value) {
          value = res.groups.value;
        }
        if (res.groups.negativeValue) {
          value = "-" + res.groups.negativeValue;
        }
      }
      return {
        group: parentType,
        ...group,
        value
      };
    } else {
      return null;
    }
  } else {
    const innerGroup = group.members.find((v) => findInGroup(name2, v, config, group.type));
    if (!innerGroup) {
      return null;
    } else {
      return findInGroup(name2, innerGroup, config, group.type);
    }
  }
}
function parseClassname(name2, arr, config, index = null) {
  const leadingRe = new RegExp("^(?<leading>\\s*)");
  const trailingRe = new RegExp("(?<trailing>\\s*)$");
  let leading = "";
  let core = "";
  let trailing = "";
  const leadingRes = leadingRe.exec(name2);
  if (leadingRes && leadingRes.groups) {
    leading = leadingRes.groups.leading || "";
  }
  const trailingRes = trailingRe.exec(name2);
  if (trailingRes && trailingRes.groups) {
    trailing = trailingRes.groups.trailing || "";
  }
  core = name2.substring(leading.length, name2.length - trailing.length);
  const variants = getPrefix(core, config.separator);
  const classSuffix = getSuffix(core, config.separator);
  let slot = null;
  arr.forEach((group) => {
    if (slot === null) {
      const found = findInGroup(classSuffix, group, config);
      if (found) {
        slot = found;
      }
    }
  });
  const value = slot ? slot.value : "";
  const isNegative = value[0] === "-";
  const off = isNegative ? 1 : 0;
  const body = core.substr(0, core.length - value.length + off).substr(variants.length + off);
  return {
    index,
    name: core,
    variants,
    parentType: slot ? slot.group : "",
    body,
    value,
    shorthand: slot && slot.shorthand ? slot.shorthand : "",
    leading,
    trailing,
    important: body.substr(0, 1) === "!"
  };
}
var cachedRegexes, groupMethods_default;
var init_groupMethods = __esm({
  "src/util/groupMethods.ts"() {
    "use strict";
    init_angle();
    init_color();
    init_length();
    cachedRegexes = /* @__PURE__ */ new WeakMap();
    groupMethods_default = {
      initGroupSlots,
      getArbitraryProperty,
      getGroups,
      getGroupIndex,
      getGroupConfigKeys,
      getPrefix,
      getSuffix,
      parseClassname
    };
  }
});

// src/rules/enforces-negative-arbitrary-values.ts
var NEGATIVE_ARBITRARY_VALUE, enforces_negative_arbitrary_values_default;
var init_enforces_negative_arbitrary_values = __esm({
  "src/rules/enforces-negative-arbitrary-values.ts"() {
    "use strict";
    init_ast();
    init_customConfig();
    init_docsUrl();
    init_groupMethods();
    init_parser();
    init_settings();
    NEGATIVE_ARBITRARY_VALUE = `Arbitrary value classname '{{classname}}' should not start with a dash (-)`;
    enforces_negative_arbitrary_values_default = {
      meta: {
        docs: {
          description: "Warns about dash prefixed classnames using arbitrary values",
          category: "Best Practices",
          recommended: true,
          url: docsUrl_default("enforces-negative-arbitrary-values")
        },
        messages: {
          negativeArbitraryValue: NEGATIVE_ARBITRARY_VALUE
        },
        fixable: null,
        schema: [
          {
            type: "object",
            properties: {
              callees: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              ignoredKeys: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              config: {
                // returned from `loadConfig()` utility
                type: ["string", "object"]
              },
              tags: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              }
            }
          }
        ]
      },
      create: function(context) {
        const callees = settings_default(context, "callees");
        const skipClassAttribute = settings_default(context, "skipClassAttribute");
        const tags = settings_default(context, "tags");
        const twConfig = settings_default(context, "config");
        const classRegex = settings_default(context, "classRegex");
        const mergedConfig2 = customConfig_default.resolve(twConfig);
        const parseForNegativeArbitraryClassNames = (node, arg = null) => {
          let originalClassNamesValue = null;
          if (arg === null) {
            originalClassNamesValue = ast_default.extractValueFromNode(node);
          } else {
            switch (arg.type) {
              case "Identifier":
                return;
              case "TemplateLiteral":
                arg.expressions.forEach((exp) => {
                  parseForNegativeArbitraryClassNames(node, exp);
                });
                arg.quasis.forEach((quasis) => {
                  parseForNegativeArbitraryClassNames(node, quasis);
                });
                return;
              case "ConditionalExpression":
                parseForNegativeArbitraryClassNames(node, arg.consequent);
                parseForNegativeArbitraryClassNames(node, arg.alternate);
                return;
              case "LogicalExpression":
                parseForNegativeArbitraryClassNames(node, arg.right);
                return;
              case "ArrayExpression":
                arg.elements.forEach((el) => {
                  parseForNegativeArbitraryClassNames(node, el);
                });
                return;
              case "ObjectExpression":
                const isUsedByClassNamesPlugin = node.callee && node.callee.name === "classnames";
                const isVue = node.key && node.key.type === "VDirectiveKey";
                arg.properties.forEach((prop) => {
                  const propVal = isUsedByClassNamesPlugin || isVue ? prop.key : prop.value;
                  parseForNegativeArbitraryClassNames(node, propVal);
                });
                return;
              case "Property":
                parseForNegativeArbitraryClassNames(node, arg.key);
                return;
              case "Literal":
                originalClassNamesValue = arg.value;
                break;
              case "TemplateElement":
                originalClassNamesValue = arg.value.raw;
                if (originalClassNamesValue === "") {
                  return;
                }
                break;
            }
          }
          let { classNames } = ast_default.extractClassnamesFromValue(originalClassNamesValue);
          const detected = classNames.filter((cls) => {
            const suffix = groupMethods_default.getSuffix(cls, mergedConfig2.separator);
            const negArbitraryValRegEx = /^\-((inset|scale)(\-(y|x))?|top|right|bottom|left|top|z|order|(scroll\-)?m(y|x|t|r|l|b)?|(skew|space|translate)\-(y|x)|rotate|tracking|indent|(backdrop\-)?hue\-rotate)\-\[.*\]$/i;
            return negArbitraryValRegEx.test(suffix);
          });
          detected.forEach((className) => {
            context.report({
              node,
              messageId: "negativeArbitraryValue",
              data: {
                classname: className
              }
            });
          });
        };
        const attributeVisitor = function(node) {
          if (!ast_default.isClassAttribute(node, classRegex) || skipClassAttribute) {
            return;
          }
          if (ast_default.isLiteralAttributeValue(node)) {
            parseForNegativeArbitraryClassNames(node);
          } else if (node.value && node.value.type === "JSXExpressionContainer") {
            parseForNegativeArbitraryClassNames(node, node.value.expression);
          }
        };
        const callExpressionVisitor = function(node) {
          const calleeStr = ast_default.calleeToString(node.callee);
          if (callees.findIndex((name2) => calleeStr === name2) === -1) {
            return;
          }
          node.arguments.forEach((arg) => {
            parseForNegativeArbitraryClassNames(node, arg);
          });
        };
        const scriptVisitor = {
          JSXAttribute: attributeVisitor,
          TextAttribute: attributeVisitor,
          CallExpression: callExpressionVisitor,
          TaggedTemplateExpression: function(node) {
            if (!tags.includes(node.tag.name ?? node.tag.object?.name ?? node.tag.callee?.name)) {
              return;
            }
            parseForNegativeArbitraryClassNames(node, node.quasi);
          }
        };
        const templateVisitor = {
          CallExpression: callExpressionVisitor,
          /*
          Tagged templates inside data bindings
          https://github.com/vuejs/vue/issues/9721
          */
          VAttribute: function(node) {
            switch (true) {
              case !ast_default.isValidVueAttribute(node, classRegex):
                return;
              case ast_default.isVLiteralValue(node):
                parseForNegativeArbitraryClassNames(node);
                break;
              case ast_default.isArrayExpression(node):
                node.value.expression.elements.forEach((arg) => {
                  parseForNegativeArbitraryClassNames(node, arg);
                });
                break;
              case ast_default.isObjectExpression(node):
                node.value.expression.properties.forEach((prop) => {
                  parseForNegativeArbitraryClassNames(node, prop);
                });
                break;
            }
          }
        };
        return parser_default.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
      }
    };
  }
});

// src/configs/groups.ts
var groups;
var init_groups = __esm({
  "src/configs/groups.ts"() {
    "use strict";
    groups = [
      {
        type: "Core Concepts",
        members: [
          {
            type: "Hover, Focus, & Other States",
            members: [
              {
                type: "group",
                members: "group"
              },
              {
                type: "peer",
                members: "peer"
              }
            ]
          },
          {
            type: "Dark Mode",
            members: "${dark}"
          },
          {
            type: "Arbitrary properties",
            members: "${arbitraryProperties}"
          }
        ]
      },
      {
        type: "Layout",
        members: [
          {
            type: "Aspect Ratio",
            members: "aspect\\-(?<value>${aspectRatio})",
            configKey: "aspectRatio"
          },
          {
            type: "Container",
            members: "container"
          },
          {
            type: "Columns",
            members: "columns\\-(?<value>${columns})",
            configKey: "columns"
          },
          {
            type: "Break After",
            members: "break\\-after\\-(?<value>auto|avoid|all|avoid\\-page|page|left|right|column)"
          },
          {
            type: "Break Before",
            members: "break\\-before\\-(?<value>auto|avoid|all|avoid\\-page|page|left|right|column)"
          },
          {
            type: "Break Inside",
            members: "break\\-inside\\-(?<value>auto|avoid|avoid\\-page|avoid\\-column)"
          },
          {
            type: "Box Decoration Break",
            members: "box\\-decoration\\-(?<value>clone|slice)"
          },
          {
            type: "Deprecated Box Decoration Break",
            members: "decoration\\-(?<value>clone|slice)",
            deprecated: true
          },
          {
            type: "Box Sizing",
            members: "box\\-(?<value>border|content)"
          },
          {
            type: "Display",
            members: "block|flex|grid|flow\\-root|contents|hidden|inline(\\-(block|flex|table|grid))?|table\\-(column|footer|header|row)\\-group|table(\\-(caption|row|cell|column))?|list\\-item"
          },
          {
            type: "Floats",
            members: "float\\-(?<value>right|left|none)"
          },
          {
            type: "Clear",
            members: "clear\\-(?<value>left|right|both|none)"
          },
          {
            type: "Isolation",
            members: "(isolate|isolation\\-auto)"
          },
          {
            type: "Object Fit",
            members: "object\\-(?<value>contain|cover|fill|none|scale\\-down)"
          },
          {
            type: "Object Position",
            members: "object\\-(?<value>${objectPosition})",
            configKey: "objectPosition"
          },
          {
            type: "Overflow",
            members: [
              {
                type: "overflow",
                members: "overflow\\-(?<value>auto|hidden|clip|visible|scroll)",
                shorthand: "all",
                body: "overflow"
              },
              {
                type: "overflow-x",
                members: "overflow\\-x\\-(?<value>auto|hidden|clip|visible|scroll)",
                shorthand: "x",
                body: "overflow-x"
              },
              {
                type: "overflow-y",
                members: "overflow\\-y\\-(?<value>auto|hidden|clip|visible|scroll)",
                shorthand: "y",
                body: "overflow-y"
              }
            ]
          },
          {
            type: "Overscroll Behavior",
            members: [
              {
                type: "overscroll",
                members: "overscroll\\-(?<value>auto|contain|none)",
                shorthand: "all",
                body: "overscroll"
              },
              {
                type: "overscroll-x",
                members: "overscroll\\-x\\-(?<value>auto|contain|none)",
                shorthand: "x",
                body: "overscroll-x"
              },
              {
                type: "overscroll-y",
                members: "overscroll\\-y\\-(?<value>auto|contain|none)",
                shorthand: "y",
                body: "overscroll-y"
              }
            ]
          },
          {
            type: "Position",
            members: "static|fixed|absolute|relative|sticky"
          },
          {
            type: "Top / Right / Bottom / Left",
            members: [
              {
                type: "inset",
                members: "(inset\\-(?<value>${inset})|\\-inset\\-(?<negativeValue>${-inset}))",
                shorthand: "all",
                body: "inset",
                configKey: "inset"
              },
              {
                type: "inset-y",
                members: "(inset\\-y\\-(?<value>${inset})|\\-inset\\-y\\-(?<negativeValue>${-inset}))",
                shorthand: "y",
                body: "inset-y",
                configKey: "inset"
              },
              {
                type: "inset-x",
                members: "(inset\\-x\\-(?<value>${inset})|\\-inset\\-x\\-(?<negativeValue>${-inset}))",
                shorthand: "x",
                body: "inset-x",
                configKey: "inset"
              },
              {
                type: "top",
                members: "(top\\-(?<value>${inset})|\\-top\\-(?<negativeValue>${-inset}))",
                shorthand: "t",
                body: "top",
                configKey: "inset"
              },
              {
                type: "right",
                members: "(right\\-(?<value>${inset})|\\-right\\-(?<negativeValue>${-inset}))",
                shorthand: "r",
                body: "right",
                configKey: "inset"
              },
              {
                type: "bottom",
                members: "(bottom\\-(?<value>${inset})|\\-bottom\\-(?<negativeValue>${-inset}))",
                shorthand: "b",
                body: "bottom",
                configKey: "inset"
              },
              {
                type: "left",
                members: "(left\\-(?<value>${inset})|\\-left\\-(?<negativeValue>${-inset}))",
                shorthand: "l",
                body: "left",
                configKey: "inset"
              }
            ]
          },
          {
            type: "Visibility",
            members: "(in)?visible|collapse"
          },
          {
            type: "Z-Index",
            members: "(z\\-(?<value>${zIndex})|\\-z\\-(?<negativeValue>${-zIndex}))",
            configKey: "zIndex"
          }
        ]
      },
      {
        type: "Flexbox & Grid",
        members: [
          {
            type: "Flex Basis",
            members: "basis\\-(?<value>${flexBasis})",
            configKey: "flexBasis"
          },
          {
            type: "Flex Direction",
            members: "flex\\-(row|col)(\\-reverse)?"
          },
          {
            type: "Flex Wrap",
            members: "flex\\-(wrap(\\-reverse)?|nowrap)"
          },
          {
            type: "Flex",
            members: "flex\\-(?<value>${flex})",
            configKey: "flex"
          },
          {
            type: "Flex Grow",
            members: "grow(\\-(?<value>${flexGrow}))?",
            configKey: "flexGrow"
          },
          {
            type: "Deprecated Flex Grow",
            members: "flex\\-grow(\\-(?<value>${flexGrow}))?",
            deprecated: true,
            configKey: "flexGrow"
          },
          {
            type: "Flex Shrink",
            members: "shrink(\\-(?<value>${flexShrink}))?",
            configKey: "flexShrink"
          },
          {
            type: "Deprecated Flex Shrink",
            members: "flex\\-shrink(\\-(?<value>${flexShrink}))?",
            deprecated: true,
            configKey: "flexShrink"
          },
          {
            type: "Order",
            members: "(order\\-(?<value>${order})|\\-order\\-(?<negativeValue>${-order}))",
            configKey: "order"
          },
          {
            type: "Grid Template Columns",
            members: "grid\\-cols\\-(?<value>${gridTemplateColumns})",
            configKey: "gridTemplateColumns"
          },
          {
            type: "Grid Column Start / End",
            members: [
              {
                type: "grid-column",
                members: "col\\-(?<value>${gridColumn})",
                configKey: "gridColumn"
              },
              {
                type: "grid-column-start",
                members: "col\\-start\\-(?<value>${gridColumnStart})",
                configKey: "gridColumnStart"
              },
              {
                type: "grid-column-end",
                members: "col\\-end\\-(?<value>${gridColumnEnd})",
                configKey: "gridColumnEnd"
              }
            ]
          },
          {
            type: "Grid Template Rows",
            members: "grid\\-rows\\-(?<value>${gridTemplateRows})",
            configKey: "gridTemplateRows"
          },
          {
            type: "Grid Row Start / End",
            members: [
              {
                type: "grid-row",
                members: "row\\-(?<value>${gridRow})",
                configKey: "gridRow"
              },
              {
                type: "grid-row-start",
                members: "row\\-start\\-(?<value>${gridRowStart})",
                configKey: "gridRowStart"
              },
              {
                type: "grid-row-end",
                members: "row\\-end\\-(?<value>${gridRowEnd})",
                configKey: "gridRowEnd"
              }
            ]
          },
          {
            type: "Grid Auto Flow",
            members: "grid\\-flow\\-(dense|(row|col)(\\-dense)?)"
          },
          {
            type: "Grid Auto Columns",
            members: "auto\\-cols\\-(?<value>${gridAutoColumns})",
            configKey: "gridAutoColumns"
          },
          {
            type: "Grid Auto Rows",
            members: "auto\\-rows\\-(?<value>${gridAutoRows})",
            configKey: "gridAutoRows"
          },
          {
            type: "Gap",
            members: [
              {
                type: "gap",
                members: "gap\\-(?<value>${gap})",
                shorthand: "all",
                body: "gap",
                configKey: "gap"
              },
              {
                type: "column-gap",
                members: "gap\\-x\\-(?<value>${gap})",
                shorthand: "x",
                body: "gap-x",
                configKey: "gap"
              },
              {
                type: "row-gap",
                members: "gap\\-y\\-(?<value>${gap})",
                shorthand: "y",
                body: "gap-y",
                configKey: "gap"
              }
            ]
          },
          {
            type: "Justify Content",
            members: "justify\\-(start|end|center|between|around|evenly)"
          },
          {
            type: "Justify Items",
            members: "justify\\-items\\-(start|end|center|stretch)"
          },
          {
            type: "Justify Self",
            members: "justify\\-self\\-(auto|start|end|center|stretch)"
          },
          {
            type: "Align Content",
            members: "content\\-(center|start|end|between|around|evenly|baseline)"
          },
          {
            type: "Align Items",
            members: "items\\-(start|end|center|baseline|stretch)"
          },
          {
            type: "Align Self",
            members: "self\\-(auto|start|end|center|stretch|baseline)"
          },
          {
            type: "Place Content",
            members: "place\\-content\\-(center|start|end|between|around|evenly|stretch|baseline)"
          },
          {
            type: "Place Items",
            members: "place\\-items\\-(start|end|center|stretch|baseline)"
          },
          {
            type: "Place Self",
            members: "place\\-self\\-(auto|start|end|center|stretch)"
          }
        ]
      },
      {
        type: "Spacing",
        members: [
          {
            type: "Padding",
            members: [
              {
                type: "p",
                members: "p\\-(?<value>${padding})",
                shorthand: "all",
                body: "p",
                configKey: "padding"
              },
              {
                type: "py",
                members: "py\\-(?<value>${padding})",
                shorthand: "y",
                body: "py",
                configKey: "padding"
              },
              {
                type: "px",
                members: "px\\-(?<value>${padding})",
                shorthand: "x",
                body: "px",
                configKey: "padding"
              },
              {
                type: "pt",
                members: "pt\\-(?<value>${padding})",
                shorthand: "t",
                body: "pt",
                configKey: "padding"
              },
              {
                type: "pr",
                members: "pr\\-(?<value>${padding})",
                shorthand: "r",
                body: "pr",
                configKey: "padding"
              },
              {
                type: "pb",
                members: "pb\\-(?<value>${padding})",
                shorthand: "b",
                body: "pb",
                configKey: "padding"
              },
              {
                type: "pl",
                members: "pl\\-(?<value>${padding})",
                shorthand: "l",
                body: "pl",
                configKey: "padding"
              }
            ]
          },
          {
            type: "Margin",
            members: [
              {
                type: "m",
                members: "(m\\-(?<value>${margin})|\\-m\\-(?<negativeValue>${-margin}))",
                shorthand: "all",
                body: "m",
                configKey: "margin"
              },
              {
                type: "my",
                members: "(my\\-(?<value>${margin})|\\-my\\-(?<negativeValue>${-margin}))",
                shorthand: "y",
                body: "my",
                configKey: "margin"
              },
              {
                type: "mx",
                members: "(mx\\-(?<value>${margin})|\\-mx\\-(?<negativeValue>${-margin}))",
                shorthand: "x",
                body: "mx",
                configKey: "margin"
              },
              {
                type: "mt",
                members: "(mt\\-(?<value>${margin})|\\-mt\\-(?<negativeValue>${-margin}))",
                shorthand: "t",
                body: "mt",
                configKey: "margin"
              },
              {
                type: "mr",
                members: "(mr\\-(?<value>${margin})|\\-mr\\-(?<negativeValue>${-margin}))",
                shorthand: "r",
                body: "mr",
                configKey: "margin"
              },
              {
                type: "mb",
                members: "(mb\\-(?<value>${margin})|\\-mb\\-(?<negativeValue>${-margin}))",
                shorthand: "b",
                body: "mb",
                configKey: "margin"
              },
              {
                type: "ml",
                members: "(ml\\-(?<value>${margin})|\\-ml\\-(?<negativeValue>${-margin}))",
                shorthand: "l",
                body: "ml",
                configKey: "margin"
              }
            ]
          },
          {
            type: "Space Between",
            members: [
              {
                type: "space-y",
                members: "(space\\-y\\-(?<value>${space})|\\-space\\-y\\-(?<negativeValue>${-space}))",
                configKey: "space"
              },
              {
                type: "space-x",
                members: "(space\\-x\\-(?<value>${space})|\\-space\\-x\\-(?<negativeValue>${-space}))",
                configKey: "space"
              },
              {
                type: "space-y-reverse",
                members: "space\\-y\\-reverse"
              },
              {
                type: "space-x-reverse",
                members: "space\\-x\\-reverse"
              }
            ]
          }
        ]
      },
      {
        type: "Sizing",
        members: [
          {
            type: "Width",
            members: "w\\-(?<value>${width})",
            configKey: "width"
          },
          {
            type: "Min-Width",
            members: "min\\-w\\-(?<value>${minWidth})",
            configKey: "minWidth"
          },
          {
            type: "Max-Width",
            members: "max\\-w\\-(?<value>${maxWidth})",
            configKey: "maxWidth"
          },
          {
            type: "Height",
            members: "h\\-(?<value>${height})",
            configKey: "height"
          },
          {
            type: "Min-Height",
            members: "min\\-h\\-(?<value>${minHeight})",
            configKey: "minHeight"
          },
          {
            type: "Max-Height",
            members: "max\\-h\\-(?<value>${maxHeight})",
            configKey: "maxHeight"
          },
          {
            type: "Size",
            members: "size\\-(?<value>${size})",
            configKey: "size"
          }
        ]
      },
      {
        type: "Typography",
        members: [
          {
            type: "Font Family",
            members: "font\\-(?<value>${fontFamily})",
            configKey: "fontFamily"
          },
          {
            type: "Font Size",
            members: "text\\-(?<value>${fontSize})",
            configKey: "fontSize"
          },
          {
            type: "Font Smoothing",
            members: "(subpixel\\-)?antialiased"
          },
          {
            type: "Font Style",
            members: "(not\\-)?italic"
          },
          {
            type: "Font Weight",
            members: "font\\-(?<value>${fontWeight})",
            configKey: "fontWeight"
          },
          {
            type: "Font Variant Numeric",
            members: [
              {
                type: "Normal Nums",
                members: "normal\\-nums"
              },
              {
                type: "Ordinal",
                members: "ordinal"
              },
              {
                type: "Slashed Zero",
                members: "slashed-zero"
              },
              {
                type: "Style Nums",
                members: "(lining|oldstyle)\\-nums"
              },
              {
                type: "Proportinal or Tabular",
                members: "(proportional|tabular)\\-nums"
              },
              {
                type: "Fractions",
                members: "(diagonal|stacked)\\-fractions"
              }
            ]
          },
          {
            type: "Letter Spacing",
            members: "(tracking\\-(?<value>${letterSpacing})|\\-tracking\\-(?<negativeValue>${-letterSpacing}))",
            configKey: "letterSpacing"
          },
          // {
          //   type: 'Line Clamp',
          //   members: 'line\\-clamp\\-(?<value>${lineClamp})',
          //   configKey: 'lineClamp',
          // },
          {
            type: "Line Height",
            members: "leading\\-(?<value>${lineHeight})",
            configKey: "lineHeight"
          },
          // {
          //   type: 'List Style Image',
          //   members: 'list\\-image\\-(?<value>${listStyleImage})',
          //   configKey: 'listStyleImage',
          // },
          {
            type: "List Style Type",
            members: "list\\-(?<value>${listStyleType})",
            configKey: "listStyleType"
          },
          {
            type: "List Style Position",
            members: "list\\-(in|out)side"
          },
          {
            type: "Text Alignment",
            members: "text\\-(left|center|right|justify|start|end)"
          },
          {
            type: "Text Color",
            members: "text\\-(?<value>${textColor})",
            configKey: "colors"
          },
          {
            type: "Text Decoration",
            members: "(no\\-)?underline|overline|line\\-through"
          },
          {
            type: "Text Decoration Color",
            members: "decoration\\-(?<value>${colors})",
            configKey: "colors"
          },
          {
            type: "Text Decoration Style",
            members: "decoration\\-(solid|double|dotted|dashed|wavy)"
          },
          {
            type: "Text Decoration Thickness",
            members: "decoration\\-(?<value>${textDecorationThickness})",
            configKey: "textDecorationThickness"
          },
          {
            type: "Text Underline Offset",
            members: "underline\\-offset\\-(?<value>${textUnderlineOffset})",
            configKey: "textUnderlineOffset"
          },
          {
            type: "Text Transform",
            members: "(upper|lower|normal\\-)case|capitalize"
          },
          {
            type: "Text Overflow",
            members: "truncate|text\\-(ellipsis|clip)"
          },
          {
            type: "Deprecated Text Overflow",
            members: "overflow\\-(ellipsis|clip)",
            deprecated: true
          },
          {
            type: "Text Wrap",
            members: "text\\-(wrap|nowrap|balance|pretty)"
          },
          {
            type: "Text Indent",
            members: "(indent\\-(?<value>${textIndent})|\\-indent\\-(?<negativeValue>${-textIndent}))",
            configKey: "textIndent"
          },
          {
            type: "Vertical Alignment",
            members: "align\\-(baseline|top|middle|bottom|text\\-(top|bottom)|sub|super)"
          },
          {
            type: "Whitespace",
            members: "whitespace\\-(normal|nowrap|pre(\\-(line|wrap))?)"
          },
          {
            type: "Word Break",
            members: "break\\-(normal|words|all|keep)"
          },
          {
            type: "Content",
            members: "content\\-(?<value>${content})",
            configKey: "content"
          }
        ]
      },
      {
        type: "Backgrounds",
        members: [
          {
            type: "Background Image URL",
            members: "bg\\-\\[(image\\:|url\\()(?<value>${backgroundImageUrl})\\)\\]"
          },
          {
            type: "Background Attachment",
            members: "bg\\-(fixed|local|scroll)"
          },
          {
            type: "Background Clip",
            members: "bg\\-clip\\-(border|padding|content|text)"
          },
          {
            type: "Background Color",
            members: "bg\\-(?<value>${colors})",
            configKey: "colors"
          },
          {
            type: "Deprecated Background Opacity",
            members: "bg\\-opacity\\-(?<value>${backgroundOpacity})",
            deprecated: true
          },
          {
            type: "Background Origin",
            members: "bg\\-origin\\-(border|padding|content)"
          },
          {
            type: "Background Position",
            members: "bg\\-(?<value>${backgroundPosition})",
            configKey: "backgroundPosition"
          },
          {
            type: "Background Repeat",
            members: "bg\\-(no\\-repeat|repeat(\\-(x|y|round|space))?)"
          },
          {
            type: "Background Size",
            members: "bg\\-(?<value>${backgroundSize})",
            configKey: "backgroundSize"
          },
          {
            type: "Background Image",
            members: "bg\\-(?<value>${backgroundImage})",
            configKey: "backgroundImage"
          },
          {
            type: "Gradient Color Stops",
            members: [
              {
                type: "from",
                members: "from\\-(?<value>${gradientColorStopPositions})",
                configKey: "gradientColorStopPositions"
              },
              {
                type: "via",
                members: "via\\-(?<value>${gradientColorStopPositions})",
                configKey: "gradientColorStopPositions"
              },
              {
                type: "to",
                members: "to\\-(?<value>${gradientColorStopPositions})",
                configKey: "gradientColorStopPositions"
              }
            ]
          }
        ]
      },
      {
        type: "Borders",
        members: [
          {
            type: "Border Radius",
            members: [
              {
                type: "border-radius",
                members: "rounded(\\-(?<value>${borderRadius}))?",
                shorthand: "all",
                body: "rounded",
                configKey: "borderRadius"
              },
              {
                type: "border-radius-top",
                members: "rounded\\-t(\\-(?<value>${borderRadius}))?",
                shorthand: "t",
                body: "rounded-t",
                configKey: "borderRadius"
              },
              {
                type: "border-radius-right",
                members: "rounded\\-r(\\-(?<value>${borderRadius}))?",
                shorthand: "r",
                body: "rounded-r",
                configKey: "borderRadius"
              },
              {
                type: "border-radius-bottom",
                members: "rounded\\-b(\\-(?<value>${borderRadius}))?",
                shorthand: "b",
                body: "rounded-b",
                configKey: "borderRadius"
              },
              {
                type: "border-radius-left",
                members: "rounded\\-l(\\-(?<value>${borderRadius}))?",
                shorthand: "l",
                body: "rounded-l",
                configKey: "borderRadius"
              },
              {
                type: "border-radius-top-left",
                members: "rounded\\-tl(\\-(?<value>${borderRadius}))?",
                shorthand: "tl",
                body: "rounded-tl",
                configKey: "borderRadius"
              },
              {
                type: "border-radius-top-right",
                members: "rounded\\-tr(\\-(?<value>${borderRadius}))?",
                shorthand: "tr",
                body: "rounded-tr",
                configKey: "borderRadius"
              },
              {
                type: "border-radius-bottom-right",
                members: "rounded\\-br(\\-(?<value>${borderRadius}))?",
                shorthand: "br",
                body: "rounded-br",
                configKey: "borderRadius"
              },
              {
                type: "border-radius-bottom-left",
                members: "rounded\\-bl(\\-(?<value>${borderRadius}))?",
                shorthand: "bl",
                body: "rounded-bl",
                configKey: "borderRadius"
              }
            ]
          },
          {
            type: "Border Width",
            members: [
              {
                type: "border-width",
                members: "border(\\-(?<value>${borderWidth}))?",
                shorthand: "all",
                body: "border",
                configKey: "borderWidth"
              },
              {
                type: "border-y-width",
                members: "border\\-y(\\-(?<value>${borderWidth}))?",
                shorthand: "y",
                body: "border-y",
                configKey: "borderWidth"
              },
              {
                type: "border-x-width",
                members: "border\\-x(\\-(?<value>${borderWidth}))?",
                shorthand: "x",
                body: "border-x",
                configKey: "borderWidth"
              },
              {
                type: "border-top-width",
                members: "border\\-t(\\-(?<value>${borderWidth}))?",
                shorthand: "t",
                body: "border-t",
                configKey: "borderWidth"
              },
              {
                type: "border-right-width",
                members: "border\\-r(\\-(?<value>${borderWidth}))?",
                shorthand: "r",
                body: "border-r",
                configKey: "borderWidth"
              },
              {
                type: "border-bottom-width",
                members: "border\\-b(\\-(?<value>${borderWidth}))?",
                shorthand: "b",
                body: "border-b",
                configKey: "borderWidth"
              },
              {
                type: "border-left-width",
                members: "border\\-l(\\-(?<value>${borderWidth}))?",
                shorthand: "l",
                body: "border-l",
                configKey: "borderWidth"
              }
            ]
          },
          {
            type: "Border Color",
            members: [
              {
                type: "border-color",
                members: "border\\-(?<value>${borderColor})",
                shorthand: "all",
                body: "border",
                configKey: "borderColor"
              },
              {
                type: "border-y-color",
                members: "border\\-y\\-(?<value>${borderColor})",
                shorthand: "y",
                body: "border-y",
                configKey: "borderColor"
              },
              {
                type: "border-x-color",
                members: "border\\-x\\-(?<value>${borderColor})",
                shorthand: "x",
                body: "border-x",
                configKey: "borderColor"
              },
              {
                type: "border-top-color",
                members: "border\\-t\\-(?<value>${borderColor})",
                shorthand: "t",
                body: "border-t",
                configKey: "borderColor"
              },
              {
                type: "border-right-color",
                members: "border\\-r\\-(?<value>${borderColor})",
                shorthand: "r",
                body: "border-r",
                configKey: "borderColor"
              },
              {
                type: "border-bottom-color",
                members: "border\\-b\\-(?<value>${borderColor})",
                shorthand: "b",
                body: "border-b",
                configKey: "borderColor"
              },
              {
                type: "border-left-color",
                members: "border\\-l\\-(?<value>${borderColor})",
                shorthand: "l",
                body: "border-l",
                configKey: "borderColor"
              }
            ]
          },
          {
            type: "Deprecated Border Opacity",
            members: "border\\-opacity\\-(?<value>${borderOpacity})",
            deprecated: true,
            configKey: "borderOpacity"
          },
          {
            type: "Border Style",
            members: "border\\-(solid|dashed|dotted|double|hidden|none)"
          },
          {
            type: "Divide Width",
            members: [
              {
                type: "divide-y",
                members: "divide\\-y(\\-(?<value>${divideWidth}))?",
                configKey: "divideWidth"
              },
              {
                type: "divide-x",
                members: "divide\\-x(\\-(?<value>${divideWidth}))?",
                configKey: "divideWidth"
              },
              {
                type: "divide-y-reverse",
                members: "divide\\-y\\-reverse"
              },
              {
                type: "divide-x-reverse",
                members: "divide\\-x\\-reverse"
              }
            ]
          },
          {
            type: "Divide Color",
            members: "divide\\-(?<value>${divideColor})",
            configKey: "divideColor"
          },
          {
            type: "Divide Style",
            members: "divide\\-(solid|dashed|dotted|double|none)"
          },
          {
            type: "Outline Width",
            members: "outline\\-(?<value>${outlineWidth})",
            configKey: "outlineWidth"
          },
          {
            type: "Outline Color",
            members: "outline\\-(?<value>${outlineColor})",
            configKey: "outlineColor"
          },
          {
            type: "Outline Style",
            members: "outline(\\-(none|dashed|dotted|double|hidden))?"
          },
          {
            type: "Outline Offset",
            members: "(outline\\-offset\\-(?<value>${outlineOffset})|\\-outline\\-offset\\-(?<negativeValue>${-outlineOffset}))",
            configKey: "outlineOffset"
          },
          {
            type: "Ring Width",
            members: [
              {
                type: "ring",
                members: "ring(\\-(?<value>${ringWidth}))?",
                configKey: "ringWidth"
              }
            ]
          },
          {
            type: "Ring Inset",
            members: [
              {
                type: "ring-inset",
                members: "ring\\-inset"
              }
            ]
          },
          {
            type: "Ring Color",
            members: "ring\\-(?<value>${colors})",
            configKey: "colors"
          },
          {
            type: "Deprecated Ring Opacity",
            members: "ring\\-opacity\\-(?<value>${ringOpacity})",
            deprecated: true,
            configKey: "ringOpacity"
          },
          {
            type: "Ring Offset Width",
            members: "ring\\-offset\\-(?<value>${ringOffsetWidth})",
            configKey: "ringOffsetWidth"
          },
          {
            type: "Ring Offset Color",
            members: "ring\\-offset\\-(?<value>${colors})",
            configKey: "colors"
          }
        ]
      },
      {
        type: "Effects",
        members: [
          {
            type: "Box Shadow",
            members: "shadow(\\-(?<value>${boxShadow}))?",
            configKey: "boxShadow"
          },
          {
            type: "Box Shadow Color",
            members: "shadow(\\-(?<value>${boxShadowColor}))?",
            configKey: "boxShadowColor"
          },
          {
            type: "Opacity",
            members: "opacity\\-(?<value>${opacity})",
            configKey: "opacity"
          },
          {
            type: "Mix Blend Mode",
            members: "mix\\-blend\\-(normal|multiply|screen|overlay|darken|lighten|color\\-(burn|dodge)|(hard|soft)\\-light|difference|exclusion|hue|saturation|color|luminosity|plus\\-lighter)"
          },
          {
            type: "Background Blend Mode",
            members: "bg\\-blend\\-(normal|multiply|screen|overlay|darken|lighten|color\\-(dodge|burn)|(hard|soft)\\-light|difference|exclusion|hue|saturation|color|luminosity)"
          }
        ]
      },
      {
        type: "Filters",
        members: [
          {
            type: "Deprecated Filter",
            members: "filter",
            deprecated: true
          },
          {
            type: "Blur",
            members: "blur(\\-(?<value>${blur}))?",
            configKey: "blur"
          },
          {
            type: "Brightness",
            members: "brightness\\-(?<value>${brightness})",
            configKey: "brightness"
          },
          {
            type: "Contrast",
            members: "contrast\\-(?<value>${contrast})",
            configKey: "contrast"
          },
          {
            type: "Drop Shadow",
            members: "drop\\-shadow(\\-(?<value>${dropShadow}))?",
            configKey: "dropShadow"
          },
          {
            type: "Grayscale",
            members: "grayscale(\\-(?<value>${grayscale}))?",
            configKey: "grayscale"
          },
          {
            type: "Hue Rotate",
            members: "hue\\-rotate\\-(?<value>${hueRotate})|\\-hue\\-rotate\\-(?<negativeValue>${-hueRotate})",
            configKey: "hueRotate"
          },
          {
            type: "Invert",
            members: "invert(\\-(?<value>${invert}))?",
            configKey: "invert"
          },
          {
            type: "Saturate",
            members: "saturate\\-(?<value>${saturate})",
            configKey: "saturate"
          },
          {
            type: "Sepia",
            members: "sepia(\\-(?<value>${sepia}))?",
            configKey: "sepia"
          },
          {
            type: "Backdrop Blur",
            members: "backdrop\\-blur(\\-(?<value>${backdropBlur}))?",
            configKey: "backdropBlur"
          },
          {
            type: "Backdrop Brightness",
            members: "backdrop\\-brightness\\-(?<value>${backdropBrightness})",
            configKey: "backdropBrightness"
          },
          {
            type: "Backdrop Contrast",
            members: "backdrop\\-contrast\\-(?<value>${backdropContrast})",
            configKey: "backdropContrast"
          },
          {
            type: "Backdrop Grayscale",
            members: "backdrop\\-grayscale(\\-(?<value>${backdropGrayscale}))?",
            configKey: "backdropGrayscale"
          },
          {
            type: "Backdrop Hue Rotate",
            members: "backdrop\\-hue\\-rotate\\-(?<value>${backdropHueRotate})|\\-backdrop\\-hue\\-rotate\\-(?<negativeValue>${-backdropHueRotate})",
            configKey: "backdropHueRotate"
          },
          {
            type: "Backdrop Invert",
            members: "backdrop\\-invert(\\-(?<value>${backdropInvert}))?",
            configKey: "backdropInvert"
          },
          {
            type: "Backdrop Opacity",
            members: "backdrop\\-opacity\\-(?<value>${backdropOpacity})",
            configKey: "backdropOpacity"
          },
          {
            type: "Backdrop Saturate",
            members: "backdrop\\-saturate\\-(?<value>${backdropSaturate})",
            configKey: "backdropSaturate"
          },
          {
            type: "Backdrop Sepia",
            members: "backdrop\\-sepia(\\-(?<value>${backdropSepia}))?",
            configKey: "backdropSepia"
          }
        ]
      },
      {
        type: "Tables",
        members: [
          {
            type: "Border Collapse",
            members: "border\\-(collapse|separate)"
          },
          {
            type: "Border Spacing",
            members: [
              {
                type: "border-spacing",
                members: "border\\-spacing\\-(?<value>${borderSpacing})",
                shorthand: "all",
                body: "border-spacing",
                configKey: "borderSpacing"
              },
              {
                type: "border-spacing-x",
                members: "border\\-spacing\\-x\\-(?<value>${borderSpacing})",
                shorthand: "x",
                body: "border-spacing-x",
                configKey: "borderSpacing"
              },
              {
                type: "border-spacing-y",
                members: "border\\-spacing\\-y\\-(?<value>${borderSpacing})",
                shorthand: "y",
                body: "border-spacing-y",
                configKey: "borderSpacing"
              }
            ]
          },
          {
            type: "Table Layout",
            members: "table\\-(auto|fixed)"
          }
        ]
      },
      {
        type: "Transitions & Animation",
        members: [
          {
            type: "Transition Property",
            members: "transition(\\-(?<value>${transitionProperty}))?",
            configKey: "transitionProperty"
          },
          {
            type: "Transition Duration",
            members: "duration(\\-(?<value>${transitionDuration}))?",
            configKey: "transitionDuration"
          },
          {
            type: "Transition Timing Function",
            members: "ease(\\-(?<value>${transitionTimingFunction}))?",
            configKey: "transitionTimingFunction"
          },
          {
            type: "Transition Delay",
            members: "delay\\-(?<value>${transitionDelay})",
            configKey: "transitionDelay"
          },
          {
            type: "Animation",
            members: "animate\\-(?<value>${animation})",
            configKey: "animation"
          }
        ]
      },
      {
        type: "Transforms",
        members: [
          {
            type: "Transform GPU",
            members: [
              {
                type: "transform-gpu",
                members: "transform\\-gpu"
              }
            ]
          },
          {
            type: "Transform None",
            members: [
              {
                type: "transform-none",
                members: "transform\\-none"
              }
            ]
          },
          {
            type: "Deprecated Transform",
            members: [
              {
                type: "transform",
                members: "transform",
                deprecated: true
              }
            ]
          },
          {
            type: "Scale",
            members: [
              {
                type: "scale",
                members: "scale\\-(?<value>${scale})|\\-scale\\-(?<negativeValue>${-scale})",
                shorthand: "all",
                body: "scale",
                configKey: "scale"
              },
              {
                type: "scale-y",
                members: "scale\\-y\\-(?<value>${scale})|\\-scale\\-y\\-(?<negativeValue>${-scale})",
                shorthand: "y",
                body: "scale-y",
                configKey: "scale"
              },
              {
                type: "scale-x",
                members: "scale\\-x\\-(?<value>${scale})|\\-scale\\-x\\-(?<negativeValue>${-scale})",
                shorthand: "x",
                body: "scale-x",
                configKey: "scale"
              }
            ]
          },
          {
            type: "Rotate",
            members: "(rotate\\-(?<value>${rotate})|\\-rotate\\-(?<negativeValue>${-rotate}))",
            configKey: "rotate"
          },
          {
            type: "Translate",
            members: [
              {
                type: "translate-x",
                members: "(translate\\-x\\-(?<value>${translate})|\\-translate\\-x\\-(?<negativeValue>${-translate}))",
                configKey: "translate"
              },
              {
                type: "translate-y",
                members: "(translate\\-y\\-(?<value>${translate})|\\-translate\\-y\\-(?<negativeValue>${-translate}))",
                configKey: "translate"
              }
            ]
          },
          {
            type: "Skew",
            members: [
              {
                type: "skew-x",
                members: "(skew\\-x\\-(?<value>${skew})|\\-skew\\-x\\-(?<negativeValue>${-skew}))",
                configKey: "skew"
              },
              {
                type: "skew-y",
                members: "(skew\\-y\\-(?<value>${skew})|\\-skew\\-y\\-(?<negativeValue>${-skew}))",
                configKey: "skew"
              }
            ]
          },
          {
            type: "Transform Origin",
            members: "origin\\-(?<value>${transformOrigin})",
            configKey: "transformOrigin"
          }
        ]
      },
      {
        type: "Interactivity",
        members: [
          {
            type: "Accent Color",
            members: "accent\\-(?<value>${accentColor})",
            configKey: "accentColor"
          },
          {
            type: "Appearance",
            members: "appearance\\-none"
          },
          {
            type: "Cursor",
            members: "cursor\\-(?<value>${cursor})",
            configKey: "cursor"
          },
          {
            type: "Caret Color",
            members: "caret\\-(?<value>${colors})",
            configKey: "colors"
          },
          {
            type: "Pointer Events",
            members: "pointer\\-events\\-(none|auto)"
          },
          {
            type: "Resize",
            members: "resize(\\-(none|x|y))?"
          },
          {
            type: "Scroll Behavior",
            members: "scroll\\-(auto|smooth)"
          },
          {
            type: "Scroll Margin",
            members: "scroll\\-(?<value>${scrollMargin})",
            configKey: "scrollMargin",
            members: [
              {
                type: "scroll-m",
                members: "scroll-m\\-(?<value>${scrollMargin})|\\-scroll-m\\-(?<negativeValue>${-scrollMargin})",
                configKey: "scrollMargin"
              },
              {
                type: "scroll-my",
                members: "scroll-my\\-(?<value>${scrollMargin})|\\-scroll-my\\-(?<negativeValue>${-scrollMargin})",
                configKey: "scrollMargin"
              },
              {
                type: "scroll-mx",
                members: "scroll-mx\\-(?<value>${scrollMargin})|\\-scroll-mx\\-(?<negativeValue>${-scrollMargin})",
                configKey: "scrollMargin"
              },
              {
                type: "scroll-mt",
                members: "scroll-mt\\-(?<value>${scrollMargin})|\\-scroll-mt\\-(?<negativeValue>${-scrollMargin})",
                configKey: "scrollMargin"
              },
              {
                type: "scroll-mr",
                members: "scroll-mr\\-(?<value>${scrollMargin})|\\-scroll-mr\\-(?<negativeValue>${-scrollMargin})",
                configKey: "scrollMargin"
              },
              {
                type: "scroll-mb",
                members: "scroll-mb\\-(?<value>${scrollMargin})|\\-scroll-mb\\-(?<negativeValue>${-scrollMargin})",
                configKey: "scrollMargin"
              },
              {
                type: "scroll-ml",
                members: "scroll-ml\\-(?<value>${scrollMargin})|\\-scroll-ml\\-(?<negativeValue>${-scrollMargin})",
                configKey: "scrollMargin"
              }
            ]
          },
          {
            type: "Scroll Padding",
            members: "scroll\\-(?<value>${scrollPadding})",
            configKey: "scrollPadding",
            members: [
              {
                type: "scroll-p",
                members: "scroll-p\\-(?<value>${scrollPadding})",
                configKey: "scrollPadding"
              },
              {
                type: "scroll-py",
                members: "scroll-py\\-(?<value>${scrollPadding})",
                configKey: "scrollPadding"
              },
              {
                type: "scroll-px",
                members: "scroll-px\\-(?<value>${scrollPadding})",
                configKey: "scrollPadding"
              },
              {
                type: "scroll-pt",
                members: "scroll-pt\\-(?<value>${scrollPadding})",
                configKey: "scrollPadding"
              },
              {
                type: "scroll-pr",
                members: "scroll-pr\\-(?<value>${scrollPadding})",
                configKey: "scrollPadding"
              },
              {
                type: "scroll-pb",
                members: "scroll-pb\\-(?<value>${scrollPadding})",
                configKey: "scrollPadding"
              },
              {
                type: "scroll-pl",
                members: "scroll-pl\\-(?<value>${scrollPadding})",
                configKey: "scrollPadding"
              }
            ]
          },
          {
            type: "Scroll Snap Align",
            members: "snap\\-(start|end|center|align-none)"
          },
          {
            type: "Scroll Snap Stop",
            members: "snap\\-(normal|always)"
          },
          {
            type: "Scroll Snap Type",
            members: "snap\\-(none|x|y|both)"
          },
          {
            type: "Scroll Snap Type Strictness",
            members: "snap\\-(mandatory|proximity)"
          },
          {
            type: "Touch Action",
            members: [
              {
                type: "Touch Action Mode",
                members: "touch\\-(auto|none|manipulation)"
              },
              {
                type: "Touch Action X",
                members: "touch\\-(pan\\-(x|left|right))"
              },
              {
                type: "Touch Action Y",
                members: "touch\\-(pan\\-(y|up|down))"
              },
              {
                type: "Touch Action Pinch Zoom",
                members: "touch\\-pinch\\-zoom"
              }
            ]
          },
          {
            type: "User Select",
            members: "select\\-(none|text|all|auto)"
          },
          {
            type: "Will Change",
            members: "will\\-change\\-(?<value>${willChange})",
            configKey: "willChange"
          }
        ]
      },
      {
        type: "SVG",
        members: [
          {
            type: "Fill",
            members: "fill\\-(?<value>${fill})",
            configKey: "fill"
          },
          {
            type: "Stroke",
            members: "stroke\\-(?<value>${stroke})",
            configKey: "stroke"
          },
          {
            type: "Stroke Width",
            members: "stroke\\-(?<value>${strokeWidth})",
            configKey: "strokeWidth"
          }
        ]
      },
      {
        type: "Accessibility",
        members: [
          {
            type: "Screen Readers",
            members: "(not\\-)?sr\\-only"
          },
          {
            type: "Forced Color Adjust",
            members: "forced\\-color\\-adjust\\-(auto|none)"
          }
        ]
      },
      {
        type: "Official Plugins",
        members: [
          {
            // TODO:
            // Support for custom prose classname like on
            // https://tailwindcss.com/docs/typography-plugin#changing-the-default-class-name
            // Adding custom color themes
            // https://tailwindcss.com/docs/typography-plugin#adding-custom-color-themes
            type: "Typography",
            members: [
              {
                type: "prose",
                members: "(not\\-)?prose"
              },
              {
                type: "Prose Gray Scale",
                members: "prose\\-(gray|slate|zinc|neutral|stone)"
              },
              {
                type: "Prose Type Scale",
                members: "prose\\-(sm|base|lg|2?xl)"
              },
              {
                type: "Prose Dark Mode",
                members: "prose\\-invert"
              }
              // These are modifiers and not the last part of the classname
              // {
              //   type: 'Prose Element modifiers',
              //   members:
              //     'prose\\-(headings|lead|h1|h2|h3|h4|p|a|blockquote|figure|figcaption|strong|em|code|pre|ol|ul|li|table|thead|tr|th|td|img|video|hr)',
              // },
            ]
          },
          // ('Forms' plugin has no related classnames, only selectors like `input[type='password']`)
          {
            type: "Aspect Ratio",
            members: [
              {
                type: "aspect-w",
                members: "aspect\\-(none|w\\-(?<value>${aspectRatio}))"
              },
              {
                type: "aspect-h",
                members: "aspect\\-h\\-(?<value>${aspectRatio})"
              }
            ]
          },
          {
            type: "Line Clamp",
            members: "line\\-clamp\\-(none|(?<value>${lineClamp}))"
          }
        ]
      }
    ];
  }
});

// src/rules/enforces-shorthand.ts
var SHORTHAND_CANDIDATE_CLASSNAMES_DETECTED_MSG, enforces_shorthand_default;
var init_enforces_shorthand = __esm({
  "src/rules/enforces-shorthand.ts"() {
    "use strict";
    init_groups();
    init_ast();
    init_customConfig();
    init_docsUrl();
    init_groupMethods();
    init_parser();
    init_settings();
    SHORTHAND_CANDIDATE_CLASSNAMES_DETECTED_MSG = `Classnames '{{classnames}}' could be replaced by the '{{shorthand}}' shorthand!`;
    enforces_shorthand_default = {
      meta: {
        docs: {
          description: "Enforces the usage of shorthand Tailwind CSS classnames",
          category: "Best Practices",
          recommended: true,
          url: docsUrl_default("enforces-shorthand")
        },
        messages: {
          shorthandCandidateDetected: SHORTHAND_CANDIDATE_CLASSNAMES_DETECTED_MSG
        },
        fixable: "code",
        schema: [
          {
            type: "object",
            properties: {
              callees: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              ignoredKeys: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              config: {
                // returned from `loadConfig()` utility
                type: ["string", "object"]
              },
              tags: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              }
            }
          }
        ]
      },
      create: function(context) {
        const callees = settings_default(context, "callees");
        const skipClassAttribute = settings_default(context, "skipClassAttribute");
        const tags = settings_default(context, "tags");
        const twConfig = settings_default(context, "config");
        const classRegex = settings_default(context, "classRegex");
        const mergedConfig2 = customConfig_default.resolve(twConfig);
        const placeContentOptions = ["center", "start", "end", "between", "around", "evenly", "baseline", "stretch"];
        const placeItemsOptions = ["start", "end", "center", "stretch"];
        const placeSelfOptions = ["auto", "start", "end", "center", "stretch"];
        const complexEquivalences = [
          {
            needles: ["overflow-hidden", "text-ellipsis", "whitespace-nowrap"],
            shorthand: "truncate",
            mode: "exact"
          },
          {
            needles: ["w-", "h-"],
            shorthand: "size-",
            mode: "value"
          },
          ...placeContentOptions.map((opt) => {
            return {
              needles: [`content-${opt}`, `justify-${opt}`],
              shorthand: `place-content-${opt}`,
              mode: "exact"
            };
          }),
          ...placeItemsOptions.map((opt) => {
            return {
              needles: [`items-${opt}`, `justify-items-${opt}`],
              shorthand: `place-items-${opt}`,
              mode: "exact"
            };
          }),
          ...placeSelfOptions.map((opt) => {
            return {
              needles: [`self-${opt}`, `justify-self-${opt}`],
              shorthand: `place-self-${opt}`,
              mode: "exact"
            };
          })
        ];
        const targetProperties = {
          Layout: ["Overflow", "Overscroll Behavior", "Top / Right / Bottom / Left"],
          "Flexbox & Grid": ["Gap"],
          Spacing: ["Padding", "Margin"],
          Sizing: ["Width", "Height"],
          Borders: ["Border Radius", "Border Width", "Border Color"],
          Tables: ["Border Spacing"],
          Transforms: ["Scale"],
          Typography: ["Text Overflow", "Whitespace"]
        };
        const cloned = JSON.parse(JSON.stringify(groups));
        const targetGroups = cloned.filter((g) => Object.keys(targetProperties).includes(g.type));
        targetGroups.forEach((g) => {
          g.members = g.members.filter((sub) => targetProperties[g.type].includes(sub.type));
        });
        const getBodyByShorthand = (targetGroups2, parentType, shorthand) => {
          const findByMemberType = (obj) => obj.members.find((m) => m.type === parentType);
          const mainGroup = targetGroups2.find(findByMemberType);
          if (!mainGroup) {
            return "";
          }
          const typeGroup = mainGroup.members.find((m) => m.type === parentType);
          if (!typeGroup) {
            return "";
          }
          const type = typeGroup.members.find((m) => m.shorthand === shorthand);
          return !type ? "" : type.body;
        };
        const parseForShorthandCandidates = (node, arg = null) => {
          let originalClassNamesValue = null;
          let start = null;
          let end = null;
          let prefix = "";
          let suffix = "";
          const troubles = [];
          if (arg === null) {
            originalClassNamesValue = ast_default.extractValueFromNode(node);
            const range = ast_default.extractRangeFromNode(node);
            if (node.type === "TextAttribute") {
              start = range[0];
              end = range[1];
            } else {
              start = range[0] + 1;
              end = range[1] - 1;
            }
          } else {
            switch (arg.type) {
              case "Identifier":
                return;
              case "TemplateLiteral":
                arg.expressions.forEach((exp) => {
                  parseForShorthandCandidates(node, exp);
                });
                arg.quasis.forEach((quasis) => {
                  parseForShorthandCandidates(node, quasis);
                });
                return;
              case "ConditionalExpression":
                parseForShorthandCandidates(node, arg.consequent);
                parseForShorthandCandidates(node, arg.alternate);
                return;
              case "LogicalExpression":
                parseForShorthandCandidates(node, arg.right);
                return;
              case "ArrayExpression":
                arg.elements.forEach((el) => {
                  parseForShorthandCandidates(node, el);
                });
                return;
              case "ObjectExpression":
                const isUsedByClassNamesPlugin = node.callee && node.callee.name === "classnames";
                const isVue = node.key && node.key.type === "VDirectiveKey";
                arg.properties.forEach((prop) => {
                  const propVal = isUsedByClassNamesPlugin || isVue ? prop.key : prop.value;
                  parseForShorthandCandidates(node, propVal);
                });
                return;
              case "Property":
                parseForShorthandCandidates(node, arg.key);
                return;
              case "Literal":
                originalClassNamesValue = arg.value;
                start = arg.range[0] + 1;
                end = arg.range[1] - 1;
                break;
              case "TemplateElement":
                originalClassNamesValue = arg.value.raw;
                if (originalClassNamesValue === "") {
                  return;
                }
                start = arg.range[0];
                end = arg.range[1];
                const txt = context.getSourceCode().getText(arg);
                prefix = ast_default.getTemplateElementPrefix(txt, originalClassNamesValue);
                suffix = ast_default.getTemplateElementSuffix(txt, originalClassNamesValue);
                originalClassNamesValue = ast_default.getTemplateElementBody(txt, prefix, suffix);
                break;
            }
          }
          let { classNames, whitespaces, headSpace, tailSpace } = ast_default.extractClassnamesFromValue(originalClassNamesValue);
          if (classNames.length <= 1) {
            return;
          }
          const parsed = [];
          classNames.forEach((className, index) => {
            parsed.push(groupMethods_default.parseClassname(className, targetGroups, mergedConfig2, index));
          });
          const validated = [];
          let remaining = parsed;
          for (const { needles: inputSet, shorthand: outputClassname, mode } of complexEquivalences) {
            if (remaining.length < inputSet.length) {
              continue;
            }
            const parsedElementsInInputSet = remaining.filter((remainingClass) => {
              if (mode === "exact") {
                return inputSet.some((inputClass) => remainingClass.name.includes(inputClass));
              }
              if (mode === "value") {
                const bodyMatch = inputSet.some(
                  (inputClassPattern) => `${mergedConfig2.prefix}${inputClassPattern}` === remainingClass.body
                );
                if ([void 0, null].includes(mergedConfig2.theme.size)) {
                  return false;
                }
                const sizeKeys = Object.keys(mergedConfig2.theme.size);
                const isSize = ["w-", "h-"].includes(remainingClass.body);
                const isValidSize = sizeKeys.includes(remainingClass.value);
                const wValue = mergedConfig2.theme.width[remainingClass.value];
                const hValue = mergedConfig2.theme.height[remainingClass.value];
                const sizeValue = mergedConfig2.theme.size[remainingClass.value];
                const fullMatch = wValue === hValue && wValue === sizeValue;
                return bodyMatch && !(isSize && !isValidSize && !fullMatch);
              }
            });
            const variantGroups = /* @__PURE__ */ new Map();
            parsedElementsInInputSet.forEach((o) => {
              const val = mode === "value" ? o.value : "";
              const v = `${o.variants}${o.important ? "!" : ""}${val}`;
              if (!variantGroups.has(v)) {
                variantGroups.set(
                  v,
                  parsedElementsInInputSet.filter(
                    (c) => c.variants === o.variants && c.important === o.important && (val === "" || c.value === val)
                  )
                );
              }
            });
            const validKeys = /* @__PURE__ */ new Set();
            variantGroups.forEach((classes, key) => {
              let skip = false;
              if (classes.length < inputSet.length) {
                skip = true;
              }
              if (mode === "value" && new Set(classes.map((p) => p.value)).size !== 1) {
                skip = true;
              }
              if (!skip) {
                validKeys.add(key);
              }
            });
            validKeys.forEach((k) => {
              const candidates = variantGroups.get(k);
              const index = candidates[0].index;
              const variants = candidates[0].variants;
              const important = candidates[0].important ? "!" : "";
              const classValue = mode === "value" ? candidates[0].value : "";
              const patchedClassname = `${variants}${important}${mergedConfig2.prefix}${outputClassname}${classValue}`;
              troubles.push([candidates.map((c) => `${c.name}`), patchedClassname]);
              const validatedClassname = groupMethods_default.parseClassname(patchedClassname, targetGroups, mergedConfig2, index);
              validated.push(validatedClassname);
              remaining = remaining.filter((p) => !candidates.includes(p));
            });
          }
          const checkedGroups = [];
          remaining.forEach((classname, idx, arr) => {
            if (classname.parentType === "") {
              validated.push(classname);
            } else if (!checkedGroups.includes(classname.parentType)) {
              checkedGroups.push(classname.parentType);
              const sameType = remaining.filter((cls) => cls.parentType === classname.parentType);
              const checkedVariantsValue = [];
              sameType.forEach((cls) => {
                const key = cls.variants + (cls.important ? "!" : "") + cls.value;
                if (!checkedVariantsValue.includes(key)) {
                  checkedVariantsValue.push(key);
                  const sameVariantAndValue = sameType.filter((v) => {
                    return !(v.variants !== cls.variants || v.value !== cls.value || v.important !== cls.important);
                  });
                  if (sameVariantAndValue.length === 1) {
                    validated.push(cls);
                  } else if (sameVariantAndValue.length) {
                    const supportCorners = ["Border Radius"].includes(classname.parentType);
                    const hasTL = supportCorners && sameVariantAndValue.some((c) => ["tl", "t", "all"].includes(c.shorthand));
                    const hasTR = supportCorners && sameVariantAndValue.some((c) => ["tr", "t", "all"].includes(c.shorthand));
                    const hasBR = supportCorners && sameVariantAndValue.some((c) => ["br", "b", "all"].includes(c.shorthand));
                    const hasBL = supportCorners && sameVariantAndValue.some((c) => ["bl", "b", "all"].includes(c.shorthand));
                    const hasT = sameVariantAndValue.some((c) => c.shorthand === "t") || hasTL && hasTR;
                    const hasR = sameVariantAndValue.some((c) => c.shorthand === "r") || hasTR && hasBR;
                    const hasB = sameVariantAndValue.some((c) => c.shorthand === "b") || hasBL && hasBR;
                    const hasL = sameVariantAndValue.some((c) => c.shorthand === "l") || hasTL && hasBL;
                    const hasX = sameVariantAndValue.some((c) => c.shorthand === "x") || hasL && hasR;
                    const hasY = sameVariantAndValue.some((c) => c.shorthand === "y") || hasT && hasB;
                    const hasAllProp = sameVariantAndValue.some((c) => c.shorthand === "all");
                    const hasAllPropNoCorner = hasY && hasX;
                    const hasAllPropWithCorners = hasL && hasR || hasT && hasB;
                    const hasAllEquivalent = !supportCorners ? hasAllPropNoCorner : hasAllPropWithCorners;
                    const hasAll = hasAllProp || hasAllEquivalent;
                    const important = cls.important ? "!" : "";
                    const isNegative = ("" + cls.value).substring(0, 1) === "-";
                    const minus = isNegative ? "-" : "";
                    const absoluteVal = isNegative ? ("" + cls.value).substring(1) : cls.value;
                    if (hasAll) {
                      const all = getBodyByShorthand(targetGroups, classname.parentType, "all");
                      const val = absoluteVal.length ? "-" + absoluteVal : "";
                      const patchedName = `${cls.variants}${important}${minus}${mergedConfig2.prefix}${all}${val}`;
                      troubles.push([sameVariantAndValue.map((c) => c.name), patchedName]);
                      cls.name = patchedName;
                      cls.shorthand = "all";
                      validated.push(cls);
                    } else if (hasY || hasX) {
                      const xOrY = hasX ? "x" : "y";
                      const xOrYType = getBodyByShorthand(targetGroups, classname.parentType, xOrY);
                      const patchedName = `${cls.variants}${important}${minus}${mergedConfig2.prefix}${xOrYType}${absoluteVal.length ? "-" + absoluteVal : ""}`;
                      const toBeReplaced = sameVariantAndValue.filter((c) => {
                        const candidates = hasX ? ["l", "r"] : ["t", "b"];
                        return candidates.includes(c.shorthand);
                      }).map((c) => c.name);
                      const toBeKept = sameVariantAndValue.filter((c) => {
                        const candidates = hasY ? ["l", "r"] : ["t", "b"];
                        return candidates.includes(c.shorthand);
                      });
                      troubles.push([toBeReplaced, patchedName]);
                      let replaced = false;
                      sameVariantAndValue.forEach((ref, i) => {
                        if (toBeKept.find((k) => k.name === ref.name)) {
                          validated.push(ref);
                        } else if (!replaced) {
                          replaced = true;
                          const cloned2 = JSON.parse(JSON.stringify(ref));
                          cloned2.name = patchedName;
                          cloned2.shorthand = xOrY;
                          validated.push(cloned2);
                        }
                      });
                    } else if (supportCorners && (hasT || hasR || hasB || hasL)) {
                      const side = hasT ? "t" : hasR ? "r" : hasB ? "b" : "l";
                      const sideBody = getBodyByShorthand(targetGroups, classname.parentType, side);
                      const val = absoluteVal.length ? "-" + absoluteVal : "";
                      const patchedName = `${cls.variants}${important}${minus}${mergedConfig2.prefix}${sideBody}${val}`;
                      const toBeReplaced = sameVariantAndValue.filter((c) => {
                        const candidates = hasT ? ["tl", "tr"] : hasR ? ["tr", "br"] : hasB ? ["bl", "br"] : ["tl", "bl"];
                        return candidates.includes(c.shorthand);
                      }).map((c) => c.name);
                      const toBeKept = sameVariantAndValue.filter((c) => {
                        const candidates = hasT ? ["bl", "br"] : hasR ? ["tl", "bl"] : hasB ? ["tl", "tr"] : ["tr", "br"];
                        return candidates.includes(c.shorthand);
                      });
                      troubles.push([toBeReplaced, patchedName]);
                      let replaced = false;
                      sameVariantAndValue.forEach((ref, i) => {
                        if (toBeKept.find((k) => k.name === ref.name)) {
                          validated.push(ref);
                        } else if (!replaced) {
                          replaced = true;
                          const cloned2 = JSON.parse(JSON.stringify(ref));
                          cloned2.name = patchedName;
                          cloned2.shorthand = side;
                          validated.push(cloned2);
                        }
                      });
                    } else {
                      validated.push(...sameVariantAndValue);
                    }
                  }
                }
              });
            }
          });
          validated.sort((a, b) => a.index < b.index ? -1 : 1);
          const union = validated.map((val) => val.leading + val.name + val.trailing);
          let validatedClassNamesValue = "";
          if (union.length === 1) {
            validatedClassNamesValue += headSpace ? whitespaces[0] : "";
            validatedClassNamesValue += union[0];
            validatedClassNamesValue += tailSpace ? whitespaces[whitespaces.length - 1] : "";
          } else {
            for (let i = 0; i < union.length; i++) {
              const isLast = i === union.length - 1;
              const w = whitespaces[i] ?? "";
              const cls = union[i];
              validatedClassNamesValue += headSpace ? `${w}${cls}` : isLast ? `${cls}` : `${cls}${w}`;
              if (tailSpace && isLast) {
                validatedClassNamesValue += whitespaces[whitespaces.length - 1] ?? "";
              }
            }
          }
          troubles.forEach((issue) => {
            if (originalClassNamesValue !== validatedClassNamesValue) {
              validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;
              context.report({
                node,
                messageId: "shorthandCandidateDetected",
                data: {
                  classnames: issue[0].join(", "),
                  shorthand: issue[1]
                },
                fix: function(fixer) {
                  return fixer.replaceTextRange([start, end], validatedClassNamesValue);
                }
              });
            }
          });
        };
        const attributeVisitor = function(node) {
          if (!ast_default.isClassAttribute(node, classRegex) || skipClassAttribute) {
            return;
          }
          if (ast_default.isLiteralAttributeValue(node)) {
            parseForShorthandCandidates(node);
          } else if (node.value && node.value.type === "JSXExpressionContainer") {
            parseForShorthandCandidates(node, node.value.expression);
          }
        };
        const callExpressionVisitor = function(node) {
          const calleeStr = ast_default.calleeToString(node.callee);
          if (callees.findIndex((name2) => calleeStr === name2) === -1) {
            return;
          }
          node.arguments.forEach((arg) => {
            parseForShorthandCandidates(node, arg);
          });
        };
        const scriptVisitor = {
          JSXAttribute: attributeVisitor,
          TextAttribute: attributeVisitor,
          CallExpression: callExpressionVisitor,
          TaggedTemplateExpression: function(node) {
            if (!tags.includes(node.tag.name ?? node.tag.object?.name ?? node.tag.callee?.name)) {
              return;
            }
            parseForShorthandCandidates(node, node.quasi);
          }
        };
        const templateVisitor = {
          CallExpression: callExpressionVisitor,
          /*
          Tagged templates inside data bindings
          https://github.com/vuejs/vue/issues/9721
          */
          VAttribute: function(node) {
            switch (true) {
              case !ast_default.isValidVueAttribute(node, classRegex):
                return;
              case ast_default.isVLiteralValue(node):
                parseForShorthandCandidates(node);
                break;
              case ast_default.isArrayExpression(node):
                node.value.expression.elements.forEach((arg) => {
                  parseForShorthandCandidates(node, arg);
                });
                break;
              case ast_default.isObjectExpression(node):
                node.value.expression.properties.forEach((prop) => {
                  parseForShorthandCandidates(node, prop);
                });
                break;
            }
          }
        };
        return parser_default.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
      }
    };
  }
});

// src/rules/migration-from-tailwind-2.ts
var docsUrl2, customConfig, astUtil, groupUtil, getOption2, parserUtil, CLASSNAME_NOT_NEEDED_MSG, CLASSNAMES_NOT_NEEDED_MSG, CLASSNAME_CHANGED_MSG, OPACITY_CLASS_DEPRECATED_MSG, migration_from_tailwind_2_default;
var init_migration_from_tailwind_2 = __esm({
  "src/rules/migration-from-tailwind-2.ts"() {
    "use strict";
    docsUrl2 = (init_docsUrl(), __toCommonJS(docsUrl_exports));
    customConfig = (init_customConfig(), __toCommonJS(customConfig_exports));
    astUtil = (init_ast(), __toCommonJS(ast_exports));
    groupUtil = (init_groupMethods(), __toCommonJS(groupMethods_exports));
    getOption2 = (init_settings(), __toCommonJS(settings_exports));
    parserUtil = (init_parser(), __toCommonJS(parser_exports));
    CLASSNAME_NOT_NEEDED_MSG = `Classname '{{classnames}}' is not needed in Tailwind CSS v3!`;
    CLASSNAMES_NOT_NEEDED_MSG = `Classnames '{{classnames}}' are not needed in Tailwind CSS v3!`;
    CLASSNAME_CHANGED_MSG = `Classname '{{deprecated}}' should be updated to '{{updated}}' in Tailwind CSS v3!`;
    OPACITY_CLASS_DEPRECATED_MSG = `Classname '{{classname}}' should be replaced by an opacity suffix (eg. '/{{value}}')`;
    migration_from_tailwind_2_default = {
      meta: {
        docs: {
          description: "Detect obsolete classnames when upgrading to Tailwind CSS v3",
          category: "Possible Errors",
          recommended: true,
          url: docsUrl2("migration-from-tailwind-2")
        },
        messages: {
          classnameNotNeeded: CLASSNAME_NOT_NEEDED_MSG,
          classnamesNotNeeded: CLASSNAMES_NOT_NEEDED_MSG,
          classnameChanged: CLASSNAME_CHANGED_MSG,
          classnameOpacityDeprecated: OPACITY_CLASS_DEPRECATED_MSG
        },
        fixable: "code",
        schema: [
          {
            type: "object",
            properties: {
              callees: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              ignoredKeys: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              config: {
                // returned from `loadConfig()` utility
                type: ["string", "object"]
              },
              tags: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              }
            }
          }
        ]
      },
      create: function(context) {
        const callees = getOption2(context, "callees");
        const skipClassAttribute = getOption2(context, "skipClassAttribute");
        const tags = getOption2(context, "tags");
        const twConfig = getOption2(context, "config");
        const classRegex = getOption2(context, "classRegex");
        const mergedConfig2 = customConfig.resolve(twConfig);
        const parseForObsoleteClassNames = (node, arg = null) => {
          let originalClassNamesValue = null;
          let start = null;
          let end = null;
          let prefix = "";
          let suffix = "";
          if (arg === null) {
            originalClassNamesValue = astUtil.extractValueFromNode(node);
            const range = astUtil.extractRangeFromNode(node);
            if (node.type === "TextAttribute") {
              start = range[0];
              end = range[1];
            } else {
              start = range[0] + 1;
              end = range[1] - 1;
            }
          } else {
            switch (arg.type) {
              case "Identifier":
                return;
              case "TemplateLiteral":
                arg.expressions.forEach((exp) => {
                  parseForObsoleteClassNames(node, exp);
                });
                arg.quasis.forEach((quasis) => {
                  parseForObsoleteClassNames(node, quasis);
                });
                return;
              case "ConditionalExpression":
                parseForObsoleteClassNames(node, arg.consequent);
                parseForObsoleteClassNames(node, arg.alternate);
                return;
              case "LogicalExpression":
                parseForObsoleteClassNames(node, arg.right);
                return;
              case "ArrayExpression":
                arg.elements.forEach((el) => {
                  parseForObsoleteClassNames(node, el);
                });
                return;
              case "ObjectExpression":
                arg.properties.forEach((prop) => {
                  parseForObsoleteClassNames(node, prop.key);
                });
                return;
              case "Property":
                parseForObsoleteClassNames(node, arg.key);
                return;
              case "Literal":
                originalClassNamesValue = arg.value;
                start = arg.range[0] + 1;
                end = arg.range[1] - 1;
                break;
              case "TemplateElement":
                originalClassNamesValue = arg.value.raw;
                if (originalClassNamesValue === "") {
                  return;
                }
                start = arg.range[0];
                end = arg.range[1];
                const txt = context.getSourceCode().getText(arg);
                prefix = astUtil.getTemplateElementPrefix(txt, originalClassNamesValue);
                suffix = astUtil.getTemplateElementSuffix(txt, originalClassNamesValue);
                originalClassNamesValue = astUtil.getTemplateElementBody(txt, prefix, suffix);
                break;
            }
          }
          let { classNames, whitespaces, headSpace, tailSpace } = astUtil.extractClassnamesFromValue(originalClassNamesValue);
          const notNeeded = [];
          const outdated = [];
          const deprecatedBgOpacity = [];
          const filtered = classNames.filter((cls) => {
            const suffix2 = groupUtil.getSuffix(cls, mergedConfig2.separator);
            if (/^((backdrop\-)?(filter|transform))$/i.test(suffix2)) {
              notNeeded.push(cls);
              return false;
            }
            let overflowRes = /^overflow\-(?<value>clip|ellipsis)$/i.exec(suffix2);
            if (overflowRes && overflowRes.groups && overflowRes.groups.value) {
              outdated.push([cls, cls.replace(/overflow\-(clip|ellipsis)$/i, `text-${overflowRes.groups.value}`)]);
            }
            let growShrinkRes = /flex\-(?<prop>grow|shrink)(\-(?<value>${flexVal}))?/i.exec(suffix2);
            if (growShrinkRes && growShrinkRes.groups && growShrinkRes.groups.prop) {
              const prop = growShrinkRes.groups.prop;
              const flexVal = growShrinkRes.groups.flexVal;
              const optionalVal = flexVal ? `-${flexVal}` : "";
              const fixRegex = new RegExp(`flex-${prop}${optionalVal}`);
              outdated.push([cls, cls.replace(fixRegex, `${prop}${flexVal ? "-" + flexVal : ""}`)]);
            }
            let boxRes = /^decoration\-(?<value>clone|slice)$/i.exec(suffix2);
            if (boxRes && boxRes.groups && boxRes.groups.value) {
              const boxVal = boxRes.groups.value;
              const fixRegex = new RegExp(`decoration-${boxVal}`);
              outdated.push([cls, cls.replace(fixRegex, `box-decoration-${boxVal}`)]);
            }
            let bgOpacityRes = /^(bg|border|ring)\-opacity\-(?<value>\d{1,})$/i.exec(suffix2);
            if (bgOpacityRes && bgOpacityRes.groups && bgOpacityRes.groups.value) {
              const opacityVal = bgOpacityRes.groups.value;
              deprecatedBgOpacity.push([cls, opacityVal]);
            }
            let placeholderRes = /^placeholder\-(?<value>.{1,})$/i.exec(suffix2);
            if (placeholderRes && placeholderRes.groups && placeholderRes.groups.value) {
              const placeholderVal = placeholderRes.groups.value;
              const fixPlaceholderRegex = new RegExp(`placeholder-${placeholderVal}$`);
              outdated.push([cls, cls.replace(fixPlaceholderRegex, `placeholder:text-${placeholderVal}`)]);
            }
            return true;
          });
          if (notNeeded.length) {
            let validatedClassNamesValue = "";
            for (let i = 0; i < filtered.length; i++) {
              const isLast = i === filtered.length - 1;
              const w = whitespaces[i] ?? "";
              const cls = filtered[i];
              validatedClassNamesValue += headSpace ? `${w}${cls}` : isLast ? `${cls}` : `${cls}${w}`;
              if (headSpace && tailSpace && isLast) {
                validatedClassNamesValue += whitespaces[whitespaces.length - 1] ?? "";
              }
            }
            validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;
            context.report({
              node,
              messageId: notNeeded.length === 1 ? "classnameNotNeeded" : "classnamesNotNeeded",
              data: {
                classnames: notNeeded.join(", ")
              },
              fix: function(fixer) {
                return fixer.replaceTextRange([start, end], validatedClassNamesValue);
              }
            });
          }
          outdated.forEach((outdatedClass) => {
            let validatedClassNamesValue = "";
            for (let i = 0; i < filtered.length; i++) {
              const w = whitespaces[i] ?? "";
              const cls = filtered[i];
              validatedClassNamesValue += headSpace ? `${w}${cls}` : `${cls}${w}`;
              if (headSpace && tailSpace && i === filtered.length - 1) {
                validatedClassNamesValue += whitespaces[whitespaces.length - 1] ?? "";
              }
            }
            validatedClassNamesValue = prefix + validatedClassNamesValue.replace(outdatedClass[0], outdatedClass[1]) + suffix;
            context.report({
              node,
              messageId: "classnameChanged",
              data: {
                deprecated: outdatedClass[0],
                updated: outdatedClass[1]
              },
              fix: function(fixer) {
                return fixer.replaceTextRange([start, end], validatedClassNamesValue);
              }
            });
          });
          deprecatedBgOpacity.forEach((bgClass) => {
            context.report({
              node,
              messageId: "classnameOpacityDeprecated",
              data: {
                classname: bgClass[0],
                value: bgClass[1]
              }
            });
          });
        };
        const attributeVisitor = function(node) {
          if (!astUtil.isClassAttribute(node, classRegex) || skipClassAttribute) {
            return;
          }
          if (astUtil.isLiteralAttributeValue(node)) {
            parseForObsoleteClassNames(node);
          } else if (node.value && node.value.type === "JSXExpressionContainer") {
            parseForObsoleteClassNames(node, node.value.expression);
          }
        };
        const callExpressionVisitor = function(node) {
          const calleeStr = astUtil.calleeToString(node.callee);
          if (callees.findIndex((name2) => calleeStr === name2) === -1) {
            return;
          }
          node.arguments.forEach((arg) => {
            parseForObsoleteClassNames(node, arg);
          });
        };
        const scriptVisitor = {
          JSXAttribute: attributeVisitor,
          TextAttribute: attributeVisitor,
          CallExpression: callExpressionVisitor,
          TaggedTemplateExpression: function(node) {
            if (!tags.includes(node.tag.name ?? node.tag.object?.name ?? node.tag.callee?.name)) {
              return;
            }
            parseForObsoleteClassNames(node, node.quasi);
          }
        };
        const templateVisitor = {
          CallExpression: callExpressionVisitor,
          /*
          Tagged templates inside data bindings
          https://github.com/vuejs/vue/issues/9721
          */
          VAttribute: function(node) {
            switch (true) {
              case !astUtil.isValidVueAttribute(node, classRegex):
                return;
              case astUtil.isVLiteralValue(node):
                parseForObsoleteClassNames(node);
                break;
              case astUtil.isArrayExpression(node):
                node.value.expression.elements.forEach((arg) => {
                  parseForObsoleteClassNames(node, arg);
                });
                break;
              case astUtil.isObjectExpression(node):
                node.value.expression.properties.forEach((prop) => {
                  parseForObsoleteClassNames(node, prop);
                });
                break;
            }
          }
        };
        return parserUtil.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
      }
    };
  }
});

// src/rules/no-arbitrary-value.ts
var docsUrl3, customConfig2, astUtil2, groupUtil2, getOption3, parserUtil2, ARBITRARY_VALUE_DETECTED_MSG, no_arbitrary_value_default;
var init_no_arbitrary_value = __esm({
  "src/rules/no-arbitrary-value.ts"() {
    "use strict";
    docsUrl3 = (init_docsUrl(), __toCommonJS(docsUrl_exports));
    customConfig2 = (init_customConfig(), __toCommonJS(customConfig_exports));
    astUtil2 = (init_ast(), __toCommonJS(ast_exports));
    groupUtil2 = (init_groupMethods(), __toCommonJS(groupMethods_exports));
    getOption3 = (init_settings(), __toCommonJS(settings_exports));
    parserUtil2 = (init_parser(), __toCommonJS(parser_exports));
    ARBITRARY_VALUE_DETECTED_MSG = `Arbitrary value detected in '{{classname}}'`;
    no_arbitrary_value_default = {
      meta: {
        docs: {
          description: "Forbid using arbitrary values in classnames",
          category: "Best Practices",
          recommended: false,
          url: docsUrl3("no-arbitrary-value")
        },
        messages: {
          arbitraryValueDetected: ARBITRARY_VALUE_DETECTED_MSG
        },
        fixable: null,
        schema: [
          {
            type: "object",
            properties: {
              callees: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              ignoredKeys: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              config: {
                // returned from `loadConfig()` utility
                type: ["string", "object"]
              },
              tags: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              }
            }
          }
        ]
      },
      create: function(context) {
        const callees = getOption3(context, "callees");
        const skipClassAttribute = getOption3(context, "skipClassAttribute");
        const tags = getOption3(context, "tags");
        const twConfig = getOption3(context, "config");
        const classRegex = getOption3(context, "classRegex");
        const mergedConfig2 = customConfig2.resolve(twConfig);
        const parseForArbitraryValues = (node, arg = null) => {
          let originalClassNamesValue = null;
          if (arg === null) {
            originalClassNamesValue = astUtil2.extractValueFromNode(node);
          } else {
            switch (arg.type) {
              case "Identifier":
                return;
              case "TemplateLiteral":
                arg.expressions.forEach((exp) => {
                  parseForArbitraryValues(node, exp);
                });
                arg.quasis.forEach((quasis) => {
                  parseForArbitraryValues(node, quasis);
                });
                return;
              case "ConditionalExpression":
                parseForArbitraryValues(node, arg.consequent);
                parseForArbitraryValues(node, arg.alternate);
                return;
              case "LogicalExpression":
                parseForArbitraryValues(node, arg.right);
                return;
              case "ArrayExpression":
                arg.elements.forEach((el) => {
                  parseForArbitraryValues(node, el);
                });
                return;
              case "ObjectExpression":
                const isUsedByClassNamesPlugin = node.callee && node.callee.name === "classnames";
                const isVue = node.key && node.key.type === "VDirectiveKey";
                arg.properties.forEach((prop) => {
                  const propVal = isUsedByClassNamesPlugin || isVue ? prop.key : prop.value;
                  parseForArbitraryValues(node, propVal);
                });
                return;
              case "Property":
                parseForArbitraryValues(node, arg.key);
                return;
              case "Literal":
                originalClassNamesValue = arg.value;
                break;
              case "TemplateElement":
                originalClassNamesValue = arg.value.raw;
                if (originalClassNamesValue === "") {
                  return;
                }
                break;
            }
          }
          let { classNames } = astUtil2.extractClassnamesFromValue(originalClassNamesValue);
          const forbidden = [];
          classNames.forEach((cls, idx) => {
            const parsed = groupUtil2.parseClassname(cls, [], mergedConfig2, idx);
            if (/\[.*\]/i.test(parsed.body)) {
              forbidden.push(parsed.name);
            }
          });
          forbidden.forEach((forbiddenClass) => {
            context.report({
              node,
              messageId: "arbitraryValueDetected",
              data: {
                classname: forbiddenClass
              }
            });
          });
        };
        const attributeVisitor = function(node) {
          if (!astUtil2.isClassAttribute(node, classRegex) || skipClassAttribute) {
            return;
          }
          if (astUtil2.isLiteralAttributeValue(node)) {
            parseForArbitraryValues(node);
          } else if (node.value && node.value.type === "JSXExpressionContainer") {
            parseForArbitraryValues(node, node.value.expression);
          }
        };
        const callExpressionVisitor = function(node) {
          const calleeStr = astUtil2.calleeToString(node.callee);
          if (callees.findIndex((name2) => calleeStr === name2) === -1) {
            return;
          }
          node.arguments.forEach((arg) => {
            parseForArbitraryValues(node, arg);
          });
        };
        const scriptVisitor = {
          JSXAttribute: attributeVisitor,
          TextAttribute: attributeVisitor,
          CallExpression: callExpressionVisitor,
          TaggedTemplateExpression: function(node) {
            if (!tags.includes(node.tag.name ?? node.tag.object?.name ?? node.tag.callee?.name)) {
              return;
            }
            parseForArbitraryValues(node, node.quasi);
          }
        };
        const templateVisitor = {
          CallExpression: callExpressionVisitor,
          /*
          Tagged templates inside data bindings
          https://github.com/vuejs/vue/issues/9721
          */
          VAttribute: function(node) {
            switch (true) {
              case !astUtil2.isValidVueAttribute(node, classRegex):
                return;
              case astUtil2.isVLiteralValue(node):
                parseForArbitraryValues(node, null);
                break;
              case astUtil2.isArrayExpression(node):
                node.value.expression.elements.forEach((arg) => {
                  parseForArbitraryValues(node, arg);
                });
                break;
              case astUtil2.isObjectExpression(node):
                node.value.expression.properties.forEach((prop) => {
                  parseForArbitraryValues(node, prop);
                });
                break;
            }
          }
        };
        return parserUtil2.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
      }
    };
  }
});

// src/rules/no-contradicting-classname.ts
var CONFLICTING_CLASSNAMES_DETECTED_MSG, no_contradicting_classname_default;
var init_no_contradicting_classname = __esm({
  "src/rules/no-contradicting-classname.ts"() {
    "use strict";
    init_groups();
    init_ast();
    init_customConfig();
    init_docsUrl();
    init_groupMethods();
    init_parser();
    init_settings();
    CONFLICTING_CLASSNAMES_DETECTED_MSG = `Classnames {{classnames}} are conflicting!`;
    no_contradicting_classname_default = {
      meta: {
        docs: {
          description: 'Avoid contradicting Tailwind CSS classnames (e.g. "w-3 w-5")',
          category: "Possible Errors",
          recommended: true,
          url: docsUrl_default("no-contradicting-classname")
        },
        messages: {
          conflictingClassnames: CONFLICTING_CLASSNAMES_DETECTED_MSG
        },
        fixable: null,
        schema: [
          {
            type: "object",
            properties: {
              callees: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              ignoredKeys: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              config: {
                // returned from `loadConfig()` utility
                type: ["string", "object"]
              },
              tags: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              }
            }
          }
        ]
      },
      create: function(context) {
        const callees = settings_default(context, "callees");
        const ignoredKeys = settings_default(context, "ignoredKeys");
        const skipClassAttribute = settings_default(context, "skipClassAttribute");
        const tags = settings_default(context, "tags");
        const twConfig = settings_default(context, "config");
        const classRegex = settings_default(context, "classRegex");
        const mergedConfig2 = customConfig_default.resolve(twConfig);
        const groups2 = groupMethods_default.getGroups(groups, mergedConfig2);
        const parseForContradictingClassNames = (classNames, node) => {
          const sorted = groupMethods_default.initGroupSlots(groups2);
          classNames.forEach((className) => {
            const idx = groupMethods_default.getGroupIndex(className, groups2, mergedConfig2.separator);
            if (idx > -1) {
              sorted[idx].push(className);
            }
          });
          const sortedGroups = sorted.filter((slot) => slot.length > 1);
          const arbitraryPropsGroupIndex = sortedGroups.findIndex((slot) => {
            const suffix = groupMethods_default.getSuffix(slot[0], mergedConfig2.separator);
            return groupMethods_default.getArbitraryProperty(suffix, mergedConfig2.separator) !== "";
          });
          const ambiguousArbitraryValuesOrClasses = String.raw`(\[(.*${mergedConfig2.separator}))|(^((?!:).)*$)`;
          sortedGroups.forEach((group, groupIndex) => {
            const variants = [];
            group.forEach((cls) => {
              const prefix = groupMethods_default.getPrefix(cls, mergedConfig2.separator);
              const name2 = cls.substr(prefix.length);
              if (groupIndex === arbitraryPropsGroupIndex) {
                const arbitraryProp = groupMethods_default.getArbitraryProperty(name2, mergedConfig2.separator);
                const identifier = prefix + arbitraryProp;
                const idx = variants.findIndex((v) => identifier === v.prefix);
                if (idx === -1) {
                  variants.push({
                    prefix: identifier,
                    name: [name2]
                  });
                } else {
                  variants[idx].name.push(name2);
                }
              } else {
                const rePrefix = prefix === "" ? ambiguousArbitraryValuesOrClasses : "^" + prefix;
                const idx = variants.findIndex((v) => v.prefix === rePrefix);
                if (idx === -1) {
                  variants.push({
                    prefix: rePrefix,
                    name: [name2]
                  });
                } else {
                  variants[idx].name.push(name2);
                }
              }
            });
            const potentialTroubles = variants.filter((v) => v.name.length > 1);
            if (potentialTroubles.length) {
              potentialTroubles.forEach((variantGroup) => {
                const re = new RegExp(variantGroup.prefix);
                const conflicting = group.filter((c) => re.test(c));
                context.report({
                  node,
                  messageId: "conflictingClassnames",
                  data: {
                    classnames: conflicting.join(", ")
                  }
                });
              });
            }
          });
        };
        const attributeVisitor = function(node) {
          if (!ast_default.isClassAttribute(node, classRegex) || skipClassAttribute) {
            return;
          }
          if (ast_default.isLiteralAttributeValue(node)) {
            ast_default.parseNodeRecursive(node, null, parseForContradictingClassNames, true, false, ignoredKeys);
          } else if (node.value && node.value.type === "JSXExpressionContainer") {
            ast_default.parseNodeRecursive(
              node,
              node.value.expression,
              parseForContradictingClassNames,
              true,
              false,
              ignoredKeys
            );
          }
        };
        const callExpressionVisitor = function(node) {
          const calleeStr = ast_default.calleeToString(node.callee);
          if (callees.findIndex((name2) => calleeStr === name2) === -1) {
            return;
          }
          const allClassnamesForNode = [];
          const pushClasses = (classNames, targetNode) => {
            if (targetNode === null) {
              parseForContradictingClassNames(classNames, node);
            } else {
              allClassnamesForNode.push(...classNames);
            }
          };
          node.arguments.forEach((arg) => {
            ast_default.parseNodeRecursive(node, arg, pushClasses, true, false, ignoredKeys);
          });
          parseForContradictingClassNames(allClassnamesForNode, node);
        };
        const scriptVisitor = {
          JSXAttribute: attributeVisitor,
          TextAttribute: attributeVisitor,
          CallExpression: callExpressionVisitor,
          TaggedTemplateExpression: function(node) {
            if (!tags.includes(node.tag.name ?? node.tag.object?.name ?? node.tag.callee?.name)) {
              return;
            }
            const allClassnamesForNode = [];
            const pushClasses = (classNames, targetNode) => {
              if (targetNode === null) {
                parseForContradictingClassNames(classNames, node);
              } else {
                allClassnamesForNode.push(...classNames);
              }
            };
            ast_default.parseNodeRecursive(node, node.quasi, pushClasses, true, false, ignoredKeys);
            parseForContradictingClassNames(allClassnamesForNode, node);
          }
        };
        const templateVisitor = {
          CallExpression: callExpressionVisitor,
          /*
          Tagged templates inside data bindings
          https://github.com/vuejs/vue/issues/9721
          */
          VAttribute: function(node) {
            switch (true) {
              case !ast_default.isValidVueAttribute(node, classRegex):
                return;
              case ast_default.isVLiteralValue(node):
                ast_default.parseNodeRecursive(node, null, parseForContradictingClassNames, true, false, ignoredKeys);
                break;
              case ast_default.isArrayExpression(node):
                const allClassnamesForNode = [];
                const pushClasses = (classNames, targetNode) => {
                  if (targetNode === null) {
                    parseForContradictingClassNames(classNames, node);
                  } else {
                    allClassnamesForNode.push(...classNames);
                  }
                };
                node.value.expression.elements.forEach((el) => {
                  ast_default.parseNodeRecursive(node, el, pushClasses, true, false, ignoredKeys);
                });
                parseForContradictingClassNames(allClassnamesForNode, node);
                break;
              case ast_default.isObjectExpression(node):
                node.value.expression.properties.forEach((prop) => {
                  ast_default.parseNodeRecursive(node, prop, parseForContradictingClassNames, false, false, ignoredKeys);
                });
                break;
            }
          }
        };
        return parser_default.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
      }
    };
  }
});

// src/util/cssFiles.ts
var fg, fs2, postcss, lastClassFromSelectorRegexp, removeDuplicatesFromArray3, cssFilesInfos, lastUpdate, classnamesFromFiles, generateClassnamesListSync, cssFiles_default;
var init_cssFiles = __esm({
  "src/util/cssFiles.ts"() {
    "use strict";
    fg = __require("fast-glob");
    fs2 = __require("fs");
    postcss = __require("postcss");
    lastClassFromSelectorRegexp = /\.([^\.\,\s\n\:\(\)\[\]\'~\+\>\*\\]*)/gim;
    removeDuplicatesFromArray3 = (init_removeDuplicatesFromArray(), __toCommonJS(removeDuplicatesFromArray_exports));
    cssFilesInfos = /* @__PURE__ */ new Map();
    lastUpdate = null;
    classnamesFromFiles = [];
    generateClassnamesListSync = (patterns, refreshRate = 5e3) => {
      const now = Date.now();
      const isExpired = lastUpdate === null || now - lastUpdate > refreshRate;
      if (!isExpired) {
        return classnamesFromFiles;
      }
      lastUpdate = now;
      const filesToBeRemoved = /* @__PURE__ */ new Set([...cssFilesInfos.keys()]);
      const files = fg.sync(patterns, { suppressErrors: true, stats: true });
      for (const file of files) {
        let mtime = "";
        let canBeSkipped = cssFilesInfos.has(file.path);
        if (canBeSkipped) {
          filesToBeRemoved.delete(file.path);
          const stats = fs2.statSync(file.path);
          mtime = `${stats.mtime || ""}`;
          canBeSkipped = cssFilesInfos.get(file.path).mtime === mtime;
        }
        if (canBeSkipped) {
          continue;
        }
        const data = fs2.readFileSync(file.path, "utf-8");
        const root = postcss.parse(data);
        let detectedClassnames = /* @__PURE__ */ new Set();
        root.walkRules((rule) => {
          const matches = [...rule.selector.matchAll(lastClassFromSelectorRegexp)];
          const classnames = matches.map((arr) => arr[1]);
          detectedClassnames = /* @__PURE__ */ new Set([...detectedClassnames, ...classnames]);
        });
        cssFilesInfos.set(file.path, {
          mtime,
          classNames: [...detectedClassnames]
        });
      }
      const deletedFiles = [...filesToBeRemoved];
      for (let i = 0; i < deletedFiles.length; i++) {
        cssFilesInfos.delete(deletedFiles[i]);
      }
      classnamesFromFiles = [];
      cssFilesInfos.forEach((css) => {
        classnamesFromFiles = [...classnamesFromFiles, ...css.classNames];
      });
      return removeDuplicatesFromArray3(classnamesFromFiles);
    };
    cssFiles_default = generateClassnamesListSync;
  }
});

// src/util/generated.ts
function generate(className, context) {
  const gen = generateRulesFallback(/* @__PURE__ */ new Set([className]), context);
  return gen;
}
var generateRulesFallback, generated_default;
var init_generated = __esm({
  "src/util/generated.ts"() {
    "use strict";
    generateRulesFallback = __require("tailwindcss/lib/lib/generateRules").generateRules;
    generated_default = generate;
  }
});

// src/rules/no-custom-classname.ts
var createContextFallback2, escapeRegex2, CUSTOM_CLASSNAME_DETECTED_MSG, getGroupNameRegex, contextFallbackCache2, no_custom_classname_default;
var init_no_custom_classname = __esm({
  "src/rules/no-custom-classname.ts"() {
    "use strict";
    init_groups();
    init_ast();
    init_cssFiles();
    init_customConfig();
    init_docsUrl();
    init_generated();
    init_groupMethods();
    init_parser();
    init_settings();
    createContextFallback2 = __require("tailwindcss/lib/lib/setupContextUtils").createContext;
    escapeRegex2 = (init_regex(), __toCommonJS(regex_exports)).escapeRegex;
    CUSTOM_CLASSNAME_DETECTED_MSG = `Classname '{{classname}}' is not a Tailwind CSS class!`;
    getGroupNameRegex = (prefix = "") => new RegExp(`^${escapeRegex2(prefix)}(group|peer)/[\\w\\$\\#\\@\\%\\^\\&\\*\\_\\-]+$`, "i");
    contextFallbackCache2 = /* @__PURE__ */ new WeakMap();
    no_custom_classname_default = {
      meta: {
        docs: {
          description: "Detect classnames which do not belong to Tailwind CSS",
          category: "Best Practices",
          recommended: false,
          url: docsUrl_default("no-custom-classname")
        },
        messages: {
          customClassnameDetected: CUSTOM_CLASSNAME_DETECTED_MSG
        },
        fixable: null,
        schema: [
          {
            type: "object",
            properties: {
              callees: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              ignoredKeys: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              config: {
                // returned from `loadConfig()` utility
                type: ["string", "object"]
              },
              cssFiles: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              cssFilesRefreshRate: {
                type: "number"
                // default: 5_000,
              },
              tags: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              whitelist: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              }
            }
          }
        ]
      },
      create: function(context) {
        const callees = settings_default(context, "callees");
        const ignoredKeys = settings_default(context, "ignoredKeys");
        const skipClassAttribute = settings_default(context, "skipClassAttribute");
        const tags = settings_default(context, "tags");
        const twConfig = settings_default(context, "config");
        const cssFiles = settings_default(context, "cssFiles");
        const cssFilesRefreshRate = settings_default(context, "cssFilesRefreshRate");
        const whitelist = settings_default(context, "whitelist");
        const classRegex = settings_default(context, "classRegex");
        const mergedConfig2 = customConfig_default.resolve(twConfig);
        const contextFallback = (
          // Set the created contextFallback in the cache if it does not exist yet.
          (contextFallbackCache2.has(mergedConfig2) ? contextFallbackCache2 : contextFallbackCache2.set(mergedConfig2, createContextFallback2(mergedConfig2))).get(mergedConfig2)
        );
        const groups2 = groupMethods_default.getGroups(groups, mergedConfig2);
        const classnamesFromFiles2 = cssFiles_default(cssFiles, cssFilesRefreshRate);
        const groupNameRegex = getGroupNameRegex(mergedConfig2.prefix);
        const parseForCustomClassNames = (classNames, node) => {
          classNames.forEach((className) => {
            const gen = generated_default(className, contextFallback);
            if (gen.length) {
              return;
            }
            const idx = groupMethods_default.getGroupIndex(className, groups2, mergedConfig2.separator);
            if (idx >= 0) {
              return;
            }
            const whitelistIdx = groupMethods_default.getGroupIndex(className, whitelist, mergedConfig2.separator);
            if (whitelistIdx >= 0) {
              return;
            }
            const fromFilesIdx = groupMethods_default.getGroupIndex(className, classnamesFromFiles2, mergedConfig2.separator);
            if (fromFilesIdx >= 0) {
              return;
            }
            if (groupNameRegex.test(className)) {
              return;
            }
            context.report({
              node,
              messageId: "customClassnameDetected",
              data: {
                classname: className
              }
            });
          });
        };
        const attributeVisitor = function(node) {
          if (!ast_default.isClassAttribute(node, classRegex) || skipClassAttribute) {
            return;
          }
          if (ast_default.isLiteralAttributeValue(node)) {
            ast_default.parseNodeRecursive(node, null, parseForCustomClassNames, false, false, ignoredKeys);
          } else if (node.value && node.value.type === "JSXExpressionContainer") {
            ast_default.parseNodeRecursive(node, node.value.expression, parseForCustomClassNames, false, false, ignoredKeys);
          }
        };
        const callExpressionVisitor = function(node) {
          const calleeStr = ast_default.calleeToString(node.callee);
          if (callees.findIndex((name2) => calleeStr === name2) === -1) {
            return;
          }
          node.arguments.forEach((arg) => {
            ast_default.parseNodeRecursive(node, arg, parseForCustomClassNames, false, false, ignoredKeys);
          });
        };
        const scriptVisitor = {
          JSXAttribute: attributeVisitor,
          TextAttribute: attributeVisitor,
          CallExpression: callExpressionVisitor,
          TaggedTemplateExpression: function(node) {
            if (!tags.includes(node.tag.name ?? node.tag.object?.name ?? node.tag.callee?.name)) {
              return;
            }
            ast_default.parseNodeRecursive(node, node.quasi, parseForCustomClassNames, false, false, ignoredKeys);
          }
        };
        const templateVisitor = {
          CallExpression: callExpressionVisitor,
          /*
          Tagged templates inside data bindings
          https://github.com/vuejs/vue/issues/9721
          */
          VAttribute: function(node) {
            switch (true) {
              case !ast_default.isValidVueAttribute(node, classRegex):
                return;
              case ast_default.isVLiteralValue(node):
                ast_default.parseNodeRecursive(node, null, parseForCustomClassNames, false, false, ignoredKeys);
                break;
              case ast_default.isArrayExpression(node):
                node.value.expression.elements.forEach((arg) => {
                  ast_default.parseNodeRecursive(node, arg, parseForCustomClassNames, false, false, ignoredKeys);
                });
                break;
              case ast_default.isObjectExpression(node):
                node.value.expression.properties.forEach((prop) => {
                  ast_default.parseNodeRecursive(node, prop, parseForCustomClassNames, false, false, ignoredKeys);
                });
                break;
            }
          }
        };
        return parser_default.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
      }
    };
  }
});

// src/rules/no-unnecessary-arbitrary-value.ts
var validZeroRegEx2, UNNECESSARY_ARBITRARY_VALUE_DETECTED_MSG, no_unnecessary_arbitrary_value_default;
var init_no_unnecessary_arbitrary_value = __esm({
  "src/rules/no-unnecessary-arbitrary-value.ts"() {
    "use strict";
    init_groups();
    init_ast();
    init_customConfig();
    init_docsUrl();
    init_groupMethods();
    init_parser();
    init_settings();
    init_length();
    validZeroRegEx2 = length_default.validZeroRegEx;
    UNNECESSARY_ARBITRARY_VALUE_DETECTED_MSG = `The arbitrary class '{{classname}}' could be replaced by '{{presets}}'`;
    no_unnecessary_arbitrary_value_default = {
      meta: {
        docs: {
          description: "Forbid using arbitrary values in classnames when an equivalent preset exists",
          category: "Best Practices",
          recommended: true,
          url: docsUrl_default("no-unnecessary-arbitrary-value")
        },
        messages: {
          unnecessaryArbitraryValueDetected: UNNECESSARY_ARBITRARY_VALUE_DETECTED_MSG
        },
        fixable: "code",
        schema: [
          {
            type: "object",
            properties: {
              callees: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              ignoredKeys: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              },
              config: {
                // returned from `loadConfig()` utility
                type: ["string", "object"]
              },
              tags: {
                type: "array",
                items: { type: "string", minLength: 0 },
                uniqueItems: true
              }
            }
          }
        ]
      },
      create: function(context) {
        const callees = settings_default(context, "callees");
        const skipClassAttribute = settings_default(context, "skipClassAttribute");
        const tags = settings_default(context, "tags");
        const twConfig = settings_default(context, "config");
        const classRegex = settings_default(context, "classRegex");
        const mergedConfig2 = customConfig_default.resolve(twConfig);
        const groups2 = groupMethods_default.getGroups(groups, mergedConfig2);
        const configKeys = groupMethods_default.getGroupConfigKeys(groups);
        let parentTemplateLiteral = null;
        const parseForArbitraryValues = (node, arg = null) => {
          let start = null;
          let end = null;
          let originalClassNamesValue = null;
          if (arg === null) {
            originalClassNamesValue = ast_default.extractValueFromNode(node);
            const range = ast_default.extractRangeFromNode(node);
            if (node.type === "TextAttribute") {
              start = range[0];
              end = range[1];
            } else {
              start = range[0] + 1;
              end = range[1] - 1;
            }
          } else {
            switch (arg.type) {
              case "Identifier":
                return;
              case "TemplateLiteral":
                parentTemplateLiteral = arg;
                arg.expressions.forEach((exp) => {
                  parseForArbitraryValues(node, exp);
                });
                arg.quasis.forEach((quasis) => {
                  parseForArbitraryValues(node, quasis);
                });
                parentTemplateLiteral = null;
                return;
              case "ConditionalExpression":
                parseForArbitraryValues(node, arg.consequent);
                parseForArbitraryValues(node, arg.alternate);
                return;
              case "LogicalExpression":
                parseForArbitraryValues(node, arg.right);
                return;
              case "ArrayExpression":
                arg.elements.forEach((el) => {
                  parseForArbitraryValues(node, el);
                });
                return;
              case "ObjectExpression":
                const isUsedByClassNamesPlugin = node.callee && node.callee.name === "classnames";
                const isVue = node.key && node.key.type === "VDirectiveKey";
                arg.properties.forEach((prop) => {
                  const propVal = isUsedByClassNamesPlugin || isVue ? prop.key : prop.value;
                  parseForArbitraryValues(node, propVal);
                });
                return;
              case "Property":
                parseForArbitraryValues(node, arg.key);
                start = arg.range[0] + 1;
                end = arg.range[1] - 1;
                return;
              case "Literal":
                originalClassNamesValue = arg.value;
                start = arg.range[0] + 1;
                end = arg.range[1] - 1;
                break;
              case "TemplateElement":
                originalClassNamesValue = arg.value.raw;
                if (originalClassNamesValue === "") {
                  return;
                }
                start = arg.range[0];
                end = arg.range[1];
                if (parentTemplateLiteral) {
                  if (parentTemplateLiteral.range[0] === start) {
                    start += 1;
                  } else {
                    start += 1;
                  }
                  if (parentTemplateLiteral.range[1] === end) {
                    end -= 1;
                  } else {
                    end -= 2;
                  }
                }
                break;
            }
          }
          const arbitraryRegEx = /^(?<backBone>.*)\[(?<arbitraryValue>.*)\]$/i;
          const { classNames } = ast_default.extractClassnamesFromValue(originalClassNamesValue);
          const arbitraryClassnames = classNames.filter((c) => arbitraryRegEx.test(c));
          if (arbitraryClassnames.length === 0) {
            return;
          }
          const unnecessaryArbitraryClasses = [];
          const existingSubstitutes = [];
          arbitraryClassnames.forEach((arbitraryClass, idx) => {
            const parsed = groupMethods_default.parseClassname(arbitraryClass, [], mergedConfig2, idx);
            const res = arbitraryRegEx.exec(parsed.name);
            if (res && res.groups && res.groups.backBone && res.groups.arbitraryValue) {
              const backBone = res.groups.backBone;
              const arbitraryValue = res.groups.arbitraryValue;
              const groupIdx = groupMethods_default.getGroupIndex(arbitraryClass, groups2, mergedConfig2.separator);
              if ([groups2[groupIdx], parsed.body, arbitraryValue].includes(void 0)) {
                return false;
              }
              const canBeNegative = groups2[groupIdx].indexOf("?<negativeValue>") !== -1;
              const isNegativeClass = parsed.body.indexOf("-") === 0;
              const isNegativeValue = arbitraryValue.indexOf("-") === 0;
              const configurationKey = configKeys[groupIdx];
              const configuration = mergedConfig2.theme[configurationKey];
              if ([void 0, null].includes(configuration)) {
                return false;
              }
              const configurationKeys = Object.keys(configuration);
              const zeroValueWithOrWithoutUnitsPattern = new RegExp(validZeroRegEx2, "i");
              const isZeroArbitraryValue = zeroValueWithOrWithoutUnitsPattern.test(arbitraryValue);
              const negativeSubstitutes = [];
              const matchingConfigurationKeys = configurationKeys.filter((key) => {
                const configValue = configuration[key];
                if (isZeroArbitraryValue && zeroValueWithOrWithoutUnitsPattern.test(configValue)) {
                  negativeSubstitutes.push(false);
                  return true;
                }
                if (canBeNegative) {
                  const absoluteValue = isNegativeValue ? arbitraryValue.substring(1) : arbitraryValue;
                  const computedAsNegative = isNegativeClass !== isNegativeValue;
                  if (`${configValue}` === `${absoluteValue}`) {
                    negativeSubstitutes.push(computedAsNegative);
                    return true;
                  }
                  return false;
                }
                if (`${configValue}` === `${arbitraryValue}`) {
                  negativeSubstitutes.push(false);
                  return true;
                }
                return false;
              });
              if (matchingConfigurationKeys.length) {
                unnecessaryArbitraryClasses.push(parsed.name);
                existingSubstitutes.push(
                  matchingConfigurationKeys.map((key, idx2) => {
                    let patchedBody = backBone.substring(parsed.variants.length);
                    patchedBody = patchedBody.charAt(0) === "-" ? patchedBody.substring(1) : patchedBody;
                    const noneOrMinus = negativeSubstitutes[idx2] ? "-" : "";
                    if (key === "DEFAULT") {
                      return parsed.variants + noneOrMinus + patchedBody.substring(0, patchedBody.length - 1);
                    }
                    return parsed.variants + noneOrMinus + patchedBody + key;
                  })
                );
              }
            }
          });
          const fixables = {};
          unnecessaryArbitraryClasses.forEach((forbiddenClass, idx) => {
            if (existingSubstitutes[idx].length === 1) {
              const rangeKey = `s${start}e${end}`;
              if (!fixables[rangeKey]) {
                fixables[rangeKey] = [];
              }
              const fixer = {
                unjustified: forbiddenClass,
                substitute: existingSubstitutes[idx][0]
              };
              fixables[rangeKey].push(fixer);
            } else {
              context.report({
                node,
                messageId: "unnecessaryArbitraryValueDetected",
                data: {
                  classname: forbiddenClass,
                  presets: existingSubstitutes[idx].join("' or '")
                }
              });
            }
          });
          Object.keys(fixables).forEach((rangeKey) => {
            const batchFixes = fixables[rangeKey];
            let patched = originalClassNamesValue;
            const forbiddenClasses = [];
            const substitutes = [];
            for (let idx = 0; idx < batchFixes.length; idx++) {
              const unjustified = batchFixes[idx].unjustified;
              forbiddenClasses.push(unjustified);
              const substitute = batchFixes[idx].substitute;
              substitutes.push(substitute);
              patched = patched.replace(unjustified, substitute);
            }
            context.report({
              node,
              messageId: "unnecessaryArbitraryValueDetected",
              data: {
                classname: forbiddenClasses.join(", "),
                presets: substitutes.join(", ")
              },
              fix: function(fixer) {
                return fixer.replaceTextRange([start, end], patched);
              }
            });
          });
        };
        const attributeVisitor = function(node) {
          if (!ast_default.isClassAttribute(node, classRegex) || skipClassAttribute) {
            return;
          }
          if (ast_default.isLiteralAttributeValue(node)) {
            parseForArbitraryValues(node);
          } else if (node.value && node.value.type === "JSXExpressionContainer") {
            parseForArbitraryValues(node, node.value.expression);
          }
        };
        const callExpressionVisitor = function(node) {
          const calleeStr = ast_default.calleeToString(node.callee);
          if (callees.findIndex((name2) => calleeStr === name2) === -1) {
            return;
          }
          node.arguments.forEach((arg) => {
            parseForArbitraryValues(node, arg);
          });
        };
        const scriptVisitor = {
          JSXAttribute: attributeVisitor,
          TextAttribute: attributeVisitor,
          CallExpression: callExpressionVisitor,
          TaggedTemplateExpression: function(node) {
            if (!tags.includes(node.tag.name)) {
              return;
            }
            parseForArbitraryValues(node, node.quasi);
          }
        };
        const templateVisitor = {
          CallExpression: callExpressionVisitor,
          /*
          Tagged templates inside data bindings
          https://github.com/vuejs/vue/issues/9721
          */
          VAttribute: function(node) {
            switch (true) {
              case !ast_default.isValidVueAttribute(node, classRegex):
                return;
              case ast_default.isVLiteralValue(node):
                parseForArbitraryValues(node, null);
                break;
              case ast_default.isArrayExpression(node):
                node.value.expression.elements.forEach((arg) => {
                  parseForArbitraryValues(node, arg);
                });
                break;
              case ast_default.isObjectExpression(node):
                node.value.expression.properties.forEach((prop) => {
                  parseForArbitraryValues(node, prop);
                });
                break;
            }
          }
        };
        return parser_default.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
      }
    };
  }
});

// src/rules/index.ts
var rules;
var init_rules2 = __esm({
  "src/rules/index.ts"() {
    "use strict";
    init_classnames_order();
    init_enforces_negative_arbitrary_values();
    init_enforces_shorthand();
    init_migration_from_tailwind_2();
    init_no_arbitrary_value();
    init_no_contradicting_classname();
    init_no_custom_classname();
    init_no_unnecessary_arbitrary_value();
    rules = {
      "classnames-order": classnames_order_default,
      "enforces-negative-arbitrary-values": enforces_negative_arbitrary_values_default,
      "enforces-shorthand": enforces_shorthand_default,
      "migration-from-tailwind-2": migration_from_tailwind_2_default,
      "no-arbitrary-value": no_arbitrary_value_default,
      "no-contradicting-classname": no_contradicting_classname_default,
      "no-custom-classname": no_custom_classname_default,
      "no-unnecessary-arbitrary-value": no_unnecessary_arbitrary_value_default
    };
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "eslint-plugin-tailwindcss",
      version: "3.18.0",
      description: "Rules enforcing best practices while using Tailwind CSS",
      type: "module",
      keywords: [
        "eslint",
        "eslintplugin",
        "eslint-plugin",
        "tailwind",
        "tailwindcss"
      ],
      author: "Fran\xE7ois Massart",
      repository: {
        type: "git",
        url: "https://github.com/francoismassart/eslint-plugin-tailwindcss"
      },
      homepage: "https://github.com/francoismassart/eslint-plugin-tailwindcss",
      bugs: "https://github.com/francoismassart/eslint-plugin-tailwindcss/issues",
      main: "lib/index.js",
      scripts: {
        test: "npm run test:base && npm run test:integration",
        "test:base": 'mocha "tests/lib/**/*.js"',
        "test:integration": 'mocha "tests/integrations/*.js" --timeout 60000',
        build: "tsc --build",
        "build:diagnostics": "tsc --build --diagnostics",
        watch: "tsc --watch",
        tsup: "tsup ./src/index.ts --outDir lib/",
        "tsup:watch": "tsup ./src/index.ts --watch --outDir lib/",
        "docs:init": "eslint-doc-generator --init-rule-docs",
        "docs:update": "eslint-doc-generator"
      },
      files: [
        "lib"
      ],
      peerDependencies: {
        tailwindcss: "^4.0.0"
      },
      dependencies: {
        "@typescript-eslint/utils": "^7.13.0",
        eslint: "^8.56.0",
        "fast-glob": "^3.2.5",
        postcss: "^8.4.4"
      },
      devDependencies: {
        "@angular-eslint/template-parser": "^15.2.0",
        "@tailwindcss/aspect-ratio": "^0.4.2",
        "@tailwindcss/forms": "^0.5.3",
        "@tailwindcss/line-clamp": "^0.4.2",
        "@tailwindcss/typography": "^0.5.8",
        "@types/eslint": "^8.56.10",
        "@types/jest": "^29.5.12",
        "@types/node": "^18.12.0",
        "@typescript-eslint/parser": "^7.13.0",
        "@typescript-eslint/rule-tester": "^7.13.0",
        autoprefixer: "^10.4.0",
        daisyui: "^2.6.4",
        eslint: "^8.57.0",
        "eslint-doc-generator": "^1.7.1",
        mocha: "^10.2.0",
        semver: "^7.6.0",
        tailwindcss: "^4.0.0",
        tsup: "^8.1.0",
        typescript: "^5.4.5",
        "vue-eslint-parser": "^9.4.2"
      },
      packageManager: "npm@10.2.5+sha256.8002e3e7305d2abd4016e1368af48d49b066c269079eeb10a56e7d6598acfdaa",
      engines: {
        node: ">=18.12.0"
      },
      license: "MIT"
    };
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
var name, version, plugin2, index_default;
var init_index = __esm({
  async "src/index.ts"() {
    await init_configs();
    init_rules2();
    ({ name, version } = await Promise.resolve().then(() => __toESM(require_package(), 1)));
    plugin2 = {
      meta: {
        name,
        version
      },
      rules,
      configs
    };
    index_default = plugin2;
  }
});
await init_index();
export {
  index_default as default
};
//# sourceMappingURL=index.js.map