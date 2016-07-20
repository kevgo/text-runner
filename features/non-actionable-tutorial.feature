Feature: Fail on non-actionable Markdown

  As a tutorial writer
  I want to get warnings if my whole tutorial doesn't perform a single action
  So that I know I am doing something wrong and can fix my mistake.

  - a tutorial with no actions whatsoever causes the test to fail


  Scenario: tutorial with no actions
    Given I am in a directory containing a file "just-text.md" with the content:
      """
      Just text here, nothing to do!
      """
    When running "tut-run"
    Then the test fails with exit code 1 and the error:
      """
      Error: no activities found
      """
