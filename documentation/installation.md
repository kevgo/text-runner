# Installation

TextRunner works on all platforms supported by [Node.JS](https://nodejs.org),
including macOS, Windows, and Linux.
To get started:
- install [Node.JS](https://nodejs.org) version <a class="tr_minimumNodeVersion">8</a> or newer
- in the terminal,
  <!-- TODO <a class="tr_cdIntoInstallExample"> -->cd into the folder in which you want to use TextRunner<!-- </a> -->
- create a __package.json__ file, for example by running: <a class="tr_runConsoleCommand">
  ```
  npm init -y
  ```
  </a>
- install TextRunner: <a class="tr_verifyNpmInstall"><a class="tr_runConsoleCommand">
  ```
  npm install --dev text-runner
  ```
  </a></a>
- make sure it works by running: <a class="tr_verifyNpmGlobalCommand">
  ```
  text-run
  ```
  </a>

This gives you an out-of-the-box installation of TextRunner,
which checks that all links and images point to something.

<hr>

Read more about:
- [configuring](configuration.md) TextRunner
- using some of the [built-in actions](built-in-actions.md)
- writing your own [user-defined actions](user-defined-actions.md)
