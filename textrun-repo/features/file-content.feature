Feature: verifying the documented content of a file in the repository

  Background:
    Given the source code contains a file "hello.txt" with content:
      """
      Hello world!
      """

  Scenario: specify file name via emphasized text and content via code block
    Given the source code contains a file "1.md" with content:
      """
      <a type="repo/existing-file">

      _hello.txt_ with content `Hello world!`

      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION             | ACTIVITY                                            |
      | 1.md     | 1    | repo/existing-file | document content matches source code file hello.txt |


  Scenario: specify file name via strong text and content via fenced block
    Given the source code contains a file "1.md" with content:
      """
      <a type="repo/existing-file">

      **hello.txt** with content:

      ```
      Hello world!
      ```
      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION             | ACTIVITY                                            |
      | 1.md     | 1    | repo/existing-file | document content matches source code file hello.txt |


  Scenario: file in subfolder
    Given the source code contains a file "docs/greeting.md" with content:
      """
      Hello!
      """
    And the source code contains a file "1.md" with content:
      """
      <a type="repo/existing-file">

      [documentation](docs)
      __greeting.md__

      ```
      Hello!
      ```
      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION             | ACTIVITY                                                   |
      | 1.md     | 1    | repo/existing-file | document content matches source code file docs/greeting.md |
      | 1.md     | 3    | check-link         | link to local directory docs                               |

  Scenario: file content mismatch
    Given the source code contains a file "1.md" with content:
      """
      <a type="repo/existing-file">

      __hello.txt__

      ```
      mismatching expected content
      ```
      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION             | STATUS | ERROR TYPE | ERROR MESSAGE                    |
      | 1.md     | 1    | repo/existing-file | failed | UserError  | mismatching content in hello.txt |
    And the error provides the guidance:
      """
      mismatching lines:

      mismatching expected contentHello world!
      """


  Scenario: file doesn't exist
    Given the source code contains a file "1.md" with content:
      """
      <a type="repo/existing-file">

      __zonk.txt__

      `Hello world!`
      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION             | STATUS | ERROR TYPE | ERROR MESSAGE            |
      | 1.md     | 1    | repo/existing-file | failed | UserError  | file not found: zonk.txt |
