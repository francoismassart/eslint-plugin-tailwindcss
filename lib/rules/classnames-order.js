/**
 * @fileoverview Use a consistent orders for the Tailwind CSS classnames, based on property then on variants
 * @author François Massart
 */
"use strict";

const docsUrl = require("../util/docsUrl");
const defaultGroups = require("../config/groups").groups;
const astUtil = require("../util/ast");
const attrUtil = require("../util/attr");
const groupUtil = require("../util/groupMethods");
const removeDuplicatesFromArray = require("../util/removeDuplicatesFromArray");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const INVALID_CLASSNAMES_ORDER_MSG = "Invalid Tailwind CSS classenames order";

module.exports = {
  meta: {
    docs: {
      description:
        "Enforce a consistent and logical order of the Tailwind CSS classnames",
      category: "Stylistic Issues",
      recommended: false,
      url: docsUrl("classnames-order"),
    },
    messages: {
      invalidOrder: INVALID_CLASSNAMES_ORDER_MSG,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          prependCustom: {
            default: false,
            type: "boolean",
          },
          removeDuplicates: {
            default: true,
            type: "boolean",
          },
        },
      },
    ],
  },

  create: function (context) {
    const configuration = context.options[0] || {};
    const groupsConfig = configuration.groups || defaultGroups;
    const prependCustom = configuration.prependCustom || false;
    const removeDuplicates = !(configuration.removeDuplicates === false);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const getPrefixIndex = (str, arr, beginning = false) => {
      const start = beginning ? "^" : "";
      let idx = arr.findIndex((el) => {
        const pattern = `${start}${el}\:.*`;
        const re = new RegExp(pattern);
        return re.test(str);
      }, str);
      return idx;
    };

    const pad = (num, size = 2) => {
      let str = "" + num;
      while (str.length < size) {
        str = "0" + str;
      }
      return str;
    };

    const getSpecificity = (val, arr, beginning = false) => {
      // Index can be -1, 0... Adding 1 for better readability
      return pad(getPrefixIndex(val, arr, beginning) + 1, 2);
    };

    const sortTailwindClasses = (a, b) => {
      const responsiveVariants = ["sm", "md", "lg", "xl", "2xl"];
      const themeVariants = ["dark"];
      const stateVariants = [
        "hover",
        "focus",
        "active",
        "group-hover",
        "group-focus",
        "focus-within",
        "focus-visible",
        "motion-safe",
        "motion-reduce",
        "disabled",
        "visited",
        "checked",
        "first",
        "last",
        "odd",
        "even",
      ];
      const aIdxStr = `${getSpecificity(
        a,
        responsiveVariants,
        true
      )}${getSpecificity(a, themeVariants)}${getSpecificity(a, stateVariants)}`;
      const bIdxStr = `${getSpecificity(
        b,
        responsiveVariants,
        true
      )}${getSpecificity(b, themeVariants)}${getSpecificity(b, stateVariants)}`;
      const aIdx = parseInt(aIdxStr, 10);
      const bIdx = parseInt(bIdxStr, 10);
      if (aIdx < bIdx) {
        return -1;
      }
      if (aIdx > bIdx) {
        return 1;
      }
      return 0;
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      JSXAttribute: function (node) {
        if (!astUtil.isValidJSXAttribute(node)) {
          return;
        }

        const originalClassNamesValue = node.value.value;
        let classNames = attrUtil.getClassNamesFromAttribute(
          originalClassNamesValue
        );
        if (removeDuplicates) {
          classNames = removeDuplicatesFromArray(classNames);
        }
        if (classNames.length <= 1) {
          // Don't run for a single or empty className
          return;
        }

        // Init assets before sorting
        const groups = groupUtil.getGroups(groupsConfig);
        const sorted = groupUtil.initGroupSlots(groups);
        const extras = [];

        // Move each classname inside its dedicated group
        classNames.forEach((className) => {
          const idx = groupUtil.getGroupIndex(className, groups);
          if (idx > -1) {
            sorted[idx].push(className);
          } else {
            extras.push(className);
          }
        });

        // Sorts each groups' classnames
        sorted.forEach((slot) => {
          slot.sort(sortTailwindClasses);
        });

        // Generates the validated/sorted attribute value
        const flatted = sorted.flat();
        const union = prependCustom
          ? [...extras, ...flatted]
          : [...flatted, ...extras];
        const validatedClassNamesValue = union.join(" ");
        if (originalClassNamesValue !== validatedClassNamesValue) {
          context.report({
            node: node,
            messageId: "invalidOrder",
            fix: function (fixer) {
              return fixer.replaceText(
                node.value,
                `"${validatedClassNamesValue}"`
              );
            },
          });
        }
      },
      CallExpression: function (node) {
        if (node.callee.name !== "ctl") {
          return;
        }
        if (
          node.arguments.length === 1 &&
          node.arguments[0].type === "TemplateLiteral" &&
          node.arguments[0].quasis.length === 1
        ) {
          const quasis = node.arguments[0].quasis[0];
          const originalClassNamesValue = quasis.value.raw;
          let classNamesPerLine = originalClassNamesValue.split("\n");
          let classNames = attrUtil.getClassNamesFromAttribute(
            originalClassNamesValue
          );
          if (removeDuplicates) {
            classNamesPerLine = removeDuplicatesFromArray(classNamesPerLine);
          }
          if (classNamesPerLine.length <= 1) {
            // Don't run for a single or empty className
            return;
          }
          console.log("classNamesPerLine");
          console.log(classNamesPerLine);
          console.log("classNamesPerLine");
        }
      },
    };
  },
};
