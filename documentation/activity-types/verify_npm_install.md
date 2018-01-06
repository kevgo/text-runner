### Verifying NPM installation instructions

Authors of [NPM](https://www.npmjs.com) modules
want to provide accurate installation instructions.
This action verifies that the instructions use the correct package name
that is listed in `package.json`.


#### Example

<a class="tr_createFile">
Assuming our __package.json__ file looks like this:

```json
{
  "name": "my_enormous_package"
}
```
</a>

then the action below verifies that the instructions use the correct NPM package name:

<a class="tr_runMarkdownInTextrun">
```markdown
<a class="tr_verifyNpmInstall">
`​``
$ npm i -g my_enormous_package
`​``
</a>
```
</a>


#### More info

- [feature specs](../../features/activity-types/built-in/verify-npm-install/verify-npm-install.feature)
- [source code](../../src/activity-types/verify-npm-install.js)
