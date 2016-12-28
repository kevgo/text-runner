Feature: unknown actions

  As a documentation developer
  I want to be notified if my documentation uses an action for which there is no handler
  So that I can fix my documentation.

  - using an action for which there is no handler causes the test run to fail


  Scenario: using an unknown action
    Given my source code contains the file "1.md" with the content:
      """
      <a class="tr_unknownAction">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | ERROR MESSAGE | unknown action: unknownAction |
      | FILENAME      | 1.md                          |
      | EXIT CODE     | 1                             |
