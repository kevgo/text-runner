### Required NodeJS version

The `minimumNodeVersion` action verifies that the documented minimum Node version actually
matches what CI servers test against.


#### Example

Assuming you have a file
<a class="tr_createFile">
__.travis.yml__ with content:

```
node_js:
  - 4
  - 6
```
</a>

then you can verify that documentation like:

<a class="tr_runMarkdownInTextrun">
```markdown
Runs on Node <a class="tr_minimumNodeVersion">4</a> or above.
</a>
```
</a>

lists the correct version number.


#### More info

- [feature specs](../../features/activity-types/built-in/minimum-node-version/minimum-node-version.feature)
- [source code](../../src/activity-types/minimum-node-version.js)
