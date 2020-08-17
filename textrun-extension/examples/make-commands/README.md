The <b textrun="action/name-full">make/target</b> action verifies that the
mentioned Make target exists. <a textrun="workspace/append-file"> In our example
codebase the **README.md** file could contain another part:

```html
If it doesn't work, run the <code textrun="make/target">foo</code> target again.
```

</a>

<a textrun="run-textrunner">

Text-Runner verifies that the `Makefile` contains the `foo` target.
