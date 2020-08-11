Feature: excluding files

  As a TextRunner user
  I want to be able to exclude certain files and directories
  So that my tests don't fail because of invalid test data.

  - the config file can contain a key "exclude" that specifies files and folders to ignore
  - files containing that key are ignored by TextRunner
  - you can also provide a glob expression on the command line
  - the command-line overrides the config file


  Background:
    Given a runnable file "readme.md"
    And a runnable file "foo/1.md"
    And a runnable file "bar/2.md"


  Scenario: excluding via config file
    Given the configuration file:
      """
      exclude: 'foo'
      """
    When running text-run
    Then it runs only the tests in:
      | readme.md |
      | bar/2.md  |


  Scenario: excluding via CLI
    When running "text-run --exclude foo"
    Then it runs only the tests in:
      | readme.md |
      | bar/2.md  |
