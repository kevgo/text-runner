Feature: separate working directory

  Background:
    Given the workspace contains a file "1.md" with content:
      """
      <pre type="javascript/runnable">
      console.log(process.cwd())
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
