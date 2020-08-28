Feature: separate working directory

  Background:
    Given the source code contains a file "print-cwd.md" with content:
      """
      <code type="javascript/runnable">
      console.log(process.cwd())
      </code
      """

  Scenario: default configuration
    When running text-run
    Then it runs in the "tmp" directory

  Scenario: running in a local temp directory
    Given the text-run configuration contains:
      """
      useSystemTempDirectory: false
      """
    When running text-run
    Then it runs in the "tmp" directory

  Scenario: running in a global temp directory
    Given the text-run configuration contains:
      """
      useSystemTempDirectory: true
      """
    When running text-run
    Then it runs in a global temp directory
