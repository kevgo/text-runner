# Text-Runner Developers Guide

## Installation for development

You need to have installed:

- [Node.js](https://nodejs.org) version 8 or later
- [Yarn](https://yarnpkg.com)
- Gnu Make - running `make` should work on your machine

To work on the codebase:

- run `yarn`
- add `./bin` and `./node_modules/.bin` to your PATH

To see code statistics, install [scc](https://github.com/boyter/scc)

## Style

Text-Runner is written in [TypeScript](https://www.typescriptlang.org) and
formatted by [Prettier](https://prettier.io).

Commit messages must follow the
[Conventional Commits Specification](https://www.conventionalcommits.org). The
following scopes are available for commit messages:

- **actions:** the built-in actions
- **CLI:** the CLI
- **commands:** the available commands
- **configuration:** the configuration
- **ecosystem:** the developer ecosystem
- **core:**: work on the Text-Runner engine
- **devops:** for deployment and CI
- **formatters:** work on formatters
- **markdown:** work on input, like the Markdown parser

## Testing

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

## Architecture

The architecture is best understood by following along with how a set of
documents is tested. There are several CLI executables to start TextRunner:

- [bin/text-run](bin/text-run) for unix-like systems and macOS
- [bin/text-run.cmd](bin/text-run.cmd) for Windows

These CLI executables call the [cli.ts](src/cli.ts) CLI module. The CLI
subsystem parses the command-line arguments and calls TextRunner's
[JavaScript API](src/text-runner.ts). This API is located in the file
[src/text-runner.ts](src/text-runner.ts) and also Text-Runner's core.

The core asks the [configuration](src/configuration) module for the current
[configuration](src/configuration/types/configuration.ts) settings coming from
command-line arguments and/or configuration files. The configuration structure
tells TextRunner the command to run. Commands are stored in the
[commands](src/commands) folder. The most important command is
[run](src/commands/run.ts), there are others like [help](src/commands/help.ts),
[setup](src/commands/setup.ts), or [version](src/commands/version.ts).

The [run command](src/commands/run.ts) has a functional architecture that
converts the configuration into test results over several steps:

1. **configuration --> list of Markdown files to test:** this is done by the
   [filesystem module](src/filesystem)
1. **list of filenames --> list of file ASTs:** the [parse module](src/parsers)
   [reads](src/parsers/markdown/parse-markdown-files.ts) each file and
   [parses](src/parsers/markdown/md-parser.ts) it into the
   [standard AST](src/parsers/standard-AST) format. The standard AST is
   optimized for analyzing and testing,and identical for comparable Markdown and
   HTML input.
1. **list of ASTs --> list of tests steps to execute:** the
   [activities module](src/activity-list) finds _active blocks_ in the ASTs and
   gathers all the related information. The output of this step is several
   lists: parallelizable tests like checking static file and image links and
   sequential tests that have to run one after the other.
1. **list of test steps --> list of test results:** the
   [runner module](src/runners) executes the test steps given to it and writes
   test progress to the console via the configured [formatter](src/formatters).
   Each test step gets their own formatter instance, this ensures concurrency:
   the formatter collects all the output of that test step then prints it as a
   block when the test step is done.
1. **test results --> test statistics:** finally, we write a summary of the test
   to the console and terminate with the corresponding exit code.

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
- start the `run text-runner` configuration

## Deployment

- bump version in `package.json` on master and commit
- run `npm publish`
