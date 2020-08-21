@smoke
Feature: unknown action types

  Scenario: using an unknown action type
    Given the source code contains a file "1.md" with content:
      """
      <a type="unknown-action">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | unknown action: unknown-action |
      | FILENAME      | 1.md                           |
      | EXIT CODE     | 1                              |
    And it prints the error message:
      """
      Available built-in actions:
      * check-image
      * check-link
      * test

      No custom actions defined.

      To create a new "unknown-action" action,
      run "text-run scaffold unknown-action"
      """
