Feature: testing all docs in a subfolder

  As a documentation writer working on a large collection of documentation
  I want to be able to test only the documents in a particular folder
  So that I get my test result quickly without having to test everything.

  - run "text-run [folder-to-test]" to test all docs in the given folder


  Background:
    Given a runnable file "commands/foo.md"
    Given a runnable file "commands/bar/baz.md"
    And a runnable file "readme.md"


  Scenario: testing all files in a subfolder
    When running "text-run commands"
    Then it runs only the tests in:
      | commands/foo.md     |
      | commands/bar/baz.md |
