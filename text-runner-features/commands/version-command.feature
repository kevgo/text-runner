@cli
Feature: display the version

  Scenario: displaying the version
    When running "text-runner version"
    Then it prints:
      """
      TextRunner v\d+\.\d+\.\d+
      """
