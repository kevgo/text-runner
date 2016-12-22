### Required NodeJS version

The `minimumNodeVersion` action verifies that the documented minimum Node version actually
matches what CI servers test against.


#### Example

Assuming you have a file
<a class="tutorialRunner_createFile">
__.travis.yml__ with content:

```
node_js:
  - 4
  - 6
```
</a>

then you can verify that documentation like:

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
Runs on Node <a class="tutorialRunner_minimumNodeVersion">4</a> or above.
</a>
```
</a>

lists the correct version number.


#### More info

- [feature specs](../../features/actions/built-in/minimum-node-version/minimum-node-version.feature)
- [source code](../../src/actions/built-in/minimum-node-version.ls)
