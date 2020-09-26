@api
Feature: running empty files

  Scenario: a documentation consisting of an empty file
    Given the workspace contains an empty file "empty.md"
    When calling Text-Runner
    Then it emits these events:
      | STATUS  | MESSAGE             |
      | warning | no activities found |
