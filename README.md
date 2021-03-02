<!-- logo is from: https://icons8.com/icon/40886/test -->
<img src="documentation/logo2.png" align="right" valign="bottom">

# Test-Runner for Text

<a href="https://circleci.com/gh/kevgo/text-runner">
  <img src="https://circleci.com/gh/kevgo/text-runner.svg?style=shield" />
</a>
<a href="https://ci.appveyor.com/project/kevgo/text-runner/branch/master">
  <img src="https://ci.appveyor.com/api/projects/status/96q06796xyrste9x/branch/master?svg=true" alt="Windows build status" />
</a>
<br><br>

Text-Runner is an agile documentation tool that helps create living end-user
readable documentation. An example is the text you are reading right now, which
is verified for correctness by TextRunner.

If you tell it how, TextRunner can read and understand any form of
Markdown-formatted text in any human language as well as complex data in tables,
bullet point lists, and even embedded images!

### For users

- [how it works](documentation/how-it-works.md)
- [installation](documentation/installation.md)
- [configuration](documentation/configuration.md)
- [built-in actions](documentation/built-in-actions.md)
- [user-defined actions](documentation/user-defined-actions.md)
  - [example actions](examples/)
- [Q&A](documentation/qna.md)
- [related tools](documentation/related-tools.md)

### Plugins

- [verify source code files](textrun-repo/)
- [modify/verify workspace files](textrun-workspace/)
- [run executables in a subshell](textrun-shell/)
- [run/verify embedded JavaScript code](textrun-javascript/)
- [verify Makefile targets](textrun-make/)
- [verify the documentation of npm modules](textrun-npm/)
- [verify the documentation of Text-Runner plugins](textrun-action/)

### For developers

This mono-repository contains the source code for the Text-Runner engine,
tooling, and some plugins containing popular actions.

- [developers guide](documentation/DEVELOPMENT.md)
- [text-runner-core](text-runner-core): the Text-Runner engine
- [text-runner-cli](text-runner-cli): runs Text-Runner on the command line
- [text-runner-features](text-runner-features): end-to-end tests for core and
  CLI
- [shared test code](shared/)
