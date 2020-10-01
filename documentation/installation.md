# Installation

TextRunner works on all platforms supported by [Node.JS](https://nodejs.org),
including macOS, Windows, and Linux. To get started:

- install [Node.JS](https://nodejs.org) version 12 or newer
- in the terminal, cd into the folder in which you want to use TextRunner
- if it doesn't exist, create a **package.json** file, for example by running:

  ```
  npm init -y
  ```

- install TextRunner:

  <pre type="npm/install" dir="../text-runner-cli">
  npm install --dev text-runner
  </pre>

- make sure it works by running:

  <pre type="shell/command">
  text-run help
  </pre>

This gives you an out-of-the-box installation of TextRunner, which checks that
all links and images point to something.

<hr>

Read more about:

- [configuring](configuration.md) TextRunner
- using some of the [built-in actions](built-in-actions.md)
- writing your own [user-defined actions](user-defined-actions.md)
