@api
Feature: running empty files

  Scenario: a documentation consisting of an empty file
    Given the workspace contains an empty file "empty.md"
    When calling Text-Runner
    Then it executes these actions:
      | STATUS  | MESSAGE             |
      | warning | no activities found |
