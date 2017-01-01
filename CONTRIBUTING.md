# TextRunner Developer Documentation

## Installation for development

* `npm install`
* add `./bin` and `./node_modules/.bin` to your PATH


## Testing

* run all tests: `bin/spec`
* run linter: `bin/lint`
* run feature specs: `bin/features`
* run text-run: `bin/docs`

To debug a single test:
* enable console output: add the `@verbose` tag
* enable debugging statements and verbose output: add the `@debug` tag


## Terminology

Each MarkDown file consists of plain text (that is not executable),
and a number of _blocks_ (which are executable).
Blocks are specially marked up regions of MarkDown.
The markup for a block contains a decription of the _type_ of the block.
TextRunner comes with built-in block types,
for example to create files or directories, verify file contents,
or start external processes.
You can also create your own _custom block types_
by providing a JavaScript method that TextRunner calls when it wants to execute a block of this type.
This method is called the _action_ for the block _type_.


## Architecture

- tests run inside a global temp directory
- the feature tests run inside a global temp directory
