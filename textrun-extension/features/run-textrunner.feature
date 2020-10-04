Feature: Running Text-Runner inside a Text-Runner session

  Scenario: working example
    Given the workspace contains a file "workspace.md" with content:
      """
      <a type="test"> </a>
      """
    And the source code contains a file "1.md" with content:
      """
      <a type="extension/run-textrunner"> </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                   | ACTIVITY                         |
      | 1.md     | 1    | extension/run-textrunner | Running Text-Runner in workspace |


  Scenario: error in Markdown to run
    Given the workspace contains a file "workspace.md" with content:
      """
      <a type="zonk"> </a>
      """
    And the source code contains a file "1.md" with content:
      """
      <a type="extension/run-textrunner"> </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION                   | ACTIVITY                         | STATUS | ERROR MESSAGE                                        |
      | 1.md     | 1    | extension/run-textrunner | Running Text-Runner in workspace | failed | the nested Text-Runner instance exited with code 127 |
