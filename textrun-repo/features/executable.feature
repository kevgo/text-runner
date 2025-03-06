Feature: verifying a documented executable in the repository

  Scenario: file exists and is executable
    Given the source code contains an executable "scripts/setup"
    And the source code contains a file "1.md" with content:
      """
      <i type="repo/executable">scripts/setup</i>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION          | ACTIVITY                                     |
      | 1.md     | 1    | repo/executable | repository contains executable scripts/setup |


  Scenario: file exists but isn't executable
    Given the source code contains a file "scripts/setup"
    Given the source code contains a file "1.md" with content:
      """
      <i type="repo/executable">scripts/setup</i>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION          | ACTIVITY                                     | STATUS | ERROR MESSAGE                         |
      | 1.md     | 1    | repo/executable | repository contains executable scripts/setup | failed | file is not executable: scripts/setup |


  Scenario: file doesn't exist
    And the source code contains a file "1.md" with content:
      """
      <i type="repo/executable">scripts/zonk</i>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION          | ACTIVITY                                    | STATUS | ERROR MESSAGE                |
      | 1.md     | 1    | repo/executable | repository contains executable scripts/zonk | failed | file not found: scripts/zonk |
