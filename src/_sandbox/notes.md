# Notes

## Unfixed issues

module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/Users/fma/eslint-plugin-tailwindcss/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.

eslint-doc-generator

- docs:init
- docs:update

- test:jest

> Try tsconfig.json
> compilerOptions.module to NodeNext or ESNext
> ?

## Solution

### tsconfig.json

- "module": "preserve",
- "moduleResolution": "bundler",
- "exclude": ["src/**/*.spec.ts", "src/_sandbox/*"]

### packages.json

- "type": "module",
- "build": "tsc --build",

### In relative imports

- load json via `import fooData from '../package.json' with { type: 'json' };`
- add the ".js" extension to relative import
  - `import { recommendedRulesConfig, rules } from "./rules";` becomes
  - `import { recommendedRulesConfig, rules } from "./rules.js";`
- import type example: `import type { PluginSharedSettings } from "../types";`

# Vitest

## packages

```
"type": "module",
"main": "./dist/index.cjs",
"module": "./dist/index.mjs",
"types": "./dist/index.d.cts",
```

## tsconfig

```
"baseUrl": ".",
"moduleResolution": "Bundler",
"module": "ESNext",
"strictNullChecks": true
"target": "ESNext",
"types": [
    "vitest/globals"
],
```

# Better TW

## packages

```
"type": "module",
```

## tsconfig

```
"baseUrl": ".",
"lib": ["ESNext"],
"module": "Preserve",
"noEmit": true,
"noImplicitAny": false,
"paths": {
    "better-tailwindcss:build/*": ["build/*"],
    "better-tailwindcss:options/*": ["src/options/*"],
    "better-tailwindcss:configs/*": ["src/configs/*"],
    "better-tailwindcss:parsers/*": ["src/parsers/*"],
    "better-tailwindcss:rules/*": ["src/rules/*"],
    "better-tailwindcss:tests/*": ["tests/*"],
    "better-tailwindcss:types/*": ["src/types/*"],
    "better-tailwindcss:utils/*": ["src/utils/*","src/async-utils/*"],
    "better-tailwindcss:tailwindcss/*": ["src/tailwindcss/*"]
},
"target": "ES2020",
"verbatimModuleSyntax": true
```
