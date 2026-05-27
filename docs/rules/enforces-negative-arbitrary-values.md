# Warns about `-` prefixed classnames using arbitrary values

⚠️ This rule _warns_ in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```html
<section class="-m-[-5px]">
  <pre class="-z-[1]">enforces-negative-arbitrary-values</pre>
</section>
```

Examples of **correct** code for this rule:

```html
<section class="m-[5px]">
  <pre class="z-[-1]">enforces-negative-arbitrary-values</pre>
</section>
```

The first invalid classname `-m-[-5px]` uses a double negation which:

- is harder to read
- may be the doppelgänger of an already used `m-[-5px]`

The second invalid classname `-z-[1]`:

- feels odd
- its `z-[-1]` version is nicer

### Benefits

- 🤓 Improved **readability**
- 🫠 **Avoid double negation**
- 🎯 **Self-contained value**
- ✅ **Standardized formatting**
- ⚖️ **Less generated CSS**

## Options

<!-- begin auto-generated rule options list -->

<!-- end auto-generated rule options list -->

There are no specific options for this rule, yet it uses the general [settings](../../README.md#settings).
