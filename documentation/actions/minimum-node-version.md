### Required NodeJS version

The `minimumNodeVersion` action verifies that the documented minimum Node version actually
matches what CI servers test against.


#### Example

Assuming you have a file
<a class="textRunner_createFile">
__.travis.yml__ with content:

```
node_js:
  - 4
  - 6
```
</a>

then you can verify that documentation like:

<a class="textRunner_runMarkdownInTextrun">
```markdown
Runs on Node <a class="textRunner_minimumNodeVersion">4</a> or above.
</a>
```
</a>

lists the correct version number.


#### More info

- [feature specs](../../features/actions/built-in/minimum-node-version/minimum-node-version.feature)
- [source code](../../src/actions/built-in/minimum-node-version.ls)
