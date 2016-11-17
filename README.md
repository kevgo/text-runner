# Tutorial Runner

[![Build Status](https://travis-ci.org/Originate/tutorial-runner.svg?branch=master)](https://travis-ci.org/Originate/tutorial-runner)
[![CircleCI](https://circleci.com/gh/Originate/tutorial-runner.svg?style=shield&circle-token=9ce35ed1cb30eb92c08211015f019fde2a0973a1)](https://circleci.com/gh/Originate/tutorial-runner)
[![Dependency Status](https://david-dm.org/originate/tutorial-runner.svg)](https://david-dm.org/originate/tutorial-runner)
[![devDependency Status](https://david-dm.org/originate/tutorial-runner/dev-status.svg)](https://david-dm.org/originate/tutorial-runner#info=devDependencies)
[![pnpm](https://img.shields.io/badge/pnpm-compatible-brightgreen.svg)](https://github.com/rstacruz/pnpm)


_Test framework for documentation_


## What is it

Tutorial Runner is a command-line tool
that executes documentation written in Markdown (and soon HTML) programmatically,
similar to how a human reader would execute it if they were reading and following it.
What sets Tutorial Runner apart from [related technologies](#related-work)
is that there are absolutely no limitations on how the documents it runs look like.
Tutorial Runner can execute human-friendly prose, tables, or bullet point lists,
in any human language.
An example is the document you are reading right now,
which is verified for correctness by Tutorial Runner.


## Why you need it

* __evergreen tutorials:__
  Broken tutorials suck.
  Tutorial Runner enforces that your tutorials always work,
  every time you change anything in either the described product or its documentation.

* __change management and [semantic versioning](http://semver.org):__
  Tutorial Runner tells you whether a change breaks documented behavior.
  Knowing this before shipping the respective change allows you to either
  implement it in a more backwards-compatible way or
  update the documentation and announce the breaking change to your users.

* __[readme-driven development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html):__
  Before spending time and budget building or even prototyping functionality,
  describe it via a readme file or tutorial
  and get early feedback on your ideas from potential users.
  Tutorial Runner makes this end-user facing documentation executable,
  and for example run it as part of your test suite.
  This allows adding end-user documentation as the outer-most layer
  to your [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) cycle:
  1. documentation via Tutorial Runner for smoke testing of the full stack
  2. feature specs (for example via [Cucumber]()) for detailed black-box testing of each feature in isolation
  3. unit tests for white-box testing of individual code components


## How it works

To make a part of a Markdown file actionable by Tutorial Runner,
wrap it in `<a>` tags with class `tutorialRunner_*`.
As an example,
let's say a tutorial tells the reader to create a file `config.yml`
with the content `foo: bar`.
The markdown code of this tutorial might look something like this:

```
## Creating a configuration file

Please create a file with the name __config.yml__ and the content:
`​``
foo: bar
`​``
```

To make this part of the documentation executable,
surround it with an `<a>` tag that specifies that we want to create a file:

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

The class `createFile` tells TutorialRunner that this block is supposed to create a file.
It takes the filename and content to create from the text inside this block
(not metadata, but the same text the user sees),
and creates the file in the working directory
(by default `tmp` in the current directory).
Text outside of `<a>` tags is ignored.

You execute TutorialRunner by by calling `tut-run` on the command line.


## Built-in Actions

Tutorial Runner provides a number of built-in actions
for activities typically performed in software programming tutorials.


### create a file with name and content

* the name of the file is provided as bold text within the anchor tag
* the content of the file is provided as a multi-line code block (surrounded with \`\`\`) within the anchor tag
* Tutorial Runner creates the file in the workspace

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

- runs the command given in the code block in the workspace
- waits for the command to finish before continuing the tutorial
- a `$` at the beginning of the line is ignored
- you can [configure](#configuration) global binaries that you your code base exports
  so that your tutorial can call them directly

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_runCommand">
`​``
$ ls -a
`​``
</a>
```
</a>

You can enter text into the running command by providing an HTML table
with the content to enter:

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_runCommand">
`​``
$ read name
$ read purpose
`​``
<table>
  <tr>
    <td>Tutorial Runner</td>
  </tr>
  <tr>
    <td>Test framework for documentation</td>
  </tr>
</table>

</a>
```
</a>

If the table contains multiple columns,
the first column contains output to wait for for,
and the last one text to enter once the output from the first column has appeared.
Middle columns are ignored.
`<th>` elements are considered descriptions and are also ignored.

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_runCommand">
`​``
$ echo "Product name:"
$ read name
$ echo "What does it do:"
$ read purpose
`​``
<table>
  <tr>
    <th>question</th>
    <th>description</th>
    <th>you enter</th>
  </tr>
  <tr>
    <td>Product name</td>
    <td>the name of the product</td>
    <td>Tutorial Runner</td>
  </tr>
  <tr>
    <td>What does it do</td>
    <td>product tagline</td>
    <td>Test framework for documentation</td>
  </tr>
</table>

</a>
```
</a>

This code waits until the called program prints "Product name",
and enters "Tutorial Runner&lt;enter&gt;".
Then it waits for "What does it do"
and enters "Test framework for documentation&lt;enter&gt;".


### long-running processes

To start a long-running process, use the `startCommand` action.
The test script continues while the started process keeps running in the background.
This can be used to start servers and then interact with them later.

You can wait until the process prints a given string with a `waitForOutput` block,
and stop the long-running process using a `stopCommand` block.

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_startCommand">

`​``
$ node ../../examples/long-running/server.js
`​``
</a>

<a class="tutorialRunner_waitForOutput">
wait until you see
`​``
running at port 4000
`​``
</a>

... interact with the server here ...

<a class="tutorialRunner_stopCommand">
Stop the current process by hitting Ctrl-C
</a>
```
</a>


### running JavaScript code

To run JavaScript code:

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_runJavascript">
`​``
console.log('This is getting executed by TutorialRunner!')
`​``
</a>
```
</a>


### verify that a linked directory exists

You can verify that folders in your repo that your documentation references
exist using the `verifyLinkedDirectoryExists` action:


<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_verifyLinkedDirectoryExists">
Check out the [examples](examples) directory to see this in action.
</a>
```
</a>


### changing the current working directory

Tutorial Runner runs by default in the `tmp` directory.
To change it, use the `cd` action.
It changes into the directory that the link in its block points to.
The directory path should be a link
because your documentation wants to point to it.

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_cd">
Let's change into the [foo](.) directory to see what's in there.
</a>
```
</a>



## Custom actions

Let's create a custom block.
All it does is print "hello world" when running.
It will be triggered via this piece of Markdown:

<a class="tutorialRunner_createMarkdownFile">
```markdown
<a class="tutorialRunner_helloWorld">
</a>
```
</a>

The definition for this block lives in the file:

<a class="tutorialRunner_createFile">
__tut-run/hello-world-action.js__

```javascript
module.exports = function(env) {
  formatter = env.formatter

  formatter.start('greeting the world')
  formatter.output('Hello world!')
  formatter.success()
}
```
</a>

<a class="tutorialRunner_runMarkdownFile">
The formatter displays test progress on the console as the test runs.
</a>

[[animated gif here]]

Definitions of custom blocks live in the directory `tut-run`.
Each block lives in its own file, whose name is the block name in kebab-case.
The file must export a function that executes the block.
It is given a hash of named arguments.

One of the named arguments is `formatter`,
it provides an object that allows to print test output to the console.
Call `formatter.start(<activity name>)` before you run an activity.
This prints the given activity as _currently running_ (using a yellow pointer)
and prepares the formatter to dump console output below it.
`formatter.output(text)` allows to print output of the currently running action
on the console. This output is removed when the action succeeds.
When the test succeeds, call `formatter.success()`
to print this activity using a green checkmark
and remove all of its console output.
If it fails, call `formatter.error()` with the error message.
Please don't use `console.log` to avoid interfering with the formatter's UI management.
If you cannot avoid this, use a simpler and more robust formatter via the `--format=simple` parameter to `tut-run`.

The handler method can accept a callback in the second parameter
in order to perform asynchronous operations.
See [here](examples/custom-action-sync) for a synchronous working example,
and [here](examples/custom-action-async) for the asynchronous version.
You can write the handler in any language that transpiles to JavaScript,
for example [CoffeeScript](http://coffeescript.org),
[LiveScript](http://livescript.net),
or [BabelJS](https://babeljs.io).


### Using the searcher helper

More realistic tests for your Markdown tutorial
will need to access document content
in order to use it in tests.
The DOM nodes of the active block
- including their type, content, and line number -
are provided to your handler function
via the the `nodes` field of the first argument.
You can access this data directly
or use a helper that is provided to you via the `searcher` field of the first parameter.
To demonstrate how this works,
here is a simplified implementation of the built-in `console-command` action.
It runs the command given in the code block in the terminal.

<a class="tutorialRunner_createMarkdownFile">
```
<a class="tutorialRunner_runCommand">
`​``
ls -la
`​``
</a>
```
</a>

Here is the block definition implemented using the `searcher` helper.

<a class="tutorialRunner_createFile">
__tut-run/console-command.js__
```javascript
child_process = require('child_process')

module.exports = function(env) {
  var formatter = env.formatter
  var getNode = env.searcher.nodeContent
  // you can also work with env.nodes directly here if you want

  formatter.start('running console command')

  var commandToRun = getNode({type: 'fence'}, function(match) {
    if (match.nodes.length === 0) return 'this active tag must contain a code block with the command to run'
    if (match.nodes.length > 1) return 'please provide only one code block'
    if (!match.content) return 'you provided a code block but it has no content'
  })

  formatter.refine('running console command: ' + commandToRun)
  formatter.output(child_process.execSync(commandToRun, 'utf8'))
  formatter.success()
}
```
</a>

<a class="tutorialRunner_runMarkdownFile">
</a>

- The `searcher.nodeContent` method returns the content of the DOM node
that satisfies the given query.
In this case we are looking for a fenced code block,
hence the query is `{type: 'fence'}`.
The second parameter is an optional validation method.
Its purpose is to make it easy and readable to provide specific error messages
that make your custom block definition user-friendly and easy to debug.
Its parameter is an object containing the content of the determined node
as well as an array of all the nodes that match the given query.
Strings returned by this method get printed as errors to the user and cause the test to fail,
falsy return values indicate that the validation has passed,
- The `formatter.refine` method allows to tell the formatter
more details about the currently running activity as they become known.
This helps produce better terminal output.


## Formatters

Tutorial Runner supports a variety of formatters:

* __iconic formatter:__
  the most modern formatter.
  Indicates test status using pretty icons.
  Shows test output only when steps run,
  and cleans it out when done to show a clean summary of the test.
  This is the default formatter.

* __colored formatter:__
  Indicades test status using colored test names.
  Shows test output only when steps run,
  and cleans it out when done to show a clean summary of the test.

* __robust formatter:__
  The most robust formatter, similar to the one [Cucumber]() uses.
  Shows test output before the steps.
  Use this formatter if the other ones don't work for you.

The `robust` formatter is best for development,
the `colored` or `iconic` formatters
produce more concise output when running as part of a larger test suite.


## Installation

- install [Node.JS](https://nodejs.org) version 4, 5, or 6
- run `npm i -g tutorial-runner`
- in the root directory of your code base, run `tut-run`


## Configuration

You can configure Tutorial Runner via a configuration file.
To create one, run:

<a class="tutorialRunner_runCommand">
```
$ tut-run setup
```
</a>

The created configuration looks like this:

<a class="tutorialRunner_verifyFileContent">
__tut-run.yml__

```yml
files: '**/*.md'
globals: []
formatter: iconic
```
</a>

- the `files` key describes which files are executed by Tutorial Runner.

- the `globals` key describes which binaries are available as global commands
  once your code base is installed.
  For example, when your tool installs a global command `tool`,
  which when executed runs `bin/tool` in your code base,
  your `tut-run.yml` file would contain this section:

  ```yml
  globals:
    tool: './bin/tool'
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
