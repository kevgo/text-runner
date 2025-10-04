Feature: verifying file content

  Scenario: happy path
    Given the source code contains a file "test.md" with content:
      """
      Create a file <a type="workspace/empty-file">hello.txt</a>.
      Your workspace now contains a file <a type="workspace/existing-file">hello.txt</a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                  | ACTIVITY                           |
      | test.md  | 1    | workspace/empty-file    | create file hello.txt              |
      | test.md  | 2    | workspace/existing-file | verify existence of file hello.txt |

  Scenario: non-existing file
    Given the source code contains a file "test.md" with content:
      """
      Create a file just for validation: <a type="workspace/empty-file">test_file</a>

      The file <a type="workspace/existing-file">zonk.txt</a> doesn't exist.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                  | STATUS  | ERROR TYPE | ERROR MESSAGE            | GUIDANCE                                 |
      | test.md  | 1    | workspace/empty-file    | success |            |                          |                                          |
      | test.md  | 3    | workspace/existing-file | failed  | UserError  | file not found: zonk.txt | the workspace has these files: test_file |

  Scenario: setting the base directory
    Given the workspace contains a file "hello.txt"
    And the workspace contains a directory "subdir"
    And the source code contains a file "test.md" with content:
      """
      <a type="workspace/existing-file" dir="..">hello.txt</a>
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, workspace: "tmp/subdir"})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it runs these actions:
      | FILENAME | LINE | ACTION                  | ACTIVITY                              |
      | test.md  | 1    | workspace/existing-file | verify existence of file ../hello.txt |
