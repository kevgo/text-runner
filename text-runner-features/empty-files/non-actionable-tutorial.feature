Feature: Fail on non-actionable Markdown

  Scenario: documentation with no actions
    Given the source code contains a file "1.md" with content:
      """
      Just text here, nothing to do!
      """
    When running Text-Runner
    Then it signals:
      | MESSAGE | no activities found |
