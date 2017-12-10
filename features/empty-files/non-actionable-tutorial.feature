Feature: Fail on non-actionable Markdown

  As a documentation writer
  I want to get warnings if my whole documentation doesn't perform a single action
  So that I know I am doing something wrong and can fix my mistake.

  - documentation with no actions whatsoever causes the test to fail


  Scenario: documentation with no actions
    Given my source code contains the file "1.md" with content:
      """
      Just text here, nothing to do!
      """
    When running text-run
    Then it signals:
      | WARNING | no activities found |
