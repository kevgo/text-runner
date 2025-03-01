# Installation

TextRunner works on all platforms supported by [Node.JS](https://nodejs.org),
including macOS, Windows, and Linux. To get started:

- install [Node.JS](https://nodejs.org) version 16 or newer
- in the terminal, cd into the folder in which you want to use TextRunner
- make sure you have a file <a type="workspace/new-file"> **package.json** with
  at least these entries:

  ```json
  {
    "type": "module",
    "devDependencies": {
      "text-runner": "7.0.0",
      "tsx": "4.19.3"
    }
  }
  ```

  </a>

- install TextRunner:

  <pre type="shell/command">
  npm install -D text-runner tsx
  </pre>

- make sure it works by running:

  <pre type="shell/command">
  text-runner help
  </pre>

This gives you an out-of-the-box installation of TextRunner, which checks that
all links and images point to something.

## Configuration

You can configure TextRunner via command-line options or a configuration file.

### Creating a configuration file

To scaffold a config file, open a terminal, go to the folder where you want to
configure TextRunner, and run:

<pre type="shell/command">
$ text-runner setup
</pre>

This creates a configuration file called <a type="workspace/existing-file">
**text-runner.jsonc** that looks like this:

```jsonc
{
  // link to the JSON schema that defines this document
  "$schema": "https://raw.githubusercontent.com/kevgo/text-runner/refs/heads/main/documentation/text-runner.schema.json",

  // white-list for files to test
  // This is a glob expression, see https://github.com/isaacs/node-glob#glob-primer
  // The folder "node_modules" is already excluded.
  // To exclude the "vendor" folder: '{,!(vendor)/**/}*.md'
  "files": "**/*.md",

  // black-list of files not to test
  // applied after the white-list above.
  "exclude": [],

  // the formatter to use (detailed, dot, progress, summary)
  "format": "detailed",

  // regex patterns for link targets to ignore
  "ignoreLinkTargets": [],

  // Define which folders of your Markdown source get compiled to HTML
  // and published under a different URL path.
  //
  // In this example, the public URL "/blog/foo"
  // would be hosted as "post/foo.md":
  // publications:
  //   - localPath: /posts/
  //     publicPath: /blog
  //     publicExtension: ''

  // Name of the default filename in folders.
  // If you set this, and a link points to a folder,
  // Text-Runner assumes the link points to the default file in that folder.
  // defaultFile: index.md

  // prefix that makes anchor tags active regions
  "regionMarker": "type",

  // whether to display/emit skipped activities
  "showSkipped": false,

  // whether to run the tests in an external temp directory,
  // uses ./tmp if false,
  // you can also provide a custom directory path here
  "systemTmp": false,

  // whether to verify online files/links (warning: this makes tests flaky)
  "online": false,

  // whether to delete all files in the workspace folder before running the tests
  "emptyWorkspace": true
}
```

</a>

### Using a custom configuration file

By default Text-Runner uses a file `text-runner.jsonc` as the configuration
file. You can tell it to use another configuration file with the `--config`
command-line switch:

```
$ text-runner --config=my-config.jsonc
```

<hr>

Read more about:

- the [built-in actions](built-in-actions.md)
- writing your own [user-defined actions](user-defined-actions.md)
- [installing](installation.md) TextRunner
<hr>

Read more about:

- using some of the [built-in actions](built-in-actions.md)
- writing your own [user-defined actions](user-defined-actions.md)
