# Text-Runner mono-repo

<a href="https://circleci.com/gh/kevgo/text-runner">
  <img src="https://circleci.com/gh/kevgo/text-runner.svg?style=shield" />
</a>
<a href="https://ci.appveyor.com/project/kevgo/text-runner/branch/master">
  <img src="https://ci.appveyor.com/api/projects/status/96q06796xyrste9x/branch/master?svg=true" alt="Windows build status" />
</a>
<br><br>

This mono-repo contains the source code and documentation for Text-Runner as
well as some frequently used plugins:

- [.circleci](.circleci/): configuration of the continuous integration server
- [.github](.github/): configuration for bots used for development
- [.vscode](.vscode/): configuration for source code editor
- [documentation](documentation/): documentation for the product
- [examples](examples/): examples for how to make custom actions
- [shared](shared/): code used to test other codebases
- [text-runner-core](text-runner-core): the Text-Runner engine
- [text-runner-cli](text-runner-cli): runs Text-Runner on the command line
- [text-runner-features](text-runner-features): end-to-end tests for core and
  CLI
- [textrun-action](textrun-action/): actions to verify the documentation of
  Text-Runner plugins
- [textrun-javascript](textrun-javascript/): actions to run/verify embedded
  JavaScript code
- [textrun-make](textrun-make/): actions to verify Makefile targets
- [textrun-npm](textrun-npm/): actions to verify the documentation of npm
  modules
- [textrun-repo](textrun-repo/): actions to verify source code files
- [textrun-shell](textrun-shell/): actions to run executables in a subshell
- [textrun-workspace](textrun-workspace/): actions to modify/verify workspace
  files

See also the [developers guide](DEVELOPMENT.md).
