Feature: display the version

  As a TextRunner user
  I want to know the exact version of the tool I have installed
  So that I know whether to upgrade.

  - run "text-run version" to see the currently installed version of the tool


  Scenario: displaying the version
    When running "text-run version"
    Then it prints:
      """
      TextRunner v\d+\.\d+\.\d+
      """
