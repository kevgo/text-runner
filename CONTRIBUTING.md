# TextRunner Developer Documentation

## Installation for development

* you need to have Gnu Make installed - running `make` should work on your machine
* run `make setup` to install all needed software and libraries on your computer
* add `./bin` and `./node_modules/.bin` to your PATH


## Testing

* run all tests: <a textrun="does-make-target-exist">`make spec`</a>
* run feature specs: <a textrun="does-make-target-exist">`make features`</a>
* run feature specs against the JS API: <a textrun="does-make-target-exist">`make cukeapi`</a>
* run feature specs against the CLI: <a textrun="does-make-target-exist">`make cukecli`</a>
* run feature specs against the CLI in offline mode: `make cukecli --tags '~@online'`
* run text-run: <a textrun="does-make-target-exist">`make docs`</a>

To debug a single test:
* enable console output: add the `@verbose` tag
* enable debugging statements and verbose output: add the `@debug` tag

To determine test coverage, run <a textrun="does-make-target-exist">`make coverage`</a>.
The coverage in relatively low because TextRunner contains copious amounts of
defensive checks against invalid user input.
Not all permutations of that are tested.


## Linting

* run all linters: <a textrun="does-make-target-exist">`make lint`</a>
* run JavaScript linters: <a textrun="does-make-target-exist">`make lintjs`</a>
* run Markdown linters: <a textrun="does-make-target-exist">`make lintmd`</a>

The JavaScript Standard linter does not properly handle Flow types at this point,
hence it is recommended to only show flow lint messages in your editor,
not the error messages from "standard".
Use the `make lintjs` script instead.


## Editor setup

Set up your editor with the following configuration:
- linters: run `flow`, then `standard`
- fixers: run `prettier_standard`
  (which runs [Prettier](https://github.com/prettier/prettier),
  then [StandardJS](https://standardjs.com)

Vim users can use this configuration option for [Ale](https://github.com/w0rp/ale):
```vim
let g:ale_linters = {
\   'javascript': ['flow', 'standard']
\}
let g:ale_fixers = {
\   'javascript': ['prettier_standard']
\}
let g:ale_javascript_prettier_use_local_config = 1
```


## Terminology

TextRunner runs _active documentation_, i.e. documentation that can be executed.
Active documentation consists of of plain text that is not executable
but contains a number of _active blocks_
(regions of Markdown wrapped in an _activation tag_
which are executable.
The default activation tag is `<a textrun="{{activity type}}">...</a>` tags).
Activation tags specify the _activity type_ that should be executed inside the
respective active block.
TextRunner comes with built-in activity types,
for example to create files or directories, verify file contents,
or start external processes.
You can also create your own _custom activity types_
by providing a file with the activity type name in the `text-run` directory
of your code base, which exports a function that runs the activity.

Inside TextRunner, an _activity_ means an instance of a activity type
that executes a particular active block.


## Architecture

The architecture is best understood by following along
with how a set of documents is tested.
There are several CLI executables to start TextRunner:
- [bin/text-run](bin/text-run) for unix-like systems and macOS
- [bin/text-run.cmd](bin/text-run.cmd) for Windows

These CLI executables call the [cli.js](src/cli/cli.js) CLI handler.
They parse the command-line arguments and call TextRunner's JavaScript API
in the form of the [TextRunner](src/text-runner.js) class.
This API is also exported by the [TextRunner NPM module](https://www.npmjs.com/package/text-runner)
and can be used by other tools.

The TextRunner class is the central part of TextRunner.
It instantiates and runs the other components of the framework.
Next, TextRunner determines the various configuration settings
coming from command-line arguments and/or configuration files
via the [configuration](src/configuration/configuration.js) class.
This class is passed to the various subsystems of TextRunner
in case they need to know configuration settings.
Using this configuration class, TextRunner determines the command to run.
Commands are stored in the [commands](src/commands) folder.
The most important command is [run](src/commands/run),
there are others like [help](src/commands/help),
[setup](src/commands/setup), or [version](src/commands/version).

The `run` command determines the Markdown files to test,
and creates a [MarkdownFileRunner](src/commands/run/markdown-file-runner.js) instance for each file.
Running the files happens in two phases:

1. In the `prepare` phase, each MarkdownFileRunner parses the Markdown content
  using a [MarkdownParser](src/parsers/markdown/markdown-parser.js) instance
  which converts the complex and noisy Markdown AST
  (and in the future HTML AST)
  into a simplified and flattened list of TextRunner-specific [AstNodes](src/parsers/ast-node.js)
  that contain only relevant relevant information.
  An [ActionListBuilder](src/commands/run/activity-list-builder.js) instance
  processes this TextRunner-AST into a list of [Actions](src/commands/run/activity.js).
  An action is an instantiated block handler function,
  locked and loaded to process the information in one particular block of a document.
  TextRunner comes with built-in actions for common operations
  in the [actions](src/activity-types) folder.
  The code base using TextRunner can also add their own action types.
  While processing the AST,
  MarkdownFileRunner also builds up a list of [LinkTargets](src/commands/run/link-target.js)
  via a [LinkTargetListBuilder](src/commands/run/link-target-list-builder.js) instance.

2. In the `run` phase, the prepared actions are executed one by one.
  They now have full access to all link targets in all files.
  The actions signal their progress, success, and failures via
  [formatters](src/formatters).
  TextRunner provides two formatters: a simple [dot formatter](src/formatters/dot-formatter.js)
  and a [detailed formatter](src/formatters/detailed-formatter.js),
  which prints more details as it runs.
  When using TextRunner via its JavaScript API,
  you have to provide your own formatter to gain access to the stream of test outcomes.
  If an action signals test failure
  by throwing an exception or returning an error via callback or Promise,
  TextRunner stops the execution, displays the error via the formatter,
  and stops with an exit code of 1.
  Otherwise it stops with an exit code of 0 when it reaches the end of its list of actions to perform.

If the runtime encounters a user error (wrong input data or a failing text-test),
it throws a [UnprintedUserError](src/errors/unprinted-user-error.js),
aborting the test and
signaling that this error has not been printed to the user yet.
This error type is caught by the TextRunner runtime.
If a formatter is available at that time, it prints the error via the formatter
and re-throws it as a [PrintedUserError](src/errors/printed-user-error.js),
signaling that it has been printed yet.
Other error types (TypeErrors, ReferenceErrors, etc)
are considered developer errors and passed through to the caller of TextRunner's JS API.
The CLI wrapper catches all errors and prints them accordingly:
User errors in an end-user friendly way,
and developer errors with a stack trace.
Actions can throw a normal `Error` instance, it will be treated as an `UnprintedUserError`.


## Deployment

```
make deploy
```
