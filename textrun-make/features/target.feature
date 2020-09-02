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
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md            |
      | LINE     | 1               |
      | MESSAGE  | make target foo |

  Scenario: mismatching target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, build the <code type="make/target">zonk</code> target.
      """
    When trying to run Text-Runner
    Then the test fails with:
      | FILENAME      | 1.md                                                           |
      | LINE          | 1                                                              |
      | ERROR MESSAGE | Makefile does not contain target zonk but these ones: bar, foo |
      | EXIT CODE     | 1                                                              |

  Scenario: missing target name
    Given the source code contains a file "1.md" with content:
      """
      To build the "foo" executable, build the <code type="make/target"></code> target.
      """
    When trying to run Text-Runner
    Then the test fails with:
      | FILENAME      | 1.md              |
      | LINE          | 1                 |
      | ERROR MESSAGE | Empty make target |
      | EXIT CODE     | 1                 |
