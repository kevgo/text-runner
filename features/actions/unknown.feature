@smoke
Feature: unknown action types

  When using an active block for which there is no action
  I want to be notified
  So that I can add the missing custom action.

  - using an unknown action causes the test run to fail


  Scenario: using an unknown action type
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="unknown-action">
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
      * cd
      * check-image
      * check-link
      * create-directory
      * create-file
      * run-async-javascript
      * run-console-command
      * run-javascript
      * start-process
      * stop-process
      * validate-javascript
      * verify-console-command-output
      * verify-npm-global-command
      * verify-npm-install
      * verify-process-output
      * verify-source-file-content
      * verify-workspace-contains-directory
      * verify-workspace-file-content

      No custom actions defined.

      To create a new "unknown-action" action,
      run "text-run scaffold unknown-action"
      """
