Feature: finding files in certain directories only

  As a Tutorial Runner user
  I want to be able to specify in which directories it should look for Markdown files
  So that it doesn't run in directories that I don't want to test right now.

  - the config file can contain a key "files" that specifies a glob expression to be used
  - you can also provide a glob expression on the command line
  - the command-line overrides the config file


  Scenario: the config file specifies a custom glob expression
    Given the configuration file:
      """
      files: '*.md'
      """
    And a runnable file "foo/bar.md"
    When running tut-run
    Then it signals:
      | WARNING | no Markdown files found |


  @clionly
  Scenario: glob expression provided on the command line
    Given the configuration file:
      """
      files: '*.md'
      """
    And a runnable file "readme.md"
    And a runnable file "foo/1.md"
    And a runnable file "foo/2.md"
    When running "tut-run foo/*.md"
    Then it runs only the tests in:
      | foo/1.md |
      | foo/2.md |


  Scenario: no config file glob key and no command-line parameter
    Given the configuration file:
      """
      foo: bar
      """
    And a runnable file "foo/bar.md"
    When running tut-run
    Then it runs 1 test
