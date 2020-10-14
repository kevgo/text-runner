Feature: verifying Make commands

  Background:
    Given the source code contains a file "Makefile" with content:
      """
      foo:  # builds the "foo" executable
        @echo building foo

      bar:
        @echo building bar
      """

  Scenario: exact match
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code type="make/command">make foo</code>.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION       | ACTIVITY          |
      | 1.md     | 1    | make/command | make command: foo |

  Scenario: match as part of a code block
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run these commands:

      <pre type="make/command">
      $ echo run
      $ make foo
      $ echo done
      </code>.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION       | ACTIVITY          |
      | 1.md     | 3    | make/command | make command: foo |

  Scenario: mismatching target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code type="make/command">make zonk</code>.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION       | STATUS | ERROR TYPE | ERROR MESSAGE                                                           |
      | 1.md     | 1    | make/command | failed | UserError  | Makefile does not contain command make zonk but these targets: bar, foo |

  Scenario: missing target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code type="make/command">make </code>.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION       | STATUS | ERROR TYPE | ERROR MESSAGE          | GUIDANCE                             |
      | 1.md     | 1    | make/command | failed | UserError  | No Make commands found | Make commands must start with "make" |

  Scenario: empty tag
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code type="make/command"> </code>.
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION       | STATUS | ERROR TYPE | ERROR MESSAGE          | GUIDANCE                             |
      | 1.md     | 1    | make/command | failed | UserError  | No Make commands found | Make commands must start with "make" |

  Scenario: "dir" attribute
    Given the source code contains a file "subdir/1.md" with content:
      """
      To build the "foo" executable, run <code type="make/command" dir="..">make foo</code>.
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, sourceDir: config.sourceDir + "/subdir"})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTION       | STATUS  | ACTIVITY          |
      | 1.md     | 1    | make/command | success | make command: foo |
