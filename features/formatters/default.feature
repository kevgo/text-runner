@skipWindows
Feature: default formatter

  As a documentation writer new to TextRunner
  I want that it uses a good formatter out of the box
  So that I can use this tool without extensive configuration.

  - the default formatter is the "colored" formatter


  Scenario: default formatter
    When executing the "bash" example
    Then it prints:
      """
      bash.md
      """
