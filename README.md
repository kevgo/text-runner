<picture>
  <source media="(prefers-color-scheme: dark)" srcset="documentation/logo_800_dark.png">
  <source media="(prefers-color-scheme: light)" srcset="documentation/logo_800_light.png">
  <img alt="Text-Runner logo" src="documentation/logo_800_light.png">
</picture>

<div align="center">

[![CI](https://github.com/kevgo/text-runner/actions/workflows/ci.yml/badge.svg)](https://github.com/kevgo/text-runner/actions/workflows/ci.yml)
[![CI](https://ci.appveyor.com/api/projects/status/96q06796xyrste9x/branch/main?svg=true)](https://ci.appveyor.com/project/kevgo/text-runner/branch/main)
<br>

</div>

Text-Runner is a test framework for technical documentation. It helps keep
documentation up to date. An example is the text you are reading right now.
TextRunner verifies it for technical correctness.

As a fully programmable test framework, TextRunner can read and understand any
form of Markdown-formatted text in any human language as well as complex data in
tables, bullet point lists, and even images!

### For users

- [how it works](documentation/how-it-works.md)
- [installation](documentation/installation.md)
- [built-in actions](documentation/built-in-actions.md)
- [user-defined actions](documentation/user-defined-actions.md)
  - [example actions](examples/)
- [Q&A](documentation/qna.md)
- [related tools](documentation/related-tools.md)

### Plugins

This monorepo contains a number of Text-Runner plugins that provide more
domain-specific functionality. You can think of these plugins as the "standard
library" of Text-Runner.

- [repo](textrun-repo/): verify source code files
- [workspace](textrun-workspace/): modify/verify workspace files
- [shell](textrun-shell/): run executables in a subshell
- [javascript](textrun-javascript/): run/verify embedded JavaScript code
- [make](textrun-make/): verify Makefile targets
- [npm](textrun-npm/): verify the documentation of npm modules
- [action](textrun-action/): verify the documentation of Text-Runner plugins

### For developers

This mono-repository contains the source code for the Text-Runner engine,
tooling, and some plugins containing popular actions.

- [developers guide](documentation/DEVELOPMENT.md)
- [text-runner-engine](text-runner-engine): the Text-Runner runtime
- [text-runner-cli](text-runner-cli): runs Text-Runner on the command line
- [text-runner-features](text-runner-features): end-to-end tests for engine and
  CLI
- [shared test code](shared/)
