@apionly
Feature: changing the working directory

  As a tutorial writer
  I want to be able to let my users run commands from different directories
  So that they can use my tool appropriately.

  - to change the working directory, wrap a hyperlink into an A tag with class `tutorialRunner_cd`
  - the link must point to a local directory
  - the directory pointed to must exist


  Scenario: pointing to an existing directory
    Given my workspace contains a directory "foo"
    And my workspace contains the file "directory_changer.md" with the content:
      """
      <a class="tutorialRunner_cd">
        [foo](foo)
      </a>
      """
    When executing the tutorial
    Then it signals:
      | FILENAME | directory_changer.md            |
      | LINE     | 1                               |
      | MESSAGE  | changing into the foo directory |
    And the test passes
    And the current working directory is now "foo"


  Scenario: pointing to a non-existing directory
    Given my workspace contains the file "directory_changer.md" with the content:
      """
      <a class="tutorialRunner_cd">
        [foo](foo)
      </a>
      """
    When trying to execute the tutorial
    Then the test fails with:
      | FILENAME      | directory_changer.md            |
      | LINE          | 1                               |
      | MESSAGE       | changing into the foo directory |
      | ERROR MESSAGE | directory foo not found         |
      | EXIT CODE     | 1                               |
