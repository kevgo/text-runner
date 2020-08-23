Feature: verify that the workspace contains a directory

  Background:
    Given the source code contains a file "1.md" with content:
      """
      Your computer should now contain a
      <code type="workspace/existing-directory">foo</code>
      directory.
      """

  Scenario: the workspace contains the directory
    Given the workspace contains a directory "foo"
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                  |
      | LINE     | 2                                     |
      | MESSAGE  | directory foo exists in the workspace |

  Scenario: the workspace does not contain the directory
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                          |
      | LINE          | 2                                             |
      | ERROR MESSAGE | directory foo does not exist in the workspace |
      | EXIT CODE     | 1                                             |

  Scenario: the given directory name points to a file
    Given the workspace contains a file "foo"
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                              |
      | LINE          | 2                                 |
      | ERROR MESSAGE | foo exists but is not a directory |
      | EXIT CODE     | 1                                 |
