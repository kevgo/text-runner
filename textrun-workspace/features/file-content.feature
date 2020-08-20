Feature: verifying file content

  Background:
    Given the workspace contains a file "hello.txt" with content:
      """
      Hello world!
      """

  Scenario: specify file name via emphasized text and content via code block
    Given the source code contains a file "01.md" with content:
      """
      <a textrun="workspace/file-content">

      _hello.txt_ with content `Hello world!`

      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 01.md                            |
      | LINE     | 1                                |
      | MESSAGE  | verify content of file hello.txt |

  Scenario: specify file name via strong text and content via fenced block
    Given the source code contains a file "01.md" with content:
      """
      <a textrun="workspace/file-content">

      **hello.txt** with content:

      ```
      Hello world!
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 01.md                            |
      | LINE     | 1                                |
      | MESSAGE  | verify content of file hello.txt |


  Scenario: file content mismatch
    Given the source code contains a file "01.md" with content:
      """
      <a textrun="workspace/file-content">

      __hello.txt__

      ```
      mismatching expected content
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 01.md                                                                                             |
      | LINE          | 1                                                                                                 |
      | ERROR MESSAGE | mismatching content in hello.txt:\nmismatching lines:\n\nmismatching expected contentHello world! |
      | EXIT CODE     | 1                                                                                                 |


  Scenario: file is missing
    Given the source code contains a file "01.md" with content:
      """
      <a textrun="workspace/file-content">

      __zonk.txt__

      `Hello world!`
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 01.md                    |
      | LINE          | 1                        |
      | ERROR MESSAGE | file not found: zonk.txt |
      | EXIT CODE     | 1                        |
