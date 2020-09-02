Feature: running empty files

  Scenario: a documentation consisting of an empty file
    Given the workspace contains an empty file "empty.md"
    When running Text-Runner
    And it signals:
      | MESSAGE | no activities found |
