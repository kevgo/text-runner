Feature: verifying Make commands

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
      To build the "foo" executable, run <code type="make/command">make foo</code>.
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION       | ACTIVITY               |
      | 1.md     | 1    | make/command | make command: make foo |

  Scenario: mismatching target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code type="make/command">make zonk</code>.
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION       | STATUS | ERROR TYPE | ERROR MESSAGE                                                                 |
      | 1.md     | 1    | make/command | failed | UserError  | Makefile does not contain target make zonk but these ones: make bar, make foo |

  Scenario: missing target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code type="make/command">make </code>.
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION       | STATUS | ERROR TYPE | ERROR MESSAGE                        |
      | 1.md     | 1    | make/command | failed | UserError  | Make command must start with "make " |

  Scenario: empty tag
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code type="make/command"> </code>.
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION       | STATUS | ERROR TYPE | ERROR MESSAGE         |
      | 1.md     | 1    | make/command | failed | UserError  | No make command found |
