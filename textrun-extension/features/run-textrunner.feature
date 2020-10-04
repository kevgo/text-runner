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
    When calling:
      """
      command = new textRunner.commands.Run({...config, emptyWorkspace: false})
      observer = new MyObserverClass(command)
      await command.execute()
      """
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
    When calling:
      """
      command = new textRunner.commands.Run({...config, emptyWorkspace: false})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME  | LINE | ACTION                   | ACTIVITY                         | STATUS | ERROR MESSAGE        |
      | source.md | 1    | extension/run-textrunner | Running Text-Runner in workspace | failed | unknown action: zonk |


  Scenario: "dir" attribute
    Given the workspace contains a file "subdir/workspace.md" with content:
      """
      <a type="test"> </a>
      """
    And the source code contains a file "source.md" with content:
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
      | FILENAME  | LINE | ACTION                   | ACTIVITY                         | STATUS  |
      | source.md | 1    | extension/run-textrunner | Running Text-Runner in workspace | success |
