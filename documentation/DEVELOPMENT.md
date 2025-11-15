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

## Running tools

All codebases in this mono-repo provide a standardized set of commands for
executing common development tasks. You must run these commands in the directory
of the respective codebase.

- run all tests: <code type="make/command" dir="..">make test</code>
- run unit tests: <code type="make/command" dir="..">make unit</code>
- run end-to-end tests: <code type="make/command" dir="..">make cuke</code>
- run documentation tests: <code type="make/command" dir="..">make doc</code>
- run linters: <code type="make/command" dir="..">make lint</code>
- run auto-fixers: <code type="make/command" dir="..">make fix</code>

To enable debugging statements and verbose output while debugging an end-to-end
test, add the `@debug` Gherkin tag in the first line of the `.feature` file.

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
make update
</pre>

Always update the dependencies for all codebases so that they use the exact same
versions.

## Deployment

- on a branch:
  - update CHANGELOG.md
  - `yarn run json-schema && make fix` in the root folder
  - bump the versions by running one of:
    - `lerna version patch --no-private`
    - `lerna version minor --no-private`
    - `lerna version major --no-private`
  - make a global search-and-replace for `7.4.0` and `0.5.0` replace with the
    new versions
  - ship this branch
- `git town sync --all && git tag 7.4.0 && git push --tags`
- run <code type="make/command" dir="..">make publish</code>
