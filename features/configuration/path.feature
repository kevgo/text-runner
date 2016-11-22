Feature: defining global binaries

  As a developer of a command-line utility that will be installed globally on users machines
  I want TutorialRunner to run the local version under development when the documentation calls the global tool
  So that I can make sure changes to the source of my tool are properly documented.

  - the 'globals' configuration setting defines the binaries that are available globally


  Scenario: calling a local tool as if it were installed globally
    When executing the "global-tool" example
