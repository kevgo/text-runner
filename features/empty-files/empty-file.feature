Feature: running empty files

  As a documentation writer
  I want to get a warning about empty files
  So that I don't forget to finish them.

  - empty files cause the test run to fail


  Scenario: a documentation consisting of an empty file
    Given my workspace contains an empty file "empty.md"
    When running text-run
    Then it signals:
      | WARNING | found empty file empty.md |
    And it signals:
      | WARNING | no activities found |
