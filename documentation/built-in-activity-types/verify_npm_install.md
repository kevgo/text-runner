### Verifying NPM installation instructions

Authors of [NPM](https://www.npmjs.com) modules
want to provide accurate installation instructions.
This action verifies that the instructions use the correct package name
that is listed in `package.json`.

#### Example

<a textrun="create-file">
Assuming our __package.json__ file looks like this:

```json
{
  "name": "my_enormous_package"
}
```

</a>

then the action below verifies that the instructions use the correct NPM package name:

<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="verify-npm-install">
`​``
$ npm i -g my_enormous_package
`​``
</a>
```
</a>

#### More info

- [feature specs](../../features/actions/built-in/verify-npm-install/verify-npm-install.feature)
- [source code](../../src/actions/verify-npm-install.ts)
