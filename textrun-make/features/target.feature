Feature: verifying Make targets

  Background:
    Given the source code contains a file "Makefile" with content:
      """
      foo:  # builds the "foo" executable
        @echo building foo

      bar:
        @echo building bar
      """

  Scenario: works
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, build the <code type="make/target">foo</code> target.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      | ACTIVITY        |
      | 1.md     | 1    | make/target | make target foo |

  Scenario: mismatching target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, build the <code type="make/target">zonk</code> target.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      | STATUS | ERROR TYPE | ERROR MESSAGE                                                  |
      | 1.md     | 1    | make/target | failed | UserError  | Makefile does not contain target zonk but these ones: bar, foo |

  Scenario: missing target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, build the <code type="make/target"></code> target.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      | STATUS | ERROR TYPE | ERROR MESSAGE     |
      | 1.md     | 1    | make/target | failed | UserError  | Empty make target |

  Scenario: cwd attribute
    Given the source code contains a file "subdir/1.md" with content:
      """
      To build the "foo" executable, run <code type="make/target" cwd="..">foo</code>.
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, sourceDir: config.sourceDir + "/subdir"})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTION      | STATUS  | ACTIVITY        |
      | 1.md     | 1    | make/target | success | make target foo |
