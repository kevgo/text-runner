@api
Feature: Fail on non-actionable Markdown

  Scenario: documentation with no actions
    Given the source code contains a file "1.md" with content:
      """
      Just text here, nothing to do!
      """
    When calling Text-Runner
    Then it emits these events:
      | STATUS  | MESSAGE             |
      | warning | no activities found |
