# text-runner-cli Developers Guide

## Architecture

The architecture is best understood by following the control flow when testing a
set of documents. There are several CLI executables to start TextRunner:

- [bin/text-run](bin/text-run) for unix-like systems and macOS
- [bin/text-run.cmd](bin/text-run.cmd) for Windows

These CLI executables call the [cli.ts](src/cli.ts) CLI module. The CLI
subsystem parses the command-line arguments, loads the configuration file, and
calls TextRunner's [JavaScript API](../text-runner-core/).

[Formatters](src/formatters/formatter.ts) subscribe to the event stream of
Text-Runner's engine and print test progress to the CLI. Multiple formatter
implementations are available.
