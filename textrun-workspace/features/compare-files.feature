Feature: compare files

  Scenario: compare matching files
    Given the workspace contains a file "have.txt" with content:
      """
      same file content
      """
    And the workspace contains a file "want.txt" with content:
      """
      same file content
      """
    And the source code contains a file "compare.md" with content:
      """
      <a type="workspace/compare-files" have="have.txt" want="want.txt"></a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME   | LINE | ACTION                  | ACTIVITY                            |
      | compare.md |    1 | workspace/compare-files | compare files have.txt and want.txt |

  Scenario: have doesn't exist
    And the workspace contains a file "want.txt" with content:
      """
      same file content
      """
    And the source code contains a file "compare.md" with content:
      """
      <a type="workspace/compare-files" have="have.txt" want="want.txt"></a>.
      """
    When calling Text-Runner
    Then it runs this action:
      | FILENAME      | compare.md                              |
      | LINE          |                                       1 |
      | ACTION        | workspace/compare-files                 |
      | ACTIVITY      | compare files have.txt and want.txt     |
      | STATUS        | failed                                  |
      | ERROR TYPE    | UserError                               |
      | ERROR MESSAGE | file not found: have.txt                |
      | GUIDANCE      | the workspace has these files: want.txt |

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
