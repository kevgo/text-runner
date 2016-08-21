# Tutorial Runner

[![Build Status](https://travis-ci.org/Originate/tutorial-runner.svg?branch=master)](https://travis-ci.org/Originate/tutorial-runner)
[![CircleCI](https://circleci.com/gh/Originate/tutorial-runner.svg?style=shield&circle-token=9ce35ed1cb30eb92c08211015f019fde2a0973a1)](https://circleci.com/gh/Originate/tutorial-runner)
[![Dependency Status](https://david-dm.org/originate/tutorial-runner.svg)](https://david-dm.org/originate/tutorial-runner)
[![devDependency Status](https://david-dm.org/originate/tutorial-runner/dev-status.svg)](https://david-dm.org/originate/tutorial-runner#info=devDependencies)
[![pnpm](https://img.shields.io/badge/pnpm-compatible-brightgreen.svg)](https://github.com/rstacruz/pnpm)



Runs activities described in Markdown files


## What is it

A command-line tool that runs tutorials written in Markdown programmatically.
This can for example be used to verify that your tutorials work correctly
as part of your test suite.


## How it works

Tutorial Runner recognizes invisible tags in your markdown
that describe what action you want to take.
These tags have the format:

```html
<a class="tutorialRunner_<activity name>">
  ...
</a>
```

The actions are configured via the content of your document,
so you are actually executing what the document says.


## Installation

- install [Node.JS](https://nodejs.org) version 4, 5, or 6
- run `npm i -g tutorial-runner`
- in the root directory of your code base, run `tut-run setup`


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


## Built-in Block Types


### create a file with name and content
* assign the `tutorialRunner_createFile` class to the anchor tag
* the name of the file is provided as bold text within the anchor tag
* the content of the file is provided as a multi-line code block within the anchor tag

```markdown
<a class="tutorialRunner_createFileWithContent">

__test.txt__

```txt
The file content goes here
`​``
</a>
```


### run a command on the console and wait until it ends

```markdown
<a class="tutorialRunner_consoleCommand">

`​``
$ ls -a
`​``
</a>
```


### a command, enter text, and wait until it ends

```markdown
<a class="tutorialRunner_consoleCommandWithInput">

```bash
$ ls -a
`​``
</a>
```


### run a bash script and wait until it outputs a certain string

```markdown
<a class="tutorialRunner_consoleCommandWaitForOutput">

`​``
$ ls -a
`​``

and wait until we see:

`​``
3 files
`​``

</a>
```


### stop the currenly running Bash script

```markdown
<a class="tutorialRunner_stopCurrentProcess">
Stop the current process by hitting Ctrl-C

</a>
```


## Create your own actions

Let's create our own "hello world" action.
It will be triggered via this piece of Markdown:

```markdown
<a class="tutorialRunner_helloWorld">
</a>
```

The handler for it lives in the file:

__tut-run/hello-world-action.js__

```javascript
module.exports = ({formatter}, done) => {
  formatter.startActivity('greeting the world')
  console.log('Hello World!')
  formatter.activitySuccess()
  done()
}
```

The formatter displays test progress on the console as the test runs.

[[animated gif here]]

Call `formatter.startActivity(<activity name>)` before you run an activity.
This prints the given activity as _currently running_ (in yellow)
and prepares the formatter to dump console output below it.
When the test succeeds, call `formatter.activitySuccess()`
to print this activity in green,
and remove its console output.
If it fails, call `formatter.error()` to print it in red,
with output below it.

Note: You can write the handler in any language that transpile to JavaScript,
like for example [CoffeeScript](), [LiveScript](), or [BabelJS]().

See [here](examples/custom-action) for the full working example.


### Using the searcher helper

More realistic tests for your Markdown tutorial
will need to access content from it
in order to test it.
The `nodes` parameter provides the DOM nodes within the active block,
including their type, content, and line number.
You can access this data directly,
or use the `searcher` helper that is provided to you as a parameter as well.
Here is a simple version of the built-in `console-command` action.
It runs a command given as a code block on the console.

````markdown
<a class="tutorialRunner_consoleCommand">
`` `
ls -la
`` `
</a>
````

Here is the action, implemented using the `searcher` helper.

__tut-run/console-command.js__

```javascript
module.exports = ({formatter, searcher}) => {
  formatter.startActivity(`running console command`)

  const commandToRun = searcher.nodeContent({type: 'fence'}, ({content, nodes}) => {
    if (nodes.length === 0) return 'this active tag must contain a code block with the command to run'
    if (!content) return 'you provided a code block but it has no content'
  })

  formatter.refineActivity(`running console command: ${commandToRun}`)
  child_process.execSync(commandToRun)
  formatter.activitySuccess()
}
```

The `searcher.nodeContent` method returns the content of the DOM node
that satisfies the given query.
The second parameter is an optional validation method.
Its purpose is to make it easy to provide more specific error messages
that make your custom step more user-friendly.
It receives the determined node content, as well as a list of nodes that match the given query.
Falsy return values mean the validation has passed,
strings returned by it get printed to the user.
The `formatter.refineActivity` method allows to tell the formatter
more details about the currently running activity as they become known.
This helps produce better error messages for users of this activity.


## Related Work

* [markdown-doctest](https://github.com/Widdershin/markdown-doctest):
  runs all the code in your markdown, but only checks that it doesn't throw errors

* [tests-ex-markdown](https://github.com/anko/tests-ex-markdown):
  test runner that runs code blocks embedded in MarkDown

* [mocha.md](https://github.com/sidorares/mocha.md)

* [doctest.py](https://docs.python.org/2/library/doctest.html#simple-usage-checking-examples-in-a-text-file)

* [mockdown](https://github.com/pjeby/mockdown)
