import * as Parser from "@typescript-eslint/parser";
import { RuleTester, TestCaseError } from "@typescript-eslint/rule-tester";

import {
  generalSettings,
  withSvelteParser,
} from "../utils/parser/test-helpers";
import {
  classnamesOrder,
  type MessageIds,
  RULE_NAME,
} from "./classnames-order";

const error: TestCaseError<MessageIds> = { messageId: "fix:sort" };

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

ruleTester.run(RULE_NAME, classnamesOrder, {
  valid: [],
  invalid: [
    // Svelte
    {
      code: `
        <script>
          const styles = tw\`block absolute\`;
        </script>
        <section class="p-6">Simple</section>`,
      output: `
        <script>
          const styles = tw\`absolute block\`;
        </script>
        <section class="p-6">Simple</section>`,
      languageOptions: withSvelteParser,
      errors: [error, error],
    },
    {
      code: `
        <script>
          const styles = tw\`block absolute\`;
          const ctl = ctl('relative unkown')
          const isDarkMode = true;
        </script>
        <section class="p-10 w-full {isDarkMode ? 'bg-slate-900 h-full' : 'bg-white flex'}">
          <span  class="text-xs font-bold {ctl}" class:bg-amber-500={isDarkMode}>
            Class binding
          </span>
        </section>`,
      output: `
        <script>
          const styles = tw\`absolute block\`;
          const ctl = ctl('unkown relative')
          const isDarkMode = true;
        </script>
        <section class="w-full p-10 {isDarkMode ? 'h-full bg-slate-900' : 'flex bg-white'}">
          <span  class="text-xs font-bold {ctl}" class:bg-amber-500={isDarkMode}>
            Class binding
          </span>
        </section>`,
      languageOptions: withSvelteParser,
      errors: [
        error,
        error,
        error,
        error,
        error,
        error,
        error,
        error,
        error,
        error,
      ],
    },
  ],
});
