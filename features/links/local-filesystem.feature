Feature: verifying links to the local filesystem

  As a tutorial writer
  I want to know whether links to local files in my code base work
  So that I can point my readers to example code that is part of my tutorial.

  - links pointing to non-existing local files or directories
    cause the test to fail


  Scenario: link to existing local file
    Given my workspace contains the file "1.md" with the content:
      """
      [link to existing local file](1.md)
      """
    When running tut-run
    Then it signals:
      | FILENAME | 1.md                    |
      | LINE     | 1                       |
      | MESSAGE  | link to local file 1.md |



  Scenario: link to existing local directory
    Given my workspace contains the file "1.md" with the content:
      """
      [link to local directory](.)
      """
    When running tut-run
    Then it signals:
      | FILENAME | 1.md                      |
      | LINE     | 1                         |
      | MESSAGE  | link to local directory . |


  Scenario: link to non-existing local file
    Given my workspace contains the file "1.md" with the content:
      """
      [link to non-existing local file](zonk.md)
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | 1.md                                    |
      | LINE          | 1                                       |
      | ERROR MESSAGE | link to non-existing local file zonk.md |
      | EXIT CODE     | 1                                       |
