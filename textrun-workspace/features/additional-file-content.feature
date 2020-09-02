Feature: Appending content to existing workspace files

  Scenario: the file exists
    Given the source code contains a file "directory_changer.md" with content:
      """
      Create a file <a type="workspace/new-file">**foo/bar** with content `hello`</a>.
      Now append to file <a type="workspace/additional-file-content">**foo/bar** the content ` appended content`.</a>.
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | directory_changer.md   |
      | LINE     | 2                      |
      | MESSAGE  | append to file foo/bar |
    And the test directory now contains a file "foo/bar" with content:
      """
      hello appended content
      """
