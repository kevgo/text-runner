@smoke
@api
Feature: unknown action types

  Scenario: using an unknown action type
    Given the source code contains a file "1.md" with content:
      """
      <a type="zonk">
      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | STATUS | ERROR TYPE | ERROR MESSAGE        | GUIDANCE                                                                                   |
      | 1.md     | 1    | failed | UserError  | unknown action: zonk | No custom actions defined.\n\nTo create a new "zonk" action,\nrun "text-run scaffold zonk" |
    And the error provides the guidance:
      """
      No custom actions defined.

      To create a new "zonk" action,
      run "text-run scaffold zonk"
      """
