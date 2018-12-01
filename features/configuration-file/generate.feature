Feature: generating a configuration file

  When setting up TextRunner on a new project
  I want to be able to generate a configuration file with the default options set
  So that I can run the tool successfully after customizing the options to my project's situation.

  - call "text-run setup" to generate a configuration file


  Scenario: running in a directory without configuration file
    When running "text-run setup"
    Then it prints:
      """
      Created configuration file text-run.yml with default values
      """
    And it creates the file "text-run.yml" with content:
      """
      # white-list for files to test
      # This is a glob expression, see https://github.com/isaacs/node-glob#glob-primer
      # The folder "node_modules" is already excluded.
      # To exclude the "vendor" folder: '{,!(vendor)/**/}*.md'
      files: '**/*.md'

      # black-list of files not to test
      # This is applied after the white-list above.
      exclude: ''

      # the formatter to use (detailed, dot)
      format: detailed

      # Define which folders of your Markdown source get compiled to HTML
      # and published under a different URL path.
      #
      # In this example, the public URL "/blog/foo"
      # is hosted as "post/foo.md":
      # publications:
      #   - localPath: /posts/
      #     publicPath: /blog
      #     publicExtension: ''

      # Name of the default filename in folders.
      # If this setting is given, and a link points to a folder,
      # the link is assumed to point to the default file in that folder.
      # defaultFile: index.md

      # prefix that makes anchor tags active regions
      classPrefix: textrun

      # whether to run the tests in an external temp directory,
      # uses ./tmp if false,
      # you can also provide a custom directory path here
      useSystemTempDirectory: false

      # whether to skip tests that require an online connection
      offline: false

      # activity-type specific configuration
      activityTypes:
        runConsoleCommand:
          globals: {}
      """
