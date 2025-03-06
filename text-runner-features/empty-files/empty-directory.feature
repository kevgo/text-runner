Feature: failing on empty directory

  Scenario: running inside an empty directory
    When calling Text-Runner
    Then it runs these actions:
      | STATUS  | MESSAGE                 |
      | warning | no Markdown files found |
