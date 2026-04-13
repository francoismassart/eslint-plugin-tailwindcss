# Contributing to `esLint-plugin-tailwindcss`

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Getting started with development

I worked on this repo using `pnpm` but it should work with other package manager.

### Install

`pnpm i`

### Build

`pnpm build`

### Test

`pnpm test`

### Docs

`pnpm docs:init` will create new files for each rule if necessary.

`pnpm docs:update` will update existing files and the rules list.

You can see an example of generated documentation in the next section.

## Additional resources

See [`eslint-plugin-example-typed-linting`](https://github.com/typescript-eslint/examples/tree/main/packages/eslint-plugin-example-typed-linting) for an example plugin that supports typed linting.

Another example of eslint-plugin using `typescript-eslint` is [`eslint-plugin-vitest`](https://github.com/vitest-dev/eslint-plugin-vitest)…

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.
