Feature: failing on empty directory

  As a tutorial writer accidentally running tut-run in an empty directory
  I want to be notified about my mistake
  So that I can run it again in the correct directory.

  - running "tut-run" in an empty directory causes the tests to fail


  Scenario: running inside an empty directory
    When trying to execute the tutorial runner in an empty workspace
    Then the test fails with:
      | ERROR MESSAGE | no Markdown files found |
      | EXIT CODE     | 1                       |
