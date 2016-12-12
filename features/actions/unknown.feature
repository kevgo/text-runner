Feature: unknown actions

  As a tutorial developer
  I want to be notified if my tutorial uses an action for which there is no handler
  So that I can fix my tutorial.

  - using an action for which there is no handler causes the test run to fail


  Scenario: using an unknown action
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_unknownAction">
      </a>
      """
    When trying to run tut-run
    Then the test fails with:
      | ERROR MESSAGE | unknown action: unknownAction |
      | FILENAME      | 1.md                          |
      | EXIT CODE     | 1                             |
