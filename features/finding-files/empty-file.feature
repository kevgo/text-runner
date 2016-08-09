Feature: running empty files

  As a tutorial writer
  I want to get a warning about empty files
  So that I don't forget to finish them.

  - empty files cause the test run to fail


  Scenario: a tutorial consisting of an empty file
    Given my workspace contains an empty file "empty.md"
    When executing the tutorial
    Then the test fails with exit code 1 and the error:
      """
      Error: found empty file empty.md
      """
