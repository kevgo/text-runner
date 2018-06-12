Feature: changing the working directory

  As a documentation writer
  I want to be able to let my users run commands from different directories
  So that they can use my tool appropriately.

  - to change the working directory, wrap a hyperlink into a tag with class textrun=`cd`
  - the link must point to a local directory
  - the directory pointed to must exist


  Scenario: pointing to an existing directory via hyperlink
    Given my workspace contains a directory "foo"
    And my workspace contains a file "foo/bar" with content "hello"
    And my source code contains the file "directory_changer.md" with content:
      """
      <code textrun="cd">foo</code>
      <a textrun="verify-workspace-file-content">
        __bar__ `hello`
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | directory_changer.md            |
      | LINE     | 1                               |
      | MESSAGE  | changing into the foo directory |


  Scenario: pointing to an existing directory via code block
    Given my workspace contains a directory "foo"
    And my workspace contains a file "foo/bar" with content "hello"
    And my source code contains the file "directory_changer.md" with content:
      """
      <code textrun="cd">foo</code>
      <a textrun="verify-workspace-file-content">
        __bar__ `hello`
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | directory_changer.md            |
      | LINE     | 1                               |
      | MESSAGE  | changing into the foo directory |


  Scenario: pointing to a non-existing directory
    Given my source code contains the file "directory_changer.md" with content:
      """
      <code textrun="cd">foo</code>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | directory_changer.md            |
      | LINE          | 1                               |
      | ERROR MESSAGE | directory foo not found         |
      | EXIT CODE     | 1                               |
