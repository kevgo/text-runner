Feature: display total test time

  As a documentation writer
  I want to know the total time my tests took
  So that I can track test speed optimizations accurately.

  - after each test runs, it displays the elapsed time


  Scenario: displaying the elapsed test time
    Given my workspace contains testable documentation
    When running text-run
    Then it prints:
      """
      \d activities in \d files, \d+m?s
      """
