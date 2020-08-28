Feature: verifying file content

  Scenario: specify file name via emphasized text and content via code block
    Given the source code contains a file "1.md" with content:
      """
      Create a file <a type="workspace/new-file">**hello.txt** with content `Hello world!`</a>.
      Your workspace now contains a file <a type="workspace/existing-file">_hello.txt_ with content `Hello world!`</a>.
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                             |
      | LINE     | 2                                |
      | MESSAGE  | verify content of file hello.txt |

  Scenario: specify file name via strong text and content via fenced block
    Given the source code contains a file "1.md" with content:
      """
      Create a file <a type="workspace/new-file">**hello.txt** with content `Hello world!`</a>.
      Now you have a file <a type="workspace/existing-file">**hello.txt** with content:

      ```
      Hello world!
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                             |
      | LINE     | 2                                |
      | MESSAGE  | verify content of file hello.txt |

  Scenario: file content mismatch
    Given the source code contains a file "1.md" with content:
      """
      Create a file <a type="workspace/new-file">**hello.txt** with content `Hello world!`</a>.
      Now you have a file <a type="workspace/existing-file">__hello.txt__ with `mismatching expected content`</a>.
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                                                              |
      | LINE          | 2                                                                                                 |
      | ERROR MESSAGE | mismatching content in hello.txt:\nmismatching lines:\n\nmismatching expected contentHello world! |
      | EXIT CODE     | 1                                                                                                 |

  Scenario: non-existing file
    Given the source code contains a file "1.md" with content:
      """
      The file <a type="workspace/existing-file">__zonk.txt__ with content `Hello world!`</a> doesn't exist.
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                    |
      | LINE          | 1                        |
      | ERROR MESSAGE | file not found: zonk.txt |
      | EXIT CODE     | 1                        |
