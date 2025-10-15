Feature: copying files

  Scenario: copy an existing file
    Given the workspace contains a file "file_1.txt" with content:
      """
      file one
      """
    And the source code contains a file "copy.md" with content:
      """
      <a type="workspace/copy-file" src="file_1.txt" dst="file_2.txt"></a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION              | ACTIVITY                           |
      | copy.md  |    1 | workspace/copy-file | copy file file_1.txt to file_2.txt |
    And the workspace still contains a file "file_1.txt" with content:
      """
      file one
      """
    And the workspace now contains a file "file_2.txt" with content:
      """
      file one
      """

  Scenario: file doesn't exist
    Given the source code contains a file "copy.md" with content:
      """
      <a type="workspace/copy-file" src="zonk.txt" dst="funk.txt"></a>
      """
    When calling Text-Runner
    Then it runs this action:
      | FILENAME      | copy.md                                                                  |
      | LINE          |                                                                        1 |
      | ACTION        | workspace/copy-file                                                      |
      | ACTIVITY      | copy file zonk.txt to funk.txt                                           |
      | STATUS        | failed                                                                   |
      | ERROR TYPE    | UserError                                                                |
      | ERROR MESSAGE | file "zonk.txt" doesn't exist                                            |
      | GUIDANCE      | ENOENT: no such file or directory, access '{{ WORKSPACE }}/tmp/zonk.txt' |

  Scenario: no src given
    Given the source code contains a file "copy.md" with content:
      """
      <a type="workspace/copy-file"></a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION              | STATUS | ERROR TYPE | ERROR MESSAGE | GUIDANCE |
      | copy.md  |    1 | workspace/copy-file | failed | UserError  | No src given  |          |

  Scenario: no dst given
    Given the source code contains a file "copy.md" with content:
      """
      <a type="workspace/copy-file" src="file.txt"></a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION              | STATUS | ERROR TYPE | ERROR MESSAGE | GUIDANCE |
      | copy.md  |    1 | workspace/copy-file | failed | UserError  | No dst given  |          |
