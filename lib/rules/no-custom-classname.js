/**
 * @fileoverview Detect classnames which do not belong to Tailwind CSS
 * @author no-custom-classname
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
const CUSTOM_CLASSNAME_DETECTED_MSG = `Classname '{{classname}}' is not a Tailwind CSS class!`;

module.exports = {
  meta: {
    docs: {
      description: "Detect classnames which do not belong to Tailwind CSS",
      category: "Best Practices",
      recommended: false,
      url: docsUrl("no-custom-classname"),
    },
    messages: {
      customClassnameDetected: CUSTOM_CLASSNAME_DETECTED_MSG,
    },
    fixable: "code",
    schema: [],
  },

  create: function (context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

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
        classNames = removeDuplicatesFromArray(classNames);
        if (classNames.length <= 1) {
          // Don't run for a single or empty className
          return;
        }

        const groups = groupUtil.getGroups(defaultGroups);

        classNames.forEach((className) => {
          const idx = groupUtil.getGroupIndex(className, groups);
          if (idx === -1) {
            context.report({
              node,
              messageId: "customClassnameDetected",
              data: {
                classname: className,
              },
            });
          }
        });
      },
    };
  },
};
