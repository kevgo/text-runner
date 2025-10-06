Feature: Appending content to existing workspace files

  Rule: the filename is taken from the _, **, <em>, or <strong> section; the content from `, ```, <code>, or <pre>

    Scenario Outline:
      Given the workspace contains a file "file" with content:
        """
        hello sun
        """
      Given the source code contains a file "directory_changer.md" with content:
        """
        <a type="workspace/additional-file-content">

        <FILENAME> with content <CONTENT>

        </a>.
        """
      When calling Text-Runner
      Then it runs these actions:
        | FILENAME             | LINE | ACTION                            | ACTIVITY            |
        | directory_changer.md | 1    | workspace/additional-file-content | append to file file |
      And the workspace now contains a file "file" with content:
        """
        <RESULT>
        """

      Examples:
        | FILENAME              | CONTENT             | RESULT          |
        | _file_                | ` shine`            | hello sun shine |
        | **file**              | ``` shine```        | hello sun shine |
        | <em>file</em>         | <code> shine</code> | hello sunshine  |
        | <strong>file</strong> | <pre> shine</pre>   | hello sunshine  |

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

    Scenario: the file does not exist
      Given the source code contains a file "directory_changer.md" with content:
        """
        <a type="workspace/additional-file-content">**zonk.txt** the content `content`</a>.
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | directory_changer.md                                                     |
        | LINE          | 1                                                                        |
        | ACTION        | workspace/additional-file-content                                        |
        | ACTIVITY      | append to file zonk.txt                                                  |
        | STATUS        | failed                                                                   |
        | ERROR TYPE    | UserError                                                                |
        | ERROR MESSAGE | file zonk.txt doesn't exist                                              |
        | GUIDANCE      | ENOENT: no such file or directory, access '{{ WORKSPACE }}/tmp/zonk.txt' |

  Rule: the "dir" attribute sets the base directory

    Scenario: existing dir
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

      And the workspace now contains a file "foo/bar" with content:
        """
        hello appended content
        """

    Scenario: empty "dir" attribute
      Given the source code contains a file "empty_dir_attribute.md" with content:
        """
        <a type="workspace/additional-file-content" dir="">**file** `content`</a>.
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | empty_dir_attribute.md            |
        | LINE          | 1                                 |
        | ACTION        | workspace/additional-file-content |
        | ACTIVITY      | Workspace/additional file content |
        | STATUS        | failed                            |
        | ERROR TYPE    | UserError                         |
        | ERROR MESSAGE | attribute "dir" is empty          |
        | GUIDANCE      |                                   |

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

    Scenario: empty "filename" attribute
      Given the source code contains a file "empty_filename_attribute.md" with content:
        """
        <a type="workspace/additional-file-content" filename=""></a>.
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | empty_filename_attribute.md       |
        | LINE          | 1                                 |
        | ACTION        | workspace/additional-file-content |
        | ACTIVITY      | Workspace/additional file content |
        | STATUS        | failed                            |
        | ERROR TYPE    | UserError                         |
        | ERROR MESSAGE | attribute "filename" is empty     |
        | GUIDANCE      |                                   |
