Feature: verifying file content

  Scenario: specify file name via emphasized text and content via code block
    Given the source code contains a file "1.md" with content:
      """
      Create a file <a type="workspace/new-file">**hello.txt** with content `Hello world!`</a>.
      Your workspace now contains a file <a type="workspace/existing-file-with-content">_hello.txt_ with content `Hello world!`</a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                               | ACTIVITY                         |
      |     1.md |    1 | workspace/new-file                   | create file hello.txt            |
      |     1.md |    2 | workspace/existing-file-with-content | verify content of file hello.txt |

  Scenario: specify file name via strong text and content via fenced block
    Given the source code contains a file "1.md" with content:
      """
      Create a file <a type="workspace/new-file">**hello.txt** with content `Hello world!`</a>.
      Now you have a file <a type="workspace/existing-file-with-content">**hello.txt** with content:
      
      ```
      Hello world!
      ```
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                               | ACTIVITY                         |
      |     1.md |    1 | workspace/new-file                   | create file hello.txt            |
      |     1.md |    2 | workspace/existing-file-with-content | verify content of file hello.txt |

  Scenario: file content mismatch
    Given the source code contains a file "1.md" with content:
      """
      Create a file <a type="workspace/new-file">**hello.txt** with content `Hello world!`</a>.
      Now you have a file <a type="workspace/existing-file-with-content">__hello.txt__ with `mismatching expected content`</a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                               | STATUS  | ERROR TYPE | ERROR MESSAGE                    | GUIDANCE                                                       |
      |     1.md |    1 | workspace/new-file                   | success |            |                                  |                                                                |
      |     1.md |    2 | workspace/existing-file-with-content | failed  | UserError  | mismatching content in hello.txt | mismatching lines:\n\nmismatching expected contentHello world! |
    And the error provides the guidance:
      """
      mismatching lines:
      
      mismatching expected contentHello world!
      """

  Scenario: non-existing file
    Given the source code contains a file "1.md" with content:
      """
      The file <a type="workspace/existing-file-with-content">__zonk.txt__ with content `Hello world!`</a> doesn't exist.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION                               | STATUS | ERROR TYPE | ERROR MESSAGE            | GUIDANCE                                                                            |
      |     1.md |    1 | workspace/existing-file-with-content | failed | UserError  | file not found: zonk.txt | the workspace has these files: 1.md, node_modules, package.json, tmp, tsconfig.json |

  Scenario: setting the base directory
    Given the workspace contains a file "hello.txt" with content:
      """
      Hello world!
      """
    And the workspace contains a directory "subdir"
    And the source code contains a file "1.md" with content:
      """
      <a type="workspace/existing-file-with-content" dir="..">
      
      Your workspace contains a file _hello.txt_ with content `Hello world!`
      
      </a>.
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, workspace: "tmp/subdir"})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it runs these actions:
      | FILENAME | LINE | ACTION                               | ACTIVITY                            |
      |     1.md |    1 | workspace/existing-file-with-content | verify content of file ../hello.txt |
