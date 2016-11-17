### changing the current working directory

Tutorial Runner runs by default in the `tmp` directory.
To change it, use the `cd` action.
It changes into the directory that the link in its block points to.
The directory path should be a link
because your documentation wants to point to it.

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_cd">
Let's change into the [foo](.) directory to see what's in there.
</a>
```
</a>
