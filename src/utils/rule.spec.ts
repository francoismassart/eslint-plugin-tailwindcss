import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import {
  MessageIds,
  noCustomClassname,
  RULE_NAME,
} from "../rules/no-custom-classname";
import { generalSettings } from "../utils/parser/test-helpers";

const suggest = (
  classname: string,
  output: string,
): TestCaseError<MessageIds> => {
  return {
    messageId: "issue:unknown-classname",
    suggestions: [
      {
        messageId: "fix:unknown-classname:remove",
        data: { classname: classname },
        output: output,
      },
    ],
  };
};
const ruleTester = new RuleTester({
  languageOptions: {
    parser: Parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    tailwindcss: {
      ...generalSettings,
    },
  },
});

ruleTester.run(RULE_NAME, noCustomClassname, {
  valid: [
    {
      code: `
        const button = tv({
          base: 'font-medium bg-blue-500 text-white rounded-full active:opacity-80',
          variants: {
            size: {
              sm: 'text-sm',
              md: 'text-base',
              lg: 'px-4 py-3 text-lg'
            }
          },
          defaultVariants: {
            size: 'md',
          }
        });
      `,
    },
  ],
  invalid: [
    {
      code: `
        tv({
          base: 'font-medium text-white',
          variants: {
            color: {
              primary: 'bg-blue-500',
              secondary: 'bg-purple-500'
            },
            size: {
              sm: 'text-sm',
              md: 'text-base',
              lg: 'text-lg'
            }
          },
          compoundVariants: [
            {
              size: ['sm', 'md'],
              class: 'unknown'
            }
          ],
          defaultVariants: {
            size: 'md',
            color: 'primary'
          }
        });
      `,
      errors: [
        suggest(
          "unknown",
          `
        tv({
          base: 'font-medium text-white',
          variants: {
            color: {
              primary: 'bg-blue-500',
              secondary: 'bg-purple-500'
            },
            size: {
              sm: 'text-sm',
              md: 'text-base',
              lg: 'text-lg'
            }
          },
          compoundVariants: [
            {
              size: ['sm', 'md'],
              class: ''
            }
          ],
          defaultVariants: {
            size: 'md',
            color: 'primary'
          }
        });
      `,
        ),
      ],
    },
  ],
});
