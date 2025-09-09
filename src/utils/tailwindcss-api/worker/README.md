# Warnings about the `*.mjs` worker files

⚠️ The `*.mjs` files in this folder are worker scripts which are ran in node's `worker_threads`.

🤓 This means that they do NOT not execute in the main thread, but in a separate thread.

😅 Because of this, expect some unusual things, like:

- `console.log` won't work within `vitest`…
- You cannot pass complex objects as arguments, only serializable ones.
- You cannot retun complex objects, only serializable ones.
- e.g. You cannot return the `utils.context` directly, but you can return some of its properties…

ℹ️ The `*.mjs` extension indicates that it is an ES module.

ℹ️ It won't be compiled, just **copied as is** into the dist package by the `build` script.

✅ We still check the syntax with TypeScript, but it is not a TypeScript file.

🌀 Using `*.ts` for these files would be tricky because `vitest` needs them "as is" while runtime will expect `*.mjs`.
