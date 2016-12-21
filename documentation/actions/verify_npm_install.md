### Verifying NPM installation instructions

Authors of [NPM](https://www.npmjs.com) modules
want to provide accurate installation instructions.
This action verifies that the instructions use the correct package name
that is listed in `package.json`.

<a class="tutorialRunner_createFile">
Assuming our __package.json__ file looks like this:

```json
{
  "name": "my_enormous_package"
}
```
</a>

then the action below verifies that the instructions use the correct NPM package name:

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_verifyNpmInstall">
`​``
$ npm i -g my_enormous_package
`​``
</a>
```
</a>
