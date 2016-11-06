Feature: running empty files

  As a tutorial writer
  I want to get a warning about empty files
  So that I don't forget to finish them.

  - empty files cause the test run to fail


  Scenario: a tutorial consisting of an empty file
    Given my workspace contains an empty file "empty.md"
    When trying to execute the tutorial
    Then the test fails with:
      | ERROR MESSAGE | found empty file empty.md |
      | FILENAME      | empty.md                  |
      | EXIT CODE     | 1                         |
