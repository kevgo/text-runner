# Installation

TextRunner works on all platforms supported by [Node.JS](https://nodejs.org),
including macOS, Windows, and Linux.
To get started:
- install [Node.JS](https://nodejs.org) version <a textrun="minimumNodeVersion">8</a> or newer
- in the terminal,
  <a textrun="cdIntoEmptyTmpFolder"> cd into the folder in which you want to use TextRunner
  </a>
- create a __package.json__ file, for example by running: <a textrun="runConsoleCommand">
  ```
  npm init -y
  ```
  </a>
- install TextRunner: <a textrun="runConsoleCommand">
  ```
  npm install --dev text-runner
  ```
  </a>
- make sure it works by running: <a textrun="runConsoleCommand">
  ```
  node_modules/.bin/text-run help
  ```
  </a>

This gives you an out-of-the-box installation of TextRunner,
which checks that all links and images point to something.
<a textrun="cdBack">
</a>

<hr>

Read more about:
- [configuring](configuration.md) TextRunner
- using some of the [built-in activity types](built-in-activity-types.md)
- writing your own [user-defined activity types](user-defined-activity-types.md)
