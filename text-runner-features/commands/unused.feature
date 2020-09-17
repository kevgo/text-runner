@cli
Feature: show unused steps

  Scenario: the code base contains unused steps
    Given my workspace contains testable documentation
    And the source code contains the HelloWorld action
    When running "text-run unused"
    Then it prints:
      """
      Unused activities:
      - hello-world
      """
