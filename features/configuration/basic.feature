Feature: Configuration file

  As a writer working on tutorials to a complex code base with other types of documentation
  I want to be able to configure Tutorial Runner to the specifics of my directory structure
  So that it works in all situations.

  - a configuration file is named "tut-run.yml"
  - the configuration file is optional


  Scenario: running without a configuration file
    Given I am in a directory that contains a tutorial without a configuration file
    When running tut-run
