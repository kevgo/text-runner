# Tutorial Runner Developer Documentation

## Installation

* `npm i`


## Testing

* run all tests: `bin/spec`
* run linter: `bin/lint`
* run feature specs: `bin/features`
* run tut-run: `bin/docs`

To debug a single test:
* enable console output: add the `@verbose` tag
* enable debugging output: add the `@debug` tag


## Terminology

A _tutorial_ is the set of MarkDown files that we want to test here.
Each MarkDown file consists of text (that is ignored here),
and a number of _blocks_.
Blocks are specially marked up regions in the MarkDown file that are runnable.
They get executed by the corresponding _action_ for the block's _type_.
For example, the block "createFileWithContent"
is being executed by the "create-file-with-content" action.
Tutorial Runner provides a number of built-in actions for common activities.
It is also possible to define your own custom block types and actions.


## Architecture

- tests use 'tmp' as the workspace for creating files
- the feature tests run inside the `test-dir` directory
