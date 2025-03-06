Feature: ignoring workspace files

  @api
  Scenario: a code base with existing workspace files
    Given the source code contains a file "source.md" with content:
      """
      <a type="test"> </a>
      """
    And the workspace contains a file "workspace.md" with content:
      """
      <a type="test"> </a>
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, emptyWorkspace: false})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it runs these actions:
      | FILENAME  |
      | source.md |
