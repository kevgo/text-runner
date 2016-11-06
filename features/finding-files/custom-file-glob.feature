Feature: finding files in certain directories only

  As a Tutorial Runner user
  I want to be able to specify in which directories it should look for Markdown files
  So that it doesn't run in directories that I don't want to test right now.

  - the config file can contain a key "files" that specifies a glob expression


  Scenario: the config file specifies a custom glob expression
    Given the configuration file:
      """
      files: '*.md'
      """
    And a runnable file "foo/bar.md"
    When trying to execute the tutorial
    Then the test fails with:
      | ERROR MESSAGE | no Markdown files found |
      | EXIT CODE     | 1                       |


  Scenario: the config file contains no "files" key
    Given the configuration file:
      """
      foo: bar
      """
    And a runnable file "foo/bar.md"
    When executing the tutorial
    Then it runs 1 test
