@smoke
Feature: unknown action types

  Scenario: using an unknown action type
    Given the source code contains a file "1.md" with content:
      """
      <a type="zonk">
      </a>
      """
    When trying to call "textRunner.runCommand(config)"
    Then it executes these actions:
      | FILENAME | LINE | STATUS | ERROR TYPE | ERROR MESSAGE        |
      | 1.md     | 1    | failed | UserError  | unknown action: zonk |
    And the error provides the guidance:
      """
      No custom actions defined.

      To create a new "zonk" action,
      run "text-run scaffold zonk"
      """
