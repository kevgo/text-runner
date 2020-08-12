Feature: verifying Make targets

  Background:
    Given my source code contains the file "Makefile" with content:
      """
      foo:  # builds the "foo" executable
        @echo building foo

      bar:
        @echo building bar
      """

  Scenario: works
    Given my source code contains the file "1.md" with content:
      """
      To build the "foo" executable, build the <code textrun="make/target">foo</code> target.
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md            |
      | LINE     | 1               |
      | MESSAGE  | make target foo |

  Scenario: mismatching target name
    Given my source code contains the file "1.md" with content:
      """
      To build the "foo" executable, build the <code textrun="make/target">zonk</code> target.
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                                           |
      | LINE          | 1                                                              |
      | ERROR MESSAGE | Makefile does not contain target zonk but these ones: bar, foo |
      | EXIT CODE     | 1                                                              |


  Scenario: missing target name
    Given my source code contains the file "1.md" with content:
      """
      To build the "foo" executable, build the <code textrun="make/target"></code> target.
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md              |
      | LINE          | 1                 |
      | ERROR MESSAGE | Empty make target |
      | EXIT CODE     | 1                 |
