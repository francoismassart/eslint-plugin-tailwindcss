# Enforce a consistent and logical order of the Tailwind CSS classnames

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name                 | Description                                                          | Type     | Default                |
| :------------------- | :------------------------------------------------------------------- | :------- | :--------------------- |
| `callees`            | List of function names to validate classnames                        | String[] | [`ctl`]                |
| `cssConfigPath`      | Path to the Tailwind CSS configuration file (*.css)                  | String   | `default-path/app.css` |
| `removeDuplicates`   | Remove duplicated classnames                                         | Boolean  | `true`                 |
| `skipClassAttribute` | If you only want to lint the classnames inside one of the `callees`. | Boolean  | `false`                |
| `tags`               | List of tags to be detected in template literals                     | String[] | [`tw`]                 |

<!-- end auto-generated rule options list -->
