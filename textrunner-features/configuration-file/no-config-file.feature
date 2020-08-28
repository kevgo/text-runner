Feature: Configuration file is optional

  Scenario: running without a configuration file
    Given I am in a directory that contains documentation without a configuration file
    When running text-run
    Then it runs without errors
