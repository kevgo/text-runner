Feature: verifying the documented content of a file in the repository

  Background:
    Given the source code contains the file "hello.txt" with content:
      """
      Hello world!
      """

  Scenario: specify file name via emphasized text and content via code block
    Given the source code contains the file "1.md" with content:
      """
      <a textrun="repo/file-content">

      _hello.txt_ with content `Hello world!`

      </a>
      """
    When running text-run in the source directory
    Then it signals:
      | FILENAME | 1.md                                                |
      | LINE     | 1                                                   |
      | MESSAGE  | document content matches source code file hello.txt |

  Scenario: specify file name via strong text and content via fenced block
    Given the source code contains the file "1.md" with content:
      """
      <a textrun="repo/file-content">

      **hello.txt** with content:

      ```
      Hello world!
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                |
      | LINE     | 1                                                   |
      | MESSAGE  | document content matches source code file hello.txt |


  Scenario: file in subfolder
    Given the source code contains the file "docs/greeting.md" with content:
      """
      Hello!
      """
    And the source code contains the file "1.md" with content:
      """
      <a textrun="verify-source-file-content">

      [documentation](docs)
      __greeting.md__

      ```
      Hello!
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                                            |
      | LINE     | 1                                                               |
      | MESSAGE  | verifying document content matches source code file greeting.md |

  Scenario: file content mismatch
    Given the source code contains the file "01.md" with content:
      """
      <a textrun="repo/file-content">

      __hello.txt__

      ```
      mismatching expected content
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                                                             |
      | LINE          | 1                                                                                                 |
      | ERROR MESSAGE | mismatching content in hello.txt |
      | EXIT CODE     | 1                                                                                                 |


  Scenario: file is missing
    Given the source code contains the file "1.md" with content:
      """
      <a textrun="repo/file-content">

      __zonk.txt__

      `Hello world!`
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                    |
      | LINE          | 1                        |
      | ERROR MESSAGE | file not found: zonk.txt |
      | EXIT CODE     | 1                        |
