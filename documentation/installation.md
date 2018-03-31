# Installation

TextRunner works on all platforms supported by [Node.JS](https://nodejs.org),
including macOS, Windows, and Linux.
To get started:
- install [Node.JS](https://nodejs.org) version 8 or newer
- in the terminal,
  <a textrun="cd-into-empty-tmp-folder"> cd into the folder in which you want to use TextRunner
  </a>
- create a __package.json__ file, for example by running: <a textrun="run-consoleCommand">
  ```
  npm init -y
  ```
  </a>
- install TextRunner: <a textrun="run-console-command">
  ```
  npm install --dev text-runner
  ```
  </a>
- make sure it works by running: <a textrun="run-console-command">
  ```
  node_modules/.bin/text-run help
  ```
  </a>

This gives you an out-of-the-box installation of TextRunner,
which checks that all links and images point to something.
<a textrun="cd-back">
</a>

<hr>

Read more about:
- [configuring](configuration.md) TextRunner
- using some of the [built-in activity types](built-in-activity-types)
- writing your own [user-defined activity types](user-defined-activity-types.md)
