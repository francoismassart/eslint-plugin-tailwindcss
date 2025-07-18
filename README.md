# eslint-plugin-tailwindcss

![eslint-plugin-tailwindcss logo](.github/logo.png)

Version 4 of the `eslint-plugin-tailwindcss` is:

- re-written from scratch
- using TypeScript
- Based as much as possible on internal assets of Tailwind CSS:
  - via the [`prettier-plugin-tailwindcss` plugin](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
  - via [`tailwind-api-utils`](https://github.com/hyoban/tailwind-api-utils)
- only compatible with:
  - Tailwind CSS v4.x.x
  - ESLint flat config format

## Status

This branch was started back in 2024, and I was quickly stuck while trying to use the internal mechanics of the `tailwindcss` package.

Simple tasks, like loading the CSS config, was impossible inside an ESLint plugin because ESLint plugins are synchronous by design while the tailwindcss package uses plenty of async functions.

😇 Hopefully, [hyoban](https://github.com/hyoban) made [`tailwind-api-utils`](https://github.com/hyoban/tailwind-api-utils) and [demonstrated in a PR](https://github.com/hyoban/eslint-plugin-tailwindcss/pull/3) how I could use it via [`synckit`](https://www.npmjs.com/package/synckit) 👏.

## Work in progress

This version is far from finished, yet it is available and open for contributions.

### Completed steps

- restore the automated tests running on the merge requests of the repo
- implement and test the usage of `tailwind-api-utils`

### Next steps

- read the settings from eslint (shared settings & rules settings)
- create the config utility
- implement the `classnames-order` rule and its tests

## Getting started

I worked on this repo using `pnpm` but it should work with other package manager.

### Install

`pnpm i`

### Build

`pnpm build`

### Test

`pnpm test`

or

`pnpm test:jest`

#### `jest` or `vitest`

Tests were setup to work with `jest` and `vitest` both comes with pros and cons...

I would recommend Vitest but I also added Jest in case you want it.

| Jest                     | Vitest                                         |
| :----------------------- | :--------------------------------------------- |
| Based on `commonjs`      | Based on `ESM`                                 |
| ✅ Mocking               | ✅ Mocking                                     |
| ✅ Snapshots             | ✅ Snapshots                                   |
| ✅ Parallel testing      | ✅ Parallel testing                            |
| ✅ Fast                  | ✅ Often faster                                |
| -                        | ✅ Support benches                             |
| ❌ Require `ts-jest` lib | ❌ Requires `setupFile` and `vitest.config.ts` |

NB: In order to use, the [`RuleTester`](https://typescript-eslint.io/packages/rule-tester) from `@typescript-eslint/rule-tester`, we must:

- Have a `tsconfig.json` with:
  ```
  {
    "compilerOptions": {
      "module": "nodenext",
      "moduleResolution": "nodenext"
    }
  }
  ```
  More info can be found on [`v6`: Cannot find module `@typescript-eslint/*` or its corresponding type declarations](https://github.com/typescript-eslint/typescript-eslint/issues/7284).
  > You can use `bundler`, `node16`, or `nodenext` for `moduleResolution`.
- Use `eslint` with `v8`, [`typescript-eslint` does not support `v9` yet](https://github.com/typescript-eslint/typescript-eslint/issues/8211)

### Docs

`pnpm docs:init` will create new files for each rule if necessary.

`pnpm docs:update` will update existing files and the rules list.

You can see an example of generated documentation in the next section.

### Rules

<!-- begin auto-generated rules list -->

💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                             | Description            | 💡 |
| :------------------------------- | :--------------------- | :- |
| [my-rule](docs/rules/my-rule.md) | An example ESLint rule | 💡 |

<!-- end auto-generated rules list -->

## Additional resources

See [`eslint-plugin-example-typed-linting`](https://github.com/typescript-eslint/examples/tree/main/packages/eslint-plugin-example-typed-linting) for an example plugin that supports typed linting.

## 🤝 Support `eslint-plugin-tailwindcss`

| 🥰 How you can support us?                                                                                                                                                                                                            | 💪 They did it!                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Premium Sponsors** <br /> Support us by becoming a sponsor. <br /> [Become a recurring sponsor](https://github.com/sponsors/francoismassart?frequency=recurring)                                                                    | <a href="https://daily.dev/" target="_blank"><img width="150" src="https://raw.githubusercontent.com/francoismassart/eslint-plugin-tailwindcss/master/sponsors/daily.dev.jpg"></a>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Current Sponsors** <br /> Any amount is appreciated.                                                                                                                                                                                | <a href="https://github.com/jonz94" target="_blank"><img src="https://avatars.githubusercontent.com/u/16042676?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@jonz94"></a> <a href="https://github.com/theMosaad" target="_blank"><img src="https://avatars.githubusercontent.com/u/48773133?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@theMosaad"></a> <a href="https://github.com/acewf" target="_blank"><img src="https://avatars.githubusercontent.com/u/4835572?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@acewf"></a> <a href="https://github.com/charkour" target="_blank"><img src="https://avatars.githubusercontent.com/u/33156025?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@charkour"></a> <a href="https://github.com/dailydotdev" target="_blank"><img class="avatar" src="https://avatars.githubusercontent.com/u/41463883?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@dailydotdev"></a> <a href="https://github.com/codecov" target="_blank"><img class="avatar" src="https://avatars.githubusercontent.com/u/8226205?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@codecov"></a> <a href="https://github.com/sourcegraph" target="_blank"><img class="avatar" src="https://avatars.githubusercontent.com/u/3979584?s=150&amp;v=4" width="75" height="75" style="border-radius:100%;" alt="@sourcegraph"></a> |
| **Past sponsors** <br /> Even if this is just a one-time thing. <br /> [Become a backer](https://github.com/sponsors/francoismassart?frequency=one-time)                                                                              | <a href="https://github.com/aniravi24" target="_blank"><img src="https://avatars.githubusercontent.com/u/5902976?s=100&amp;v=4" width="50" height="50" style="border-radius:100%;" alt="@aniravi24"></a> <a href="https://github.com/mongolyy" target="_blank"><img src="https://avatars.githubusercontent.com/u/10972787?s=100&amp;v=4" width="50" height="50" style="border-radius:100%;" alt="@mongolyy"></a> <a href="https://github.com/t3dotgg" target="_blank"><img src="https://avatars.githubusercontent.com/u/6751787?s=100&amp;v=4" width="50" height="50" style="border-radius:100%;" alt="@t3dotgg"></a>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Contributors** <br /> This project can evolve thanks to all the people who contribute. <br /> You are welcome to [contribute](CONTRIBUTING.md) to this project by reporting issues, feature requests or even opening Pull Requests. | <a href="https://github.com/francoismassart/eslint-plugin-tailwindcss/graphs/contributors"><img src="https://contrib.rocks/image?repo=francoismassart/eslint-plugin-tailwindcss&width=300&columns=4" /></a>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Supporters** <br /> Talk about the plugin on your social networks                                                                                                                                                                   | <a href="https://twitter.com/search?q=eslint-plugin-tailwindcss&src=recent_search_click" target="_blank">eslint-plugin-tailwindcss on Twitter</a>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
