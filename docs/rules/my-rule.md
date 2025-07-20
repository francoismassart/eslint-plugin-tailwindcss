# An example ESLint rule

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Rule details

Description of the rule would normally go here.

## Examples

Examples would normally go here.

## Options

<!-- begin auto-generated rule options list -->

| Name                 | Description                                                          | Type     | Choices           | Default                |
| :------------------- | :------------------------------------------------------------------- | :------- | :---------------- | :--------------------- |
| `callees`            | List of function names to validate classnames                        | String[] |                   | [`ctl`]                |
| `cssConfigPath`      | Path to the Tailwind CSS configuration file (*.css)                  | String   |                   | `default-path/app.css` |
| `removeDuplicates`   | Remove duplicated classnames                                         | Boolean  |                   | `true`                 |
| `skipClassAttribute` | If you only want to lint the classnames inside one of the `callees`. | Boolean  |                   | `false`                |
| `someBool`           | someBool description.                                                | Boolean  |                   | `false`                |
| `someEnum`           | someEnum description.                                                | String   | `always`, `never` | `always`               |
| `tags`               | List of tags to be detected in template literals                     | String[] |                   | [`tw`]                 |

<!-- end auto-generated rule options list -->
