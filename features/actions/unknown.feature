Feature: unknown actions

  As a tutorial developer
  I want to be notified if my tutorial uses an action for which there is no handler
  So that I can fix my tutorial.

  - using an action for which there is no handler causes the test run to fail


  Scenario: using an unknown action
    When trying to execute the "unknown-action" example
    Then the test fails with:
      | ERROR MESSAGE | unknown action: unknownAction |
      | FILENAME      | unknown-action.md             |
      | EXIT CODE     | 1                             |
