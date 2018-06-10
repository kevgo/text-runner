Feature: unknown activity types

  As a documentation developer
  I want to be notified if my documentation uses an action for which there is no handler
  So that I can fix my documentation.

  - using an action for which there is no handler causes the test run to fail


  Scenario: using an unknown activity type
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="unknown-action">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | unknown activity type: unknown-action |
      | FILENAME      | 1.md                                  |
      | EXIT CODE     | 1                                     |
    And it prints the error message:
      """
      Available built-in activity types:
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

      To create a new "unknown-action" activity type,
      run "text-run add unknown-action"
      """
