@clionly
Feature: display the version

  As a TextRunner user
  I want to know the exact version of the tool I have installed
  So that I know whether to upgrade.

  - run "text-run version" to see the currently installed version of the tool


  @apionly
  Scenario: displaying the version
    When running "version"
    Then it prints:
      """
      TextRunner v\d+\.\d+\.\d+
      """


  @clionly
  Scenario: displaying the version via the CLI
    When running "text-run version"
    Then it prints:
      """
      TextRunner v\d+\.\d+\.\d+
      """
