@cli
Feature: help command

  Scenario:
    When running "text-runner help"
    Then it prints:
      """
      USAGE: .*

      COMMANDS
      """
