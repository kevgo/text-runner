Feature: defining global binaries

  As a developer of a command-line utility that will be installed globally on users machines
  I want TextRunner to run the local version under development when the documentation calls the global tool
  So that I can make sure changes to the source of my tool are properly documented.

  - the configuration setting "actions.runConsoleCommand.globals"
    defines binaries that are available globally


  Scenario: calling a local tool as if it were installed globally
    When executing the "global-tool" example
    Then it signals:
      | FILENAME | 1.md                    |
      | LINE     | 5                       |
      | MESSAGE  | running console command |
