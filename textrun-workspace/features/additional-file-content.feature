Feature: Appending content to existing workspace files

  Rule: the filename is taken from the _, **, <em>, or <strong> section; the content from `, ```, <code>, or <pre>

    Scenario Outline:
      Given the workspace contains a file "file" with content:
        """
        hello sun
        """
      Given the source code contains a file "file_appender.md" with content:
        """
        <a type="workspace/append-file">

        <FILENAME> with content <CONTENT>

        </a>.
        """
      When calling Text-Runner
      Then it runs these actions:
        | FILENAME         | LINE | ACTION                | ACTIVITY            |
        | file_appender.md | 1    | workspace/append-file | append to file file |
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

    Scenario: missing filename
      Given the workspace contains a file "foo/bar" with content:
        """
        hello
        """
      Given the source code contains a file "file_appender.md" with content:
        """
        <a type="workspace/append-file">no filename and content ` appended content`.</a>.
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | file_appender.md                                                                                    |
        | LINE          | 1                                                                                                   |
        | ACTION        | workspace/append-file                                                                               |
        | ACTIVITY      | Workspace append file                                                                               |
        | STATUS        | failed                                                                                              |
        | ERROR TYPE    | UserError                                                                                           |
        | ERROR MESSAGE | found no nodes of type 'em/strong/em_open/strong_open'                                              |
        | GUIDANCE      | The node types in this list are: anchor_open, text, code_open, text, code_close, text, anchor_close |
      And the workspace now contains a file "foo/bar" with content:
        """
        hello
        """

    Scenario: missing content
      Given the workspace contains a file "file.txt" with content:
        """
        hello
        """
      Given the source code contains a file "file_appender.md" with content:
        """
        <a type="workspace/append-file">_file.txt_ and no content</a>.
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | file_appender.md                                                                          |
        | LINE          | 1                                                                                         |
        | ACTION        | workspace/append-file                                                                     |
        | ACTIVITY      | append to file file.txt                                                                   |
        | STATUS        | failed                                                                                    |
        | ERROR TYPE    | UserError                                                                                 |
        | ERROR MESSAGE | found no nodes of type 'fence/code/fence_open/code_open'                                  |
        | GUIDANCE      | The node types in this list are: anchor_open, em_open, text, em_close, text, anchor_close |
      And the workspace now contains a file "file.txt" with content:
        """
        hello
        """

  Rule: the file to append to must exist

    Scenario: the file exists
      Given the workspace contains a file "foo/bar" with content:
        """
        hello
        """
      Given the source code contains a file "file_appender.md" with content:
        """
        Now append to file
        <a type="workspace/append-file">**foo/bar** the content ` appended content`.</a>.
        """
      When calling Text-Runner
      Then it runs these actions:
        | FILENAME         | LINE | ACTION                | ACTIVITY               |
        | file_appender.md | 2    | workspace/append-file | append to file foo/bar |
      And the workspace now contains a file "foo/bar" with content:
        """
        hello appended content
        """

    Scenario: the file does not exist
      Given the source code contains a file "file_appender.md" with content:
        """
        <a type="workspace/append-file">**zonk.txt** the content `content`</a>.
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | file_appender.md                                                         |
        | LINE          | 1                                                                        |
        | ACTION        | workspace/append-file                                                    |
        | ACTIVITY      | append to file zonk.txt                                                  |
        | STATUS        | failed                                                                   |
        | ERROR TYPE    | UserError                                                                |
        | ERROR MESSAGE | file "zonk.txt" doesn't exist                                            |
        | GUIDANCE      | ENOENT: no such file or directory, access '{{ WORKSPACE }}/tmp/zonk.txt' |

  Rule: the "dir" attribute can override the base directory

    Scenario: existing dir
      Given the workspace contains a file "foo/bar" with content:
        """
        hello
        """
      And the source code contains a file "1.md" with content:
        """
        <a type="workspace/append-file" dir="..">

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
        | FILENAME | LINE | ACTION                | ACTIVITY                  |
        | 1.md     | 1    | workspace/append-file | append to file ../foo/bar |
      And the workspace now contains a file "foo/bar" with content:
        """
        hello appended content
        """

    Scenario: non-existing dir
      And the source code contains a file "file.md" with content:
        """
        <a type="workspace/append-file" dir="zonk">

        Append to file **foo/bar** the content ` appended content`.

        </a>
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | file.md                                                              |
        | LINE          | 1                                                                    |
        | ACTION        | workspace/append-file                                                |
        | ACTIVITY      | Workspace append file                                                |
        | STATUS        | failed                                                               |
        | ERROR TYPE    | UserError                                                            |
        | ERROR MESSAGE | dir "zonk" doesn't exist                                             |
        | GUIDANCE      | ENOENT: no such file or directory, access '{{ WORKSPACE }}/tmp/zonk' |

    Scenario: empty attribute
      Given the source code contains a file "empty_dir_attribute.md" with content:
        """
        <a type="workspace/append-file" dir="">**file** `content`</a>.
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | empty_dir_attribute.md   |
        | LINE          | 1                        |
        | ACTION        | workspace/append-file    |
        | ACTIVITY      | Workspace append file    |
        | STATUS        | failed                   |
        | ERROR TYPE    | UserError                |
        | ERROR MESSAGE | attribute "dir" is empty |
        | GUIDANCE      |                          |

  Rule: the "filename" attribute can set the filename

    Scenario: existing filename
      Given the workspace contains a file "file.txt" with content:
        """
        hello sun
        """
      And the source code contains a file "file_appender.md" with content:
        """
        Now append to file
        <a type="workspace/append-file" filename="file.txt">shine</a>.
        """
      When calling Text-Runner
      Then it runs these actions:
        | FILENAME         | LINE | ACTION                | ACTIVITY                |
        | file_appender.md | 2    | workspace/append-file | append to file file.txt |
      And the workspace now contains a file "file.txt" with content:
        """
        hello sunshine
        """

    Scenario: non-existing filename
      Given the source code contains a file "empty_filename_attribute.md" with content:
        """
        <a type="workspace/append-file" filename="zonk.txt"></a>.
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | empty_filename_attribute.md                                              |
        | LINE          | 1                                                                        |
        | ACTION        | workspace/append-file                                                    |
        | ACTIVITY      | append to file zonk.txt                                                  |
        | STATUS        | failed                                                                   |
        | ERROR TYPE    | UserError                                                                |
        | ERROR MESSAGE | file "zonk.txt" doesn't exist                                            |
        | GUIDANCE      | ENOENT: no such file or directory, access '{{ WORKSPACE }}/tmp/zonk.txt' |

    Scenario: empty attribute
      Given the source code contains a file "empty_filename_attribute.md" with content:
        """
        <a type="workspace/append-file" filename=""></a>.
        """
      When calling Text-Runner
      Then it runs this action:
        | FILENAME      | empty_filename_attribute.md   |
        | LINE          | 1                             |
        | ACTION        | workspace/append-file         |
        | ACTIVITY      | Workspace append file         |
        | STATUS        | failed                        |
        | ERROR TYPE    | UserError                     |
        | ERROR MESSAGE | attribute "filename" is empty |
        | GUIDANCE      |                               |
