@clionly
Feature: display the version

  As a TutorialRunner user
  I want to know the exact version of the tool I have installed
  So that I know whether to upgrade.

  - run "tut-run version" to see the currently installed version of the tool


  Scenario: displaying the version
    When running "tut-run version"
    Then it prints:
      """
      Tutorial Runner v\d+\.\d+\.\d+
      """
