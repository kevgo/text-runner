Feature: failing on empty directory

  As a documentation writer accidentally running text-run in an empty directory
  I want to be notified about my mistake
  So that I can run it again in the correct directory.

  - running "text-run" in an empty directory causes the tests to fail


  Scenario: running inside an empty directory
    When running text-run
    Then it signals:
      | WARNING | no Markdown files found |
