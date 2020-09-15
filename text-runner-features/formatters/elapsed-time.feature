Feature: display total test time

  Scenario: displaying the elapsed test time
    Given my workspace contains testable documentation
    When running Text-Runner
    Then it prints:
      """
      \d activities, \d+m?s
      """
