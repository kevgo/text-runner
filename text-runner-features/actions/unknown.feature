@smoke
Feature: unknown action types

  Scenario: using an unknown action type
    Given the source code contains a file "1.md" with content:
      """
      <a type="zonk">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | unknown action: zonk |
      | FILENAME      | 1.md                 |
      | EXIT CODE     | 1                    |
    And it prints the error message:
      """
      No custom actions defined.

      To create a new "zonk" action,
      run "text-run scaffold zonk"
      """
