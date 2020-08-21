Feature: creating directories

  Scenario: creating a directory
    Given the source code contains a file "creator.md" with content:
      """
      Create the directory <b textrun="workspace/create-directory">directory_name</b>.
      """
    When running "text-run --keep-workspace"
    Then it signals:
      | FILENAME | creator.md                      |
      | LINE     | 1                               |
      | MESSAGE  | create directory directory_name |
    And the test workspace now contains a directory "directory_name"

  Scenario: missing closing tag
    Given the source code contains a file "creator.md" with content:
      """
      Create the directory <b textrun="workspace/create-directory">
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                 |
      | LINE          | 1                          |
      | ERROR MESSAGE | empty directory name given |
      | EXIT CODE     | 1                          |


  Scenario: empty name given
    Given the source code contains a file "creator.md" with content:
      """
      <b textrun="workspace/create-directory"> </b>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                 |
      | LINE          | 1                          |
      | ERROR MESSAGE | empty directory name given |
      | EXIT CODE     | 1                          |
