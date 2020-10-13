# Developers Guide

This guide is for all codebases in this mono-repo.

## Setup after cloning

You need to have these tools installed:

- [Node.js](https://nodejs.org) version 10 or later
- [Yarn](https://yarnpkg.com)
- Gnu Make - the `make` command should exist on your machine
- to see code statistics: [scc](https://github.com/boyter/scc)

To get the codebase into a runnable state after cloning:

- <code type="make/command" dir="..">make setup</code> to install dependencies
- optionally add `./bin` and `./node_modules/.bin` to the `PATH` environment
  variable

## Running tools

All codebases in this mono-repo provide a standardized set of commands for
executing common tasks. You must run these commands in the directory of the
respective codebase.

- run all tests: <code type="make/command">make test</code>
- run unit tests: <code>make unit</code>
- run end-to-end tests: make cuke
- run documentation tests: <code type="make/command">make docs</code>
- run linters: <code type="make/command">make lint</code>
- run auto-fixers: <code type="make/command">make fix</code>

See how the commands inside the Makefile work for how to test individual files.
To enable debugging statements and verbose output while debugging an end-to-end
test, add the `@debug` Gherkin tag in the first line of the `.feature` file.

In the root directory, there are `make *-all` tasks that run the respective task
in all codebases of the mono-repo. The `make *-open` targets run in all
codebases containing uncommitted changes. The `make *-changed` targets run in
all codebases containing changes compared to the master branch. The
`make *-affected` targets run in all codebases affected by changes in the
current branch: code bases with changes and their downstream dependencies.

## Debugging

To debug Text-Runner in VSCode:

- switch VSCode to the debug view
- start the `run text-runner` profile

To debug a unit test:

- set a breakpoint in the unit test
- switch VSCode to the debug view
- start the `unit` profile

To debug a Cucumber step implementation in VSCode:

- open `.vscode/launch.json`
- edit the `cuke current file` section:
  - args
  - cwd
- set a breakpoint inside Cucumber code
- switch VSCode to the debug view
- start the `cuke current file` profile

## Updating dependencies

<pre type="make/command" dir="..">
make update-all
</pre>

Always update the dependencies for all codebases so that they use the exact same
versions.

## Deployment

- bump the versions by running `lerna version <patch|minor|major> --no-private`
  or make a global search-and-replace for "5.0.0-pre9" and replace it with the
  new version
- get this change into the master branch
- run `make publish-all`
