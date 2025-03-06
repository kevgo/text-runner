Feature: creating directories

  Scenario: creating a directory
    Given the source code contains a file "creator.md" with content:
      """
      Create the directory <b type="workspace/new-directory">directory_name</b>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME   | LINE | ACTION                  | ACTIVITY                        |
      | creator.md | 1    | workspace/new-directory | create directory directory_name |
    And the test workspace now contains a directory "directory_name"

  Scenario: missing closing tag
    Given the source code contains a file "creator.md" with content:
      """
      Create the directory <b type="workspace/new-directory">
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME   | LINE | ACTION                  | STATUS | ERROR TYPE | ERROR MESSAGE              |
      | creator.md | 1    | workspace/new-directory | failed | UserError  | empty directory name given |


  Scenario: empty name given
    Given the source code contains a file "creator.md" with content:
      """
      <b type="workspace/new-directory"> </b>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME   | LINE | ACTION                  | STATUS | ERROR TYPE | ERROR MESSAGE              |
      | creator.md | 1    | workspace/new-directory | failed | UserError  | empty directory name given |


  Scenario: setting the base directory
    Given the source code contains a file "creator.md" with content:
      """
      Create a directory
      <a type="workspace/new-directory" dir="subdir">directory_name</a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME   | LINE | ACTION                  | ACTIVITY                               |
      | creator.md | 2    | workspace/new-directory | create directory subdir/directory_name |
    And the test workspace now contains a directory "subdir/directory_name"
