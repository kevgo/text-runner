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
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                  |
      | LINE     | 4                                     |
      | MESSAGE  | directory foo exists in the workspace |

  Scenario: the workspace does not contain the directory
    Given the source code contains a file "1.md" with content:
      """
      Your computer should now contain a
      <code type="workspace/existing-directory">foo</code>
      directory.
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                          |
      | LINE          | 2                                             |
      | ERROR MESSAGE | directory foo does not exist in the workspace |
      | EXIT CODE     | 1                                             |

  Scenario: the given directory name points to a file
    Given the source code contains a file "1.md" with content:
      """
      Create file <b type="workspace/new-file">**foo** with content `bar`</b>.

      Your computer should now contain a
      <code type="workspace/existing-directory">foo</code>
      directory.
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                              |
      | LINE          | 4                                 |
      | ERROR MESSAGE | foo exists but is not a directory |
      | EXIT CODE     | 1                                 |
