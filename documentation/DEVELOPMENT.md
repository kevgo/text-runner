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

- `yarn run json-schema` in the root folder and ship
- bump the versions by running `lerna version <patch|minor|major> --no-private`
- make a global search-and-replace for "6.0.1" and "0.2.1" replace it with the
  new version
- get this change into the `main` branch
- run <code type="make/command" dir="..">make publish</code>
