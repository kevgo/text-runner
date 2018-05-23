Feature: verify that the workspace contains a directory

  As a documentation writer
  I want to verify that the workspace in which the tests run contains a given directory
  So that I can be sure an action my reader took was successful.

  - use the "verifyWorkspaceContainsDirectory" action to verify whether the test workspace contains a directory
  - the directory is given as a code block


  Background:
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="verify-workspace-contains-directory">
        `foo`
      </a>
      """


  Scenario: the workspace contains the directory
    Given my workspace contains a directory "foo"
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                     |
      | LINE     | 1                                                        |
      | MESSAGE  | verifying the foo directory exists in the test workspace |


  Scenario: the workspace does not contain the directory
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                               |
      | LINE          | 1                                                  |
      | ERROR MESSAGE | directory foo does not exist in the test workspace |
      | EXIT CODE     | 1                                                  |


  Scenario: the given directory name points to a file
    Given my workspace contains the file "foo"
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                              |
      | LINE          | 1                                 |
      | ERROR MESSAGE | foo exists but is not a directory |
      | EXIT CODE     | 1                                 |
