@api
Feature: failing on empty directory

  Scenario: running inside an empty directory
    When calling Text-Runner
    Then it executes these actions:
      | STATUS  | MESSAGE                 |
      | warning | no Markdown files found |
