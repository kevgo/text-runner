@clionly
Feature: display total test time

  As a tutorial writer
  I want to know the total time my tests took
  So that I can track test speed optimizations accurately.

  - after each test runs, it displays the elapsed time


  Scenario: displaying the elapsed test time
    Given my workspace contains a tutorial
    When running tut-run
    Then it prints:
      """
      \d steps in \d files, \d+ms
      """
