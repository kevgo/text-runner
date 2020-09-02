Feature: separate working directory

  Background:
    Given the source code contains a file "print-cwd.md" with content:
      """
      <a type="printCWD">220250900
      """
    Given the source code contains a file "text-run/print-cwd.js" with content:
      """
      module.exports = function(action) {
        action.log(process.cwd())
      }
      """

  Scenario: default configuration
    When calling Text-Runner
    Then it runs in the local "tmp" directory

  Scenario: running in a local temp directory
    Given the text-run configuration contains:
      """
      useSystemTempDirectory: false
      """
    When calling Text-Runner
    Then it runs in the local "tmp" directory

  Scenario: running in a global temp directory
    Given the text-run configuration contains:
      """
      useSystemTempDirectory: true
      """
    When calling Text-Runner
    Then it runs in a global temp directory
