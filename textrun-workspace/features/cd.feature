Feature: changing the working directory

  Scenario: pointing to an existing directory via hyperlink
    Given the workspace contains a directory "foo"
    And the workspace contains a file "foo/bar" with content "hello"
    And the source code contains a file "directory_changer.md" with content:
      """
      Change into the <code type="workspace/working-dir">foo</code> directory.
      You see a file <a type="workspace/existing-file">
        __bar__ `hello`
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | directory_changer.md            |
      | LINE     | 1                               |
      | MESSAGE  | changing into the foo directory |


  Scenario: pointing to an existing directory via code block
    Given the workspace contains a directory "foo"
    And the workspace contains a file "foo/bar" with content "hello"
    And the source code contains a file "directory_changer.md" with content:
      """
      <code type="workspace/working-dir">foo</code>
      <a type="workspace/existing-file">
        __bar__ `hello`
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | directory_changer.md            |
      | LINE     | 1                               |
      | MESSAGE  | changing into the foo directory |


  Scenario: pointing to a non-existing directory
    Given the source code contains a file "directory_changer.md" with content:
      """
      <code type="workspace/working-dir">foo</code>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | directory_changer.md    |
      | LINE          | 1                       |
      | ERROR MESSAGE | directory foo not found |
      | EXIT CODE     | 1                       |
