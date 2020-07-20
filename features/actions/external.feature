@debug
Feature: External actions

  Scenario: using an external action
    When executing the "external-action" example
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 3           |
      | MESSAGE  | Hello world |
