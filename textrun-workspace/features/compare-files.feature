Feature: compare files

  Scenario: compare matching files
    Given the workspace contains a file "one.txt" with content:
      """
      same file content
      """
    And the workspace contains a file "two.txt" with content:
      """
      same file content
      """
    And the source code contains a file "compare.md" with content:
      """
      <a type="workspace/compare-files" have="one.txt" want="two.txt"></a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME   | LINE | ACTION                  | ACTIVITY                         |
      | compare.md |    1 | workspace/compare-files | compare file one.txt and two.txt |

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
    Then it runs this action:
      | FILENAME      | copy.md                                                 |
      | LINE          |                                                       1 |
      | ACTION        | workspace/copy-file                                     |
      | ACTIVITY      | Workspace copy file                                     |
      | STATUS        | failed                                                  |
      | ERROR TYPE    | UserError                                               |
      | ERROR MESSAGE | No src given                                            |
      | GUIDANCE      | Please provide the file to copy via the "src" attribute |

  Scenario: no dst given
    Given the source code contains a file "copy.md" with content:
      """
      <a type="workspace/copy-file" src="file.txt"></a>
      """
    When calling Text-Runner
    Then it runs this action:
      | FILENAME      | copy.md                                                         |
      | LINE          |                                                               1 |
      | ACTION        | workspace/copy-file                                             |
      | ACTIVITY      | Workspace copy file                                             |
      | STATUS        | failed                                                          |
      | ERROR TYPE    | UserError                                                       |
      | ERROR MESSAGE | No dst given                                                    |
      | GUIDANCE      | Please provide the destination filename via the "dst" attribute |
