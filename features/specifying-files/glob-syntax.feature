Feature: finding files in certain directories only

  As a TextRunner user
  I want to be able to specify in which directories it should look for Markdown files
  So that it doesn't run in directories that I don't want to test right now.

  - the config file can contain a key "files" that specifies a glob expression to be used
  - you can also provide a glob expression on the command line
  - the command-line overrides the config file


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
