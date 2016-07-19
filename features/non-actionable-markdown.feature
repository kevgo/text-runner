Feature: Fail on non-actionable Markdown

  As a tutorial writer
  I want to get warnings about non-actionable Markdown files
  So that I know I am doing something wrong and can fix my mistake.

  - a tutorial with no actions whatsoever causes the test to fail


  Scenario: tutorial with no actions
    Given I am in the directory of the tutorial "non-actionable"
    When running "tut-run"
    Then the test fails with exit code 1 and the error:
      """
      no activities found
      """
