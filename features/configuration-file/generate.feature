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

      # the formatter to use
      format: detailed

      # prefix that makes anchor tags active regions
      classPrefix: 'textrun'

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
