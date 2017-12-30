# TextRunner Developer Documentation

## Installation for development

* `npm install`
* add `./bin` and `./node_modules/.bin` to your PATH


## Testing

* run all tests: `bin/spec`
* run feature specs: `bin/features`
* run feature specs against the JS API: `bin/cuke-api`
* run feature specs against the CLI: `bin/cuke-cli`
* run feature specs against the CLI in offline mode: `bin/cuke-cli --tags '~@online'`
* run text-run: `bin/docs`

To debug a single test:
* enable console output: add the `@verbose` tag
* enable debugging statements and verbose output: add the `@debug` tag

To determine test coverage, run `bin/coverage`.
The coverage in relatively low because TextRunner contains copious amounts of
defensive checks against invalid user input.
Not all permutations of that are tested.


## Linting

* run all linters: `bin/lint`
* run JavaScript linters: `bin/lint-js`
* run Markdown linters: `bin/lint-md`

The JavaScript Standard linter does not properly handle Flow types at this point,
hence it is recommended to only show flow lint messages in your editor,
not the error messages from "standard".
Use the `bin/lint-js` script instead.


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
