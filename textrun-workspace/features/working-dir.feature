Feature: changing the working directory

  Scenario: existing directory
    Given the source code contains a file "directory_changer.md" with content:
      """
      Create file <a type="workspace/new-file">**foo/bar** with content `hello`</a>.

      Change into the <code type="workspace/working-dir">foo</code> directory.
      You see a file <a type="workspace/existing-file">__bar__ `hello` </a>.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME             | LINE | ACTION                  | ACTIVITY                        |
      | directory_changer.md | 1    | workspace/new-file      | create file foo/bar             |
      | directory_changer.md | 3    | workspace/working-dir   | changing into the foo directory |
      | directory_changer.md | 4    | workspace/existing-file | verify content of file bar      |


  Scenario: non-existing directory
    Given the source code contains a file "directory_changer.md" with content:
      """
      <code type="workspace/working-dir">foo</code>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME             | LINE | ACTION                | STATUS | ERROR TYPE | ERROR MESSAGE           |
      | directory_changer.md | 1    | workspace/working-dir | failed | UserError  | directory foo not found |
