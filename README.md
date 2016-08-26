# Tutorial Runner

[![Build Status](https://travis-ci.org/Originate/tutorial-runner.svg?branch=master)](https://travis-ci.org/Originate/tutorial-runner)
[![CircleCI](https://circleci.com/gh/Originate/tutorial-runner.svg?style=shield&circle-token=9ce35ed1cb30eb92c08211015f019fde2a0973a1)](https://circleci.com/gh/Originate/tutorial-runner)
[![Dependency Status](https://david-dm.org/originate/tutorial-runner.svg)](https://david-dm.org/originate/tutorial-runner)
[![devDependency Status](https://david-dm.org/originate/tutorial-runner/dev-status.svg)](https://david-dm.org/originate/tutorial-runner#info=devDependencies)
[![pnpm](https://img.shields.io/badge/pnpm-compatible-brightgreen.svg)](https://github.com/rstacruz/pnpm)


_Runs the activities described in tutorials programmatically._


## What is it

A command-line tool that runs tutorials written in Markdown programmatically.
This can for example be used to verify that your tutorials work correctly
as part of your test suite.
An example is this readme file here,
which is verified for correctness by Tutorial Runner.


## How it works

Tutorial Runner recognizes invisible tags in your markdown
that mark parts of the text as actionable.
Let's say a tutorial tells the reader to create a file `config.yml`
with the content `foo: bar`.
The markdown code of this tutorial might look like this:

```
## Creating a configuration file

Please create a file with the name __config.yml__ and the content:
`​``
foo: bar
`​``
```

To make this part actionable, we surround it with an anchor tag:

<a class="tutorialRunner_runMarkdownInTutrun">

```
## Creating a configuration file

<a class="tutorialRunner_createFile">
Please create a configuration file with the name __config.yml__ and the content:
`​``
foo: bar
`​``
</a>
```

</a>

When running this Markdown file,
Tutorial Runner will understand that it is supposed to create a file on your machine,
and will do exactly that!
It takes the filename out of the bold section (the part surrounded with "\_\_"),
and the content out of the fenced code block (the part surrounded with _\`\`\`_).


## Built-in Actions

Tutorial Runner provides a number of built-in block types
for things typically done in tutorials.


### create a file with name and content
* the name of the file is provided as bold text within the anchor tag
* the content of the file is provided as a multi-line code block within the anchor tag

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_createFile">

__test.txt__

`​``txt
The file content goes here
`​``
</a>
```
</a>


### run a command on the console

- runs the command given in the code block
- continues the tutorial when the command is finished running

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_consoleCommand">
`​``
$ ls -a
`​``
</a>
```
</a>


<!-- ### a command, enter text, and wait until it ends -->
<!--  -->
<!-- <a class="tutorialRunner_runMarkdownInTutrun"> -->
<!-- ```markdown -->
<!-- <a class="tutorialRunner_consoleCommandWithInput"> -->
<!--  -->
<!-- ```bash -->
<!-- $ ls -a -->
<!-- `​`` -->
<!-- </a> -->
<!-- ``` -->
<!-- </a> -->


<!-- ### run a bash script and wait until it outputs a certain string -->
<!--  -->
<!-- <a class="tutorialRunner_runMarkdownInTutrun"> -->
<!-- ```markdown -->
<!-- <a class="tutorialRunner_consoleCommandWaitForOutput"> -->
<!--  -->
<!-- `​`` -->
<!-- $ echo 'hello world' -->
<!-- `​`` -->
<!--  -->
<!-- and wait until we see: -->
<!--  -->
<!-- `​`` -->
<!-- world -->
<!-- `​`` -->
<!--  -->
<!-- </a> -->
<!-- ``` -->
<!-- </a> -->


<!-- ### stop the currenly running Bash script -->
<!--  -->
<!-- ```markdown -->
<!-- <a class="tutorialRunner_stopCurrentProcess"> -->
<!-- Stop the current process by hitting Ctrl-C -->
<!--  -->
<!-- </a> -->
<!-- ``` -->


## Custom actions

Let's create our own "hello world" action.
It will be triggered via this piece of Markdown:

<a class="tutorialRunner_createMarkdownFile">
```markdown
<a class="tutorialRunner_helloWorld">
</a>
```
</a>

The handler for it lives in the file:

<a class="tutorialRunner_createFile">
__tut-run/hello-world-action.js__

```javascript
module.exports = function(env) {
  formatter = env.formatter

  formatter.start('greeting the world')
  formatter.output('Hello World!')
  formatter.success()
}
```
</a>

<a class="tutorialRunner_runMarkdownFile">
The formatter displays test progress on the console as the test runs.
</a>

[[animated gif here]]

Call `formatter.start(<activity name>)` before you run an activity.
This prints the given activity as _currently running_ (in yellow)
and prepares the formatter to dump console output below it.
When the test succeeds, call `formatter.success()`
to print this activity in green
and remove its console output.
If it fails, call `formatter.error()` to print it in red,
with output below it.
`formatter.output()` allows to print output of the currently running action
on the console. This output is removed when the action succeeds.
Please don't use `console.log` to avoid interfering with the formatter's UI management.

The handler method can accept a callback in the second parameter
in order to perform asynchronous operations.
See [here](examples/custom-action-sync) for a synchronous working example,
and [here](examples/custom-action-async) for the asynchronous version.
You can write the handler in any language that transpile to JavaScript,
like for example [CoffeeScript](http://coffeescript.org),
[LiveScript](http://livescript.net),
or [BabelJS](https://babeljs.io).


### Using the searcher helper

More realistic tests for your Markdown tutorial
will need to access document content
in order to use it in tests.
The `nodes` parameter provides the DOM nodes within the active block,
including their type, content, and line number.
You can access this data directly,
or use the `searcher` helper that is provided to you as a parameter as well.
To demonstrate how this works,
here is a simplified implementation of the built-in `console-command` action.
It runs the command given in the code block in the terminal.

<a class="tutorialRunner_createMarkdownFile">
```
<a class="tutorialRunner_consoleCommand">
`​``
ls -la
`​``
</a>
```
</a>

Here is the action, implemented using the `searcher` helper.

<a class="tutorialRunner_createFile">
__tut-run/console-command.js__
```javascript
child_process = require('child_process')

module.exports = function(env) {
  var formatter = env.formatter
  var getNode = env.searcher.nodeContent
  // you can also read env.nodes directly here also if you want

  formatter.start('running console command')

  var commandToRun = getNode({type: 'fence'}, function(match) {
    if (match.nodes.length === 0) return 'this active tag must contain a code block with the command to run'
    if (match.nodes.length > 1) return 'please provide only one code block'
    if (!match.content) return 'you provided a code block but it has no content'
  })

  formatter.refine('running console command: ' + commandToRun)
  formatter.output(child_process.execSync(commandToRun))
  formatter.success()
}
```
</a>

<a class="tutorialRunner_runMarkdownFile">
</a>

- The `searcher.nodeContent` method returns the content of the DOM node
that satisfies the given query.
The second parameter is an optional validation method.
Its purpose is to make it easy to provide specific error messages
that make your custom step user-friendly and easy to debug.
It receives the content of the determined node,
as well as a list of all the nodes that match the given query.
Strings returned by this method get printed as errors to the user and cause the test to fail,
falsy return values indicated the validation has passed,
- The `formatter.refine` method allows to tell the formatter
more details about the currently running activity as they become known.
This helps produce better terminal output.


## Installation

- install [Node.JS](https://nodejs.org) version 4, 5, or 6
- run `npm i -g tutorial-runner`
- in the root directory of your code base, run `tut-run`


## Configuration

You can configure Tutorial Runner via a configuration file.
Here is one showing the default values used:

__tut-run.yml__

```yml
files: '**/*.md'
```


## Related Work

* [markdown-doctest](https://github.com/Widdershin/markdown-doctest):
  runs all the code in your markdown, but only actual code in fenced blocks

* [tests-ex-markdown](https://github.com/anko/tests-ex-markdown):
  test runner that runs code blocks embedded in MarkDown

* [mocha.md](https://github.com/sidorares/mocha.md)

* [doctest.py](https://docs.python.org/2/library/doctest.html#simple-usage-checking-examples-in-a-text-file)

* [mockdown](https://github.com/pjeby/mockdown)
