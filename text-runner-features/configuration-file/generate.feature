@cli
Feature: generating a configuration file

  Scenario: setup via CLI
    When running "text-runner setup"
    Then it prints:
      """
      Created configuration file text-runner.jsonc with default values
      """
    And it creates the file "text-runner.jsonc" with content:
      """
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
      """
