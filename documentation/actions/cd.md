### changing the current working directory

The `cd` action changes into the directory
that its embedded link or code block points to.


#### Example

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_cd">
Let's change into the [foo](.) directory.
</a>

<a class="tutorialRunner_cd">
Let's change into the `..` directory.
</a>
```
</a>

The directory path should be a link
so that readers of your documentation can click to see it.


#### More info

- [feature specs](../../features/actions/built-in/cd/cd.feature)
- [source code](../../src/actions/built-in/cd.ls)
