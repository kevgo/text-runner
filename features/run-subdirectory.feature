@clionly
Feature: testing all docs in a subfolder

  As a tutorial writer working on a large collection of documentation
  I want to be able to test only the documents in a particular folder
  So that I get my test result quickly without having to test everything.

  - run "tut-run [folder-to-test]" to test all docs in the given folder


  Scenario: testing all files in a subfolder
    Given a runnable file "commands/foo.md"
    And a runnable file "readme.md"
    When running "tut-run commands"
    Then it runs only the tests in "commands/foo.md"
