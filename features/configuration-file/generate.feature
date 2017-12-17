Feature: generating a configuration file

  When setting up TextRunner on a new project
  I want to be able to generate a configuration file with the default options set
  So that I can run the tool successfully after customizing the options to my project's situation.

  - call "text-run setup" to generate a configuration file


  @clionly
  Scenario: running in a directory without configuration file
    When running "text-run setup"
    Then it prints:
      """
      Create configuration file text-run.yml with default values
      """
    And it creates the file "text-run.yml" with content:
      """
      # white-list for files to test
      files: '**/*.md'

      # the formatter to use
      format: robust

      # prefix that makes anchor tags active regions
      classPrefix: 'tr_'

      # whether to run the tests in an external temp directory,
      # uses ./tmp if false,
      # you can also provide a custom directory path here
      useTempDirectory: false

      # action-specific configuration
      actions:
        runConsoleCommand:
          globals: {}
      """
