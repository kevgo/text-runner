Feature: testing all docs in a subfolder

  Background:
    Given a runnable file "commands/foo.md"
    Given a runnable file "commands/bar/baz.md"
    And a runnable file "readme.md"

  Scenario: testing all files in a subfolder
    When running "text-run commands"
    Then it runs only the tests in:
      | commands/foo.md     |
      | commands/bar/baz.md |
