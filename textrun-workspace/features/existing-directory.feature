Feature: verify that the workspace contains a directory

  Scenario: the workspace contains the directory
    Given the source code contains a file "1.md" with content:
      """
      Create directory <b type="workspace/new-directory">foo</b>.

      Your computer should now contain a
      <code type="workspace/existing-directory">foo</code>
      directory.
      """
    Given the workspace contains a directory "foo"
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION                       | ACTIVITY                              |
      | 1.md     | 1    | workspace/new-directory      | create directory foo                  |
      | 1.md     | 4    | workspace/existing-directory | directory foo exists in the workspace |

  Scenario: the workspace does not contain the directory
    Given the source code contains a file "1.md" with content:
      """
      Your computer should now contain a
      <code type="workspace/existing-directory">foo</code>
      directory.
      """
    When trying to call Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION                       | STATUS | ERROR TYPE | ERROR MESSAGE                                 |
      | 1.md     | 2    | workspace/existing-directory | failed | UserError  | directory foo does not exist in the workspace |

  Scenario: the given directory name points to a file
    Given the source code contains a file "1.md" with content:
      """
      Create file <b type="workspace/new-file">**foo** with content `bar`</b>.

      Your computer should now contain a
      <code type="workspace/existing-directory">foo</code>
      directory.
      """
    When trying to call Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION                       | STATUS  | ERROR TYPE | ERROR MESSAGE                     |
      | 1.md     | 1    | workspace/new-file           | success |            |                                   |
      | 1.md     | 4    | workspace/existing-directory | failed  | UserError  | foo exists but is not a directory |
