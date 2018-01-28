### changing the current working directory

The `cd` action changes into the directory
that its embedded link or code block points to.


#### Example

Assuming the workspace contains a <a textrun="create-directory">`foo`</a> directory,
you can change into it via this Markdown code:

<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="cd">
Let's change into the [foo](foo) directory.
</a>

<a textrun="cd">
Let's change into the `..` directory.
</a>
```
</a>

The directory path should be a link
so that readers of your documentation can click to see it.


#### More info

- [feature specs](../../features/activity-types/built-in/cd/cd.feature)
- [source code](../../src/activity-types/cd.js)
