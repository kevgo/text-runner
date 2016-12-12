Feature: failing on empty directory

  As a tutorial writer accidentally running tut-run in an empty directory
  I want to be notified about my mistake
  So that I can run it again in the correct directory.

  - running "tut-run" in an empty directory causes the tests to fail


  Scenario: running inside an empty directory
    When executing the tutorial
    Then it signals:
      | WARNING | no Markdown files found |
