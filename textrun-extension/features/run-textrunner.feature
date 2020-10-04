Feature: Running Text-Runner inside a Text-Runner session

  Scenario: working example
    Given the workspace contains a file "workspace.md" with content:
      """
      <a type="test"> </a>
      """
    And the source code contains a file "source.md" with content:
      """
      <a type="extension/run-textrunner"> </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME  | LINE | ACTION                   | ACTIVITY                         | STATUS  |
      | source.md | 1    | extension/run-textrunner | Running Text-Runner in workspace | success |


  Scenario: error in Markdown to run
    Given the workspace contains a file "workspace.md" with content:
      """
      <a type="zonk"> </a>
      """
    And the source code contains a file "source.md" with content:
      """
      <a type="extension/run-textrunner"> </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME  | LINE | ACTION                   | ACTIVITY                         | STATUS | ERROR MESSAGE                                        |
      | source.md | 1    | extension/run-textrunner | Running Text-Runner in workspace | failed | the nested Text-Runner instance exited with code 127 |
