Feature: failing on empty directory

  As a tutorial writer accidentally running tut-run in an empty directory
  I want to be notified about my mistake
  So that I can run it again in the correct directory.

  - running "tut-run" in an empty directory causes the tests to fail


  Scenario: running inside an empty directory
    Given I am in the directory of the tutorial "empty-directory"
    When running "tut-run"
    Then the test fails with exit code 1 and the error:
      """
      no files found
      """

