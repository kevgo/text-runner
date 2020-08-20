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
      To build the "foo" executable, run <code textrun="make/command">make foo</code>.
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                   |
      | LINE     | 1                      |
      | MESSAGE  | make command: make foo |

  Scenario: mismatching target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code textrun="make/command">make zonk</code>.
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                                          |
      | LINE          | 1                                                                             |
      | ERROR MESSAGE | Makefile does not contain target make zonk but these ones: make bar, make foo |
      | EXIT CODE     | 1                                                                             |


  Scenario: missing target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code textrun="make/command">make </code>.
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                 |
      | LINE          | 1                                    |
      | ERROR MESSAGE | Make command must start with "make " |
      | EXIT CODE     | 1                                    |

  Scenario: empty tag
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, run <code textrun="make/command"> </code>.
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                  |
      | LINE          | 1                     |
      | ERROR MESSAGE | No make command found |
      | EXIT CODE     | 1                     |
