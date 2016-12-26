Feature: Configuration file

  As a writer working on documentation to a complex code base with other types of documentation
  I want to be able to configure TextRunner to the specifics of my directory structure
  So that it works in all situations.

  - a configuration file is named "text-run.yml"
  - the configuration file is optional


  Scenario: running without a configuration file
    Given I am in a directory that contains documentation without a configuration file
    When running text-run
