@smoke
Feature: unknown action types

  Scenario: using an unknown action type
    Given the source code contains a file "1.md" with content:
      """
      <a type="zonk">
      </a>
      """
    When trying to run text-run
    Then the execution fails at:
      | FILENAME      | 1.md                 |
      | LINE          | 1                    |
      | ERROR MESSAGE | unknown action: zonk |
    And it provides the error message:
      """
      No custom actions defined.

      To create a new "zonk" action,
      run "text-run scaffold zonk"
      """
