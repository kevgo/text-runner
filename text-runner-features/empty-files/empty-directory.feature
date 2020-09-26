@api
Feature: failing on empty directory

  Scenario: running inside an empty directory
    When calling Text-Runner
    Then it emits these events:
      | STATUS  | MESSAGE                 |
      | warning | no Markdown files found |
