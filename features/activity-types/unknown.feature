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
      | ERROR MESSAGE | unknown activity type: unknown-action\nAvailable activity types: |
      | FILENAME      | 1.md                                                             |
      | EXIT CODE     | 1                                                                |
    And it prints the error message:
      """
      Available activity types:
      * cd
      * check-image
      * check-link
      * create-directory
      * create-file
      * minimum-node-version
      * run-async-javascript
      * run-console-command
      * run-javascript
      * start-console-command
      * stop-console-command
      * validate-javascript
      * verify-npm-global-command
      * verify-npm-install
      * verify-run-console-command-output
      * verify-source-contains-directory
      * verify-source-file-content
      * verify-start-console-command-output
      * verify-workspace-contains-directory
      * verify-workspace-file-content
      * wait-for-output

      To create a new "unknown-action" activity type,
      run "text-run add unknown-action"
      """
