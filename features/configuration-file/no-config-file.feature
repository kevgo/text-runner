Feature: Configuration file is optional

  When using TextRunner on a new code base
  I want to be able to run it without having to create a configuration file
  So that I can run it quickly with the default settings.

  - the configuration file is optional


  Scenario: running without a configuration file
    Given I am in a directory that contains documentation without a configuration file
    When running text-run
    Then it runs without errors
