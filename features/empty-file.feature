Feature: running empty files

  As a tutorial writer
  I want to get a warning about empty files
  So that I don't forget to finish them.

  - empty files cause the test run to fail


  Scenario: a tutorial consisting of an empty file
    Given I am in the directory of the tutorial "empty-files"
    When running "tut-run"
    Then the test fails with exit code 1 and the error:
      """
      empty file: empty.md
      """
