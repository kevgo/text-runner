Feature: empty the workspace

  Background:
    Given the workspace contains a file "1.md" with content:
      """
      <a type="test"> </a>
      """

  Scenario: default behavior: on
    When calling Text-Runner
    Then it executes these actions:
      | STATUS  | MESSAGE        |
      | warning | no files found |
