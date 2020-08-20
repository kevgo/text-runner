Feature: Appending content to existing workspace files

  Scenario: the file exists
    Given the workspace contains a directory "foo"
    And the workspace contains a file "foo/bar" with content "hello"
    And the source code contains a file "directory_changer.md" with content:
      """
      <a textrun="workspace/append-file">

      Append to file **foo/bar** the content ` appended content`.

      </a>.
      """
    When running "text-run --keep-tmp"
    Then it signals:
      | FILENAME | directory_changer.md   |
      | LINE     | 1                      |
      | MESSAGE  | append to file foo/bar |
    And the test directory now contains a file "foo/bar" with content:
      """
      hello appended content
      """
