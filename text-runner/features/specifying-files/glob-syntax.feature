@smoke
Feature: finding files in certain directories only

  Background:
    Given the configuration file:
      """
      files: '*.md'
      """
    And a runnable file "readme.md"
    And a runnable file "foo/1.md"
    And a runnable file "foo/2.md"

  Scenario: different glob on command line and config file
    When running "text-run foo/*.md"
    Then it runs only the tests in:
      | foo/1.md |
      | foo/2.md |
