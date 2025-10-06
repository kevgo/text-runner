Feature: Appending content to existing workspace files

  Rule: the filename is taken from the _, **, <em>, <i>, <strong>, or <b> section, the content from `, ```, <code>, or <pre>

    Scenario Outline:
      Given the workspace contains a file "foo/bar" with content:
        """
        hello
        """
      Given the source code contains a file "directory_changer.md" with content:
        """
        <a type="workspace/additional-file-content"><FILENAME>foo/bar<FILENAME> the content <CONTENT> appended content<CONTENT>.</a>.
        """
      When calling Text-Runner
      Then it runs these actions:
        | FILENAME             | LINE | ACTION                            | ACTIVITY               |
        | directory_changer.md | 1    | workspace/additional-file-content | append to file foo/bar |
      And the workspace now contains a file "foo/bar" with content:
        """
        hello appended content
        """

      Examples:
        | FILENAME OPEN | FILENAME CLOSE | CONTENT OPEN | CONTENT CLOSE |
        | _             | _              | `            | `             |
        | **            | **             | ```          | ```           |
        | <em>          | </em>          | <code>       | </code>       |
        | <i>           | </i>           | <code>       | </code>       |
        | <strong>      | </strong>      | <pre>        | </pre>        |
        | <b>           | </b>           | <pre>        | </pre>        |

  Rule: the file must exist

    Scenario: the file exists
      Given the workspace contains a file "foo/bar" with content:
        """
        hello
        """
      Given the source code contains a file "directory_changer.md" with content:
        """
        Now append to file
        <a type="workspace/additional-file-content">**foo/bar** the content ` appended content`.</a>.
        """
      When calling Text-Runner
      Then it runs these actions:
        | FILENAME             | LINE | ACTION                            | ACTIVITY               |
        | directory_changer.md | 2    | workspace/additional-file-content | append to file foo/bar |
      And the workspace now contains a file "foo/bar" with content:
        """
        hello appended content
        """
# TODO: Scenario: the file does not exist

  Rule: the "dir" attribute sets the base directory

    Scenario: valid dir
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

  Rule: the "filename" attribute sets the filename

    Scenario: provide filename via tag
      Given the workspace contains a file "file.txt" with content:
        """
        hello sun
        """
      And the source code contains a file "directory_changer.md" with content:
        """
        Now append to file
        <a type="workspace/additional-file-content" filename="file.txt">shine</a>.
        """
      When calling Text-Runner
      Then it runs these actions:
        | FILENAME             | LINE | ACTION                            | ACTIVITY                |
        | directory_changer.md | 2    | workspace/additional-file-content | append to file file.txt |
      And the workspace now contains a file "file.txt" with content:
        """
        hello sunshine
        """
