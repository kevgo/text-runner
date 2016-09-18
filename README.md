# Tutorial Runner

[![Build Status](https://travis-ci.org/Originate/tutorial-runner.svg?branch=master)](https://travis-ci.org/Originate/tutorial-runner)
[![CircleCI](https://circleci.com/gh/Originate/tutorial-runner.svg?style=shield&circle-token=9ce35ed1cb30eb92c08211015f019fde2a0973a1)](https://circleci.com/gh/Originate/tutorial-runner)
[![Dependency Status](https://david-dm.org/originate/tutorial-runner.svg)](https://david-dm.org/originate/tutorial-runner)
[![devDependency Status](https://david-dm.org/originate/tutorial-runner/dev-status.svg)](https://david-dm.org/originate/tutorial-runner#info=devDependencies)
[![pnpm](https://img.shields.io/badge/pnpm-compatible-brightgreen.svg)](https://github.com/rstacruz/pnpm)


_Test framework for documentation_


## What is it

Tutorial Runner is a command-line tool that executes activities described in Markdown (and soon HTML) files programmatically.
An example is the document you are reading right now,
which is verified for correctness by Tutorial Runner.


## Why you need it

* __[readme-driven development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html):__
  Before coding functionality, describe it via a readme or tutorial and get early feedback on your ideas.
  Tutorial Runner makes this documentation actionable, a part of your test suite,
  and thereby a driver for your [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) cycle.

* __evergreen tutorials:__
  Broken tutorials suck.
  Tutorial Runner enforces that they always work,
  every time you change anything in either your product or its documentation.

* __change management and [semantic versioning](http://semver.org):__
  Tutorial Runner tells you whether a pull request changes documented behavior of your solution.
  Knowing that before shipping the change allows you to either implement it in a more backwards-compatible way
  or update the documentation and announce the breaking change to your users.


## How it works

Tutorial Runner recognizes invisible tags in your markdown,
which mark parts of the text as actionable.
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

To make this part of the documentation actionable/testable, surround it with an `<a>` tag:

<a class="tutorialRunner_runMarkdownInTutrun">

```
## Creating a configuration file

<a class="tutorialRunner_createFile">
Please create a file with the name __config.yml__ and the content:
`​``
foo: bar
`​``
</a>
```

</a>

When running this Markdown file via `tut-run`,
everything inside `<a>` tags with the class `tutorialRunner_*` is executed by Tutorial Runner.
The class also defines the action that this block describes.
In this example it is `createFile`,
meaning Tutorial Runner is supposed to create a file on your machine.
It takes the filename out of the bold section (the part surrounded with "\_\_"),
and the content out of the fenced code block (the part surrounded with _\`\`\`_),
and creates the file on your hard drive.


## Built-in Actions

Tutorial Runner provides a number of built-in actions
for things typically done in tutorials.


### create a file with name and content
* the name of the file is provided as bold text within the anchor tag
* the content of the file is provided as a multi-line code block within the anchor tag
* Tutorial Runner creates the file in a `tmp` directory in the current working directory

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

There are many other good testing tools out there.
They can either be combined with Tutorial Runner
or could be viable alternatives to it, depending on your use case:

* [Cucumber](https://cucumber.io):
  Runs tests via a specialized DSL that is optimized for describing features
  via user stories, acceptance criteria, and example scenarias.
  Tutorial Runner and Cucumber complement each other,
  i.e. you would use Tutorial Runner for the end-user facing documentation on your web site
  and Cucumber for agile, collaborative, behavior-driven day-to-day development,
  driven by Tutorial Runner.

* [Gauge](http://getgauge.io):
  a "Cucumber for Markdown".
  With Tutorial Runner there are no restrictions on how the Markdown has to look like;
  it can be 100% human-friendly prose.

* [doctest](https://docs.python.org/3/library/doctest.html):
  executes only actual code blocks in your documentation,
  and verifies only that it runs without errors.
  Tutorial Runner can run anything that can be described textually,
  and verify it in arbitrary ways.

* [mockdown](https://github.com/pjeby/mockdown):
  like doctest, with verification of the output.
