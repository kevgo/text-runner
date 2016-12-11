@clionly
Feature: running a single MarkDown file

  As a tutorial writer
  I want to be able to test a single MarkDown file
  So that I can check my current changes quickly without having to run the entire test suite.

  - run "tut-run run [<file path>]" or "tut-run [<file path>]" to test only the given file


  Background:
    Given I am in a directory that contains the "multiple-files" example


  Scenario: testing a single file via "tut-run run"
    When running "tut-run run 2.md"
    Then it runs only the tests in "2.md"


  Scenario: testing a single file via "tut-run"
    When running "tut-run 2.md"
    Then it runs only the tests in "2.md"


  Scenario: testing a non-existing file
    When trying to run "tut-run zonk.md"
    Then the test fails with:
      | ERROR MESSAGE | unknown command: zonk.md |
      | EXIT CODE     | 1                        |
