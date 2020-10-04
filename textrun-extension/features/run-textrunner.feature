@debug
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
    When calling:
      """
      command = new textRunner.commands.Run({...config, emptyWorkspace: false, exclude: "tmp/*.*"})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTION                   | ACTIVITY                         | STATUS  | ERROR MESSAGE |
      | 1.md     | 1    | extension/run-textrunner | Running Text-Runner in workspace | success |               |


  Scenario: error in Markdown to run
    Given the workspace contains a file "workspace.md" with content:
      """
      <a type="zonk"> </a>
      """
    And the source code contains a file "1.md" with content:
      """
      <a type="extension/run-textrunner"> </a>
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, emptyWorkspace: false})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTION                   | ACTIVITY                         | STATUS | ERROR MESSAGE        |
      | 1.md     | 1    | extension/run-textrunner | Running Text-Runner in workspace | failed | unknown action: zonk |
