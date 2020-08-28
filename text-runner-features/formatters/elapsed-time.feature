Feature: display total test time

  Scenario: displaying the elapsed test time
    Given my workspace contains testable documentation
    When running text-run
    Then it prints:
      """
      \d activities in \d files, \d+m?s
      """
