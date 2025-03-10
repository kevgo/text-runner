Feature: Appending content to existing workspace files

  Scenario: the file exists
    Given the source code contains a file "directory_changer.md" with content:
      """
      Create a file <a type="workspace/new-file">**foo/bar** with content `hello`</a>.
      Now append to file <a type="workspace/additional-file-content">**foo/bar** the content ` appended content`.</a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME             | LINE | ACTION                            | ACTIVITY               |
      | directory_changer.md | 1    | workspace/new-file                | create file foo/bar    |
      | directory_changer.md | 2    | workspace/additional-file-content | append to file foo/bar |
    And the workspace now contains a file "foo/bar" with content:
      """
      hello appended content
      """

  # TODO: Scenario: the file does not exist

  Scenario: setting the base directory
    Given the workspace contains a file "foo/bar" with content:
      """
      hello
      """
    And the source code contains a file "1.md" with content:
      """
      <a type="workspace/additional-file-content" dir="..">

      Append to file **foo/bar** the content ` appended content`.

      </a>
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, workspace: "tmp/subdir"})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it runs these actions:
      | FILENAME | LINE | ACTION                            | ACTIVITY                  |
      | 1.md     | 1    | workspace/additional-file-content | append to file ../foo/bar |
    And the workspace now contains a file "foo/bar" with content:
      """
      hello appended content
      """
