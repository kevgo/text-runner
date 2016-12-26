@apionly
Feature: changing the working directory

  As a documentation writer
  I want to be able to let my users run commands from different directories
  So that they can use my tool appropriately.

  - to change the working directory, wrap a hyperlink into an A tag with class `tr_cd`
  - the link must point to a local directory
  - the directory pointed to must exist


  Scenario: pointing to an existing directory via hyperlink
    Given my workspace contains a directory "foo"
    And my workspace contains the file "directory_changer.md" with the content:
      """
      <a class="tr_cd">
        [foo](foo)
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | directory_changer.md            |
      | LINE     | 1                               |
      | MESSAGE  | changing into the foo directory |
    And the current working directory is now "foo"


  Scenario: pointing to an existing directory via code block
    Given my workspace contains a directory "foo"
    And my workspace contains the file "directory_changer.md" with the content:
      """
      <a class="tr_cd">
        `foo`
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | directory_changer.md            |
      | LINE     | 1                               |
      | MESSAGE  | changing into the foo directory |
    And the current working directory is now "foo"


  Scenario: pointing to a non-existing directory
    Given my workspace contains the file "directory_changer.md" with the content:
      """
      <a class="tr_cd">
        [foo](foo)
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | directory_changer.md            |
      | LINE          | 1                               |
      | MESSAGE       | changing into the foo directory |
      | ERROR MESSAGE | directory foo not found         |
      | EXIT CODE     | 1                               |


  Scenario: pointing to a non-existing directory
    Given my workspace contains the file "directory_changer.md" with the content:
      """
      <a class="tr_cd">
        `foo`
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | directory_changer.md            |
      | LINE          | 1                               |
      | MESSAGE       | changing into the foo directory |
      | ERROR MESSAGE | directory foo not found         |
      | EXIT CODE     | 1                               |

