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

__create a file with name and content__
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

__run a command on the console and wait until it ends__

```markdown
<a class="tutorialRunner_consoleCommand">

`​``
$ ls -a
`​``
</a>
```

__a command, enter text, and wait until it ends__

```markdown
<a class="tutorialRunner_consoleCommandWithInput">

```bash
$ ls -a
`​``
</a>
```

__run a bash script and wait until it outputs a certain string__

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

__stop the currenly running Bash script__

```markdown
<a class="tutorialRunner_stopCurrentProcess">
Stop the current process by hitting Ctrl-C

</a>
```

## Installation

- install [Node.JS](https://nodejs.org) version 4, 5, or 6
- run `npm i -g tutorial-runner`
- in the root directory of your code base, run `tut-run setup`


## Related Work

* [markdown-doctest](https://github.com/Widdershin/markdown-doctest):
  runs all the code in your markdown, but only checks that it doesn't throw errors

* [tests-ex-markdown](https://github.com/anko/tests-ex-markdown):
  test runner that runs code blocks embedded in MarkDown

* [mocha.md](https://github.com/sidorares/mocha.md)

* [doctest.py](https://docs.python.org/2/library/doctest.html#simple-usage-checking-examples-in-a-text-file)

* [mockdown](https://github.com/pjeby/mockdown)
