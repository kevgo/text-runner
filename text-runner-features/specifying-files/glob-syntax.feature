@smoke
Feature: finding files in certain directories only

  Background:
    Given the configuration file:
      """
      files: '*.md'
      """
    And a runnable file "readme.md"
    And a runnable file "bar/1.md"
    And a runnable file "foo/1.md"
    And a runnable file "foo/2.md"

  Scenario: different glob via CLI and config file
    When running "text-run foo/*.md"
    Then it runs only the tests in:
      | foo/1.md |
      | foo/2.md |


  Scenario: different glob via API and config file
    When calling "textRunner.runCommand({files: 'foo/*.md', sourceDir, formatterName})"
    Then it executes these actions:
      | FILENAME |
      | foo/1.md |
      | foo/2.md |
