# Text-Runner Developers Guide

## Architecture

The architecture is best understood by following along with how a set of
documents is tested. There are several CLI executables to start TextRunner:

- [text-runner/bin/text-run](text-runner/bin/text-run) for unix-like systems and
  macOS
- [text-runner/bin/text-run.cmd](text-runner/bin/text-run.cmd) for Windows

These CLI executables call the [cli.ts](text-runner/src/cli.ts) CLI module. The
CLI subsystem parses the command-line arguments and calls TextRunner's
[JavaScript API](text-runner/src/text-runner.ts). This API is located in the
file [src/text-runner.ts](text-runner/src/text-runner.ts) and also Text-Runner's
core.

The core asks the [configuration](text-runner/src/configuration) module for the
current [configuration](text-runner/src/configuration/types/configuration.ts)
settings coming from command-line arguments and/or configuration files. The
configuration structure tells TextRunner the command to run. Commands are stored
in the [commands](text-runner/src/commands) folder. The most important command
is [run](text-runner/src/commands/run.ts), there are others like
[help](text-runner/src/commands/help.ts),
[setup](text-runner/src/commands/setup.ts), or
[version](text-runner/src/commands/version.ts).

The [run command](text-runner/src/commands/run.ts) has a functional architecture
that converts the configuration into test results over several steps:

1. **configuration --> list of Markdown files to test:** this is done by the
   [filesystem module](text-runner/src/filesystem)
1. **list of filenames --> list of file ASTs:** the
   [parse module](text-runner/src/parsers)
   [reads](text-runner/src/parsers/markdown/parse-markdown-files.ts) each file
   and [parses](text-runner/src/parsers/markdown/md-parser.ts) it into the
   [standard AST](text-runner/src/parsers/standard-AST) format. The standard AST
   is optimized for analyzing and testing,and identical for comparable Markdown
   and HTML input.
1. **list of ASTs --> list of tests steps to execute:** the
   [activities module](text-runner/src/activity-list) finds _active blocks_ in
   the ASTs and gathers all the related information. The output of this step is
   several lists: parallelizable tests like checking static file and image links
   and sequential tests that have to run one after the other.
1. **list of test steps --> list of test results:** the
   [runner module](text-runner/src/runners) executes the test steps given to it
   and writes test progress to the console via the configured
   [formatter](text-runner/src/formatters). Each test step gets their own
   formatter instance, this ensures concurrency: the formatter collects all the
   output of that test step then prints it as a block when the test step is
   done.
1. **test results --> test statistics:** finally, we write a summary of the test
   to the console and terminate with the corresponding exit code.
