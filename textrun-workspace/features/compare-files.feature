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

  Scenario: want doesn't exist
    And the workspace contains a file "have.txt" with content:
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
      | ERROR MESSAGE | file not found: want.txt                |
      | GUIDANCE      | the workspace has these files: have.txt |

  Scenario: files have different content
    Given the workspace contains a file "have.txt" with content:
      """
      have file content
      """
    And the workspace contains a file "want.txt" with content:
      """
      want file content
      """
    And the source code contains a file "compare.md" with content:
      """
      <a type="workspace/compare-files" have="have.txt" want="want.txt"></a>.
      """
    When calling Text-Runner
    Then it runs this action:
      | FILENAME      | compare.md                                               |
      | LINE          |                                                        1 |
      | ACTION        | workspace/compare-files                                  |
      | ACTIVITY      | compare files have.txt and want.txt                      |
      | STATUS        | failed                                                   |
      | ERROR TYPE    | UserError                                                |
      | ERROR MESSAGE | mismatching content                                      |
      | GUIDANCE      | mismatching lines:\n\nwant file contenthave file content |
