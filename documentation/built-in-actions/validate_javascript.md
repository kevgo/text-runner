# Validating JavaScript code

This action just checks that JavaScript code contains no syntax errors. It is
for code blocks that aren't runnable in the context of the tutorial. To run
Javascript code use the [runJavascript](run_javascript.md) action.

```html
<a textrun="validate-javascript">
  `console.log('This is getting validated by TextRunner!')`
</a>
```

#### More info

- [feature specs](../../features/actions/built-in/run-javascript/run-javascript.feature)
- [source code](../../src/actions/built-in/run-javascript.ts)
