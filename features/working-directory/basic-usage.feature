Feature: separate working directory

  As a tutorial writer
  I want the tests for my tutorial to run in a directory separate from my tutorial
  So that I don't clutter up my tutorial source code with temporary files creating by the tests.

  - by default the tests run in the current directory
  - to run the tests in an external temporary directory,
    provide the "use-temp-directory: true" option in tut-run.yml


  Background:
    Given my workspace contains a tutorial


  Scenario: default configuration
    When running tut-run
    Then it runs in the current working directory


  Scenario: running in a global temp directory
    Given my tut-run configuration contains:
      """
      useTempDirectory: true
      """
    When running tut-run
    Then it runs in a global temp directory

