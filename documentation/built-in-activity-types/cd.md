### changing the current working directory

The `cd` action changes into the directory
that its embedded link or code block points to.

#### Example

<a textrun="run-markdown-in-textrun">
```markdown
Assuming the workspace contains a <code textrun="create-directory">foo</code> directory,
you can change into it via this Markdown code:

<code textrun="cd">foo</code>

```
</a>

The directory path should be a link
so that readers of your documentation can click to see it.


#### More info

- [feature specs](../../features/actions/built-in/cd/cd.feature)
- [source code](../../src/actions/cd.ts)
```
