# Developers Guide

This guide applies to all codebases in this mono-repo.

## Setup after cloning

You need to have these tools installed:

- [Node.js](https://nodejs.org) version 10 or later
- [Yarn](https://yarnpkg.com)
- Gnu Make - the `make` command should exist on your machine
- to see code statistics: [scc](https://github.com/boyter/scc)

To start working on the codebase after cloning:

- <code textrun="verify-make-command">make setup</code> to install dependencies
- optionally: add `./bin` and `./node_modules/.bin` to the `PATH` environment
  variable

## Running tools

- run all tests: <code textrun="verify-make-command">make test</code>
- run all tests in offline mode: <code textrun="verify-make-command">make
  test-offline</code>
- run end-to-end tests: <code textrun="verify-make-command">make cuke</code>
- run end-to-end tests in offline mode: <code>make cuke-offline</code>
- run unit tests: <code>make unit</code>
- run documentation tests: <code textrun="verify-make-command">make docs</code>
- run all linters: <code textrun="verify-make-command">make lint</code>

To debug a single end-to-end test:

- enable console output: add the `@verbose` Gherkin tag
- enable debugging statements and verbose output: add the `@debug` Gherkin tag

To determine test coverage, run <code textrun="verify-make-command">make
coverage</code>. The coverage in relatively low because TextRunner contains
copious amounts of defensive checks against invalid user input. Not all
permutations of that are tested.

## Debugging

To debug in VSCode:

- compile with source maps: `make build-debug`
- add this launch configuration to VSCode:
  ```
  {
    "type": "node",
    "request": "launch",
    "name": "run text-runner",
    "program": "${workspaceFolder}/src/cli.ts",
    "outFiles": ["${workspaceFolder}/dist/**"]
  }
  ```
- switch VSCode to the debug view
- start the `run text-runner` profile

To debug Cucumber tests in VSCode:

- open `.vscode/launch.json`
- edit the `cuke current file` section:
  - args
  - cwd
- set a breakpoint inside Cucumber code
- switch VSCode to the debug view
- start the `cuke current file` profile

## Deployment

- bump all occurrences of `4.0.3` on master and commit
- in [text-runner](text-runner/): run `npm publish`
