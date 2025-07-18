# Enforce a consistent and logical order of the Tailwind CSS classnames

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name               | Description                                         | Type     | Default                                                                  |
| :----------------- | :-------------------------------------------------- | :------- | :----------------------------------------------------------------------- |
| `callees`          | List of function names to validate classnames       | String[] | [`dm`]                                                                   |
| `cssConfigPath`    | Path to the Tailwind CSS configuration file (*.css) | String   | `/Users/fma/eslint-plugin-tailwindcss/tests/stubs/css/tiny-prefixed.css` |
| `removeDuplicates` | Remove duplicated classnames                        | Boolean  | `true`                                                                   |
| `tags`             | List of tags to be detected in template literals    | String[] | [`dt`]                                                                   |

<!-- end auto-generated rule options list -->
