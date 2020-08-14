@skipWindows
Feature: separate working directory

  As a documentation writer
  I want the tests for my documentation to run in a directory separate from my tutorial
  So that I don't clutter up my documentation source code with temporary files creating by the tests.

  Background:
    Given the workspace contains the file "1.md" with content:
      """
      <pre textrun="test">
      pwd
      </pre>
      """

  Scenario: default configuration
    When running text-run
    Then it runs in the "tmp" directory
    And the "tmp" directory is now deleted

Scenario: running in a local temp directory
  Given the text-run configuration contains:
    """
    useSystemTempDirectory: false
    """
  When running text-run
  Then it runs in the "tmp" directory
  And the "tmp" directory is now deleted

Scenario: running in a global temp directory
  Given the text-run configuration contains:
    """
    useSystemTempDirectory: true
    """
  When running text-run
  Then it runs in a global temp directory
