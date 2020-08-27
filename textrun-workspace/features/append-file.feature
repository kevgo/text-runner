Feature: Appending content to existing workspace files

  Scenario: the file exists
    Given the workspace contains a directory "foo"
    And the workspace contains a file "foo/bar" with content "hello"
    And the source code contains a file "directory_changer.md" with content:
      """
      <a type="workspace/new-file">

      Create a file **foo/bar** with content `hello`.

      </a>.

      <a type="workspace/additional-file-content">

      Now append to file **foo/bar** the content ` appended content`.

      </a>.
      """
    When running "text-run --keep-workspace"
    Then it signals:
      | FILENAME | directory_changer.md   |
      | LINE     | 7                      |
      | MESSAGE  | append to file foo/bar |
    And the test directory now contains a file "foo/bar" with content:
      """
      hello appended content
      """
