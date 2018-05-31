Feature: verifying file content

  As a documentation writer
  I want to be able to write actions that verify created files
  So that I am sure my tools performs the correct actions on the hard drive.

  - the "verifyWorkspaceFileContent" action verifies files in the current workspace
  - the filename is provided as strong text or italic text
  - the expected content is provided as a code or fenced block


  Background:
    Given my workspace contains the file "hello.txt" with content:
      """
      Hello world!
      """


  Scenario: specify file name via emphasized text and content via code block
    Given my source code contains the file "01.md" with content:
      """
      <a textrun="verify-workspace-file-content">
      _hello.txt_ with content `Hello world!`
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 01.md                    |
      | LINE     | 1                        |
      | MESSAGE  | verifying file hello.txt |


  Scenario: specify file name via strong text and content via fenced block
    Given my source code contains the file "01.md" with content:
      """
      <a textrun="verify-workspace-file-content">
      __hello.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 01.md                    |
      | LINE     | 1                        |
      | MESSAGE  | verifying file hello.txt |


  Scenario: file content mismatch
    Given my source code contains the file "01.md" with content:
      """
      <a textrun="verify-workspace-file-content">
      __hello.txt__

      ```
      mismatching expected content
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 01.md                                                                                                      |
      | LINE          | 1                                                                                                          |
      | ERROR MESSAGE | mismatching content in hello.txt:\nError: mismatching records:\n\nmismatching expected contentHello world! |
      | EXIT CODE     | 1                                                                                                          |


  Scenario: file is missing
    Given my source code contains the file "01.md" with content:
      """
      <a textrun="verify-workspace-file-content">
      __zonk.txt__

      `Hello world!`
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 01.md                   |
      | LINE          | 1                       |
      | ERROR MESSAGE | file zonk.txt not found |
      | EXIT CODE     | 1                       |
