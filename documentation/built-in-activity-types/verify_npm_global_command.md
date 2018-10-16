### Verifying global commands provided by NPM modules

Authors of [NPM](https://www.npmjs.com) modules
want to describe global commands provided by their modules.
This action verifies those command names in documenation.

#### Example

<a textrun="create-file">
Assuming our __package.json__ file looks like this:

```json
{
  "bin": {
    "foo": "bin/foo"
  }
}
```

</a>

then the action below verifies that the instructions describe
the correct global command name exported by this NPM module.

<a textrun="run-markdown-in-textrun">
```markdown
To run this app, call:

<a textrun="verify-npm-global-command">
`​``
$ foo
`​``
</a>
```
</a>

#### More info

- [feature specs](../../features/actions/built-in/verify-npm-global-command/verify-npm-global-command.feature)
- [source code](../../src/actions/verify-npm-global-command.ts)
