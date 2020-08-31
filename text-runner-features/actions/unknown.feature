@smoke
Feature: unknown action types

  Scenario: using an unknown action type
    Given the source code contains a file "1.md" with content:
      """
      <a type="zonk">
      </a>
      """
    When trying to call text-run
    Then it executes these actions:
      | FILENAME | LINE | ACTION | ERROR MESSAGE        |
      | 1.md     | 1    | zonk   | unknown action: zonk |
    And it provides the full error message:
      """
      unknown action: zonk

      No custom actions defined.

      To create a new "zonk" action,
      run "text-run scaffold zonk"
      """
