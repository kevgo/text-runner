Feature: failing on empty directory

  Scenario: running inside an empty directory
    When running text-run
    Then it signals:
      | MESSAGE | no Markdown files found |
