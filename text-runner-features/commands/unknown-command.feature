@smoke
@cli
Feature: unknown command

  Scenario: running an unknown command via the CLI
    When trying to run "text-runner zonk"
    Then the test fails with:
      | ERROR MESSAGE | file or directory does not exist: zonk |
      | EXIT CODE     | 1                                      |
