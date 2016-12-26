Feature: protecting against buggy custom actions

  As a documentation writer
  I want to get meaningful error messages for bugs in my custom actions
  So that I can create them even though I'm not an expert coder.

  - calling the continuation function twice creates a test failure


  @clionly
  Scenario: calling the continuation twice
    Given I am in a directory that contains the "multiple-returns" example
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                        |
      | LINE          | 1                           |
      | ERROR MESSAGE | Callback was already called |
      | EXIT CODE     | 1                           |
