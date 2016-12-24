Feature: creating directories

  As a tutorial writer
  I want to be able to create directories in the test workspace
  So that my test suite has the folder structure to work.

  - to create a directory, write the directory name as a code tag
    and wrap it in an A tag with class "tutorialRunner_createDirectory"


  Scenario: creating a directory
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tutorialRunner_createDirectory">
      `directory_name`
      </a>
      """
    When running tut-run
    Then it signals:
      | FILENAME | creator.md                        |
      | LINE     | 1                                 |
      | MESSAGE  | creating directory directory_name |
    And the test workspace now contains a directory "directory_name"


  Scenario: no name given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tutorialRunner_createDirectory">
      </a>
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | creator.md                            |
      | LINE          | 1                                     |
      | MESSAGE       | creating directory                    |
      | ERROR MESSAGE | no name given for directory to create |
      | EXIT CODE     | 1                                     |


  Scenario: empty name given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tutorialRunner_createDirectory">
      ` `
      </a>
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | creator.md         |
      | LINE          | 1                  |
      | MESSAGE       | creating directory |
      | ERROR MESSAGE | empty name given   |
      | EXIT CODE     | 1                  |


  Scenario: two names given
    Given my workspace contains the file "creator.md" with the content:
      """
      <a class="tutorialRunner_createDirectory">
      `one` and `two`
      </a>
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | creator.md                       |
      | LINE          | 1                                |
      | MESSAGE       | creating directory               |
      | ERROR MESSAGE | several names given: one and two |
      | EXIT CODE     | 1                                |
