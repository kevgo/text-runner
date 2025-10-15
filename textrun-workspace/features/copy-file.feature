Feature: copying files

  Scenario: copy an existing file
    Given the workspace contains a file "file_1.txt" with content:
      """
      file one
      """
    And the source code contains a file "copy.md" with content:
      """
      <a type="workspace/copy-file" src="file_1.txt" dst="file_2.txt"></a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION              | ACTIVITY                           |
      | copy.md  |    1 | workspace/copy-file | copy file file_1.txt to file_2.txt |
    And the workspace now contains a file "file_1.txt" with content:
      """
      file one
      """
    And the workspace now contains a file "file_2.txt" with content:
      """
      file one
      """

  Scenario: no file path given
    Given the source code contains a file "creator.md" with content:
      """
      <a type="workspace/empty-file">  </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME   | LINE | ACTION               | STATUS | ERROR TYPE | ERROR MESSAGE     | GUIDANCE |
      | creator.md |    1 | workspace/empty-file | failed | UserError  | No filename given |          |

  Scenario: setting the base directory
    Given the source code contains a file "creator.md" with content:
      """
      <a type="workspace/empty-file" dir="subdir">one.txt</a>.
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME   | LINE | ACTION               | ACTIVITY                   |
      | creator.md |    1 | workspace/empty-file | create file subdir/one.txt |
    And the workspace now contains an empty file "subdir/one.txt"

  Rule: the filename can be provided via the "filename" attribute

    Scenario: providing the filename via attribute
      Given the source code contains a file "creator.md" with content:
        """
        creating a file with name
        <b type="workspace/empty-file" filename="one.txt"></b>.
        """
      When calling Text-Runner
      Then it runs these actions:
        | FILENAME   | LINE | ACTION               | ACTIVITY            |
        | creator.md |    2 | workspace/empty-file | create file one.txt |
      And the workspace now contains an empty file "one.txt"

    Scenario: no file path given
      Given the source code contains a file "creator.md" with content:
        """
        <a type="workspace/empty-file" filename=""></a>
        """
      When calling Text-Runner
      Then it runs these actions:
        | FILENAME   | LINE | ACTION               | STATUS | ERROR TYPE | ERROR MESSAGE     | GUIDANCE |
        | creator.md |    1 | workspace/empty-file | failed | UserError  | No filename given |          |
