Feature: separate working directory

  Background:
    Given the source code contains a file "print-cwd.md" with content:
      """
      <a type="printCWD"> </a>
      """
    Given the source code contains a file "text-run/print-cwd.js" with content:
      """
      module.exports = function(action) {
        action.log(process.cwd())
      }
      """

  Scenario: default configuration
    When calling Text-Runner
    Then it executes in the local "tmp" directory

  Scenario: running in a local temp directory via config file
    Given the text-run configuration contains:
      """
      useSystemTempDirectory: false
      """
    When running Text-Runner
    Then it runs in the local "tmp" directory

  Scenario: running in a local temp directory via CLI
    Given the text-run configuration contains:
      """
      useSystemTempDirectory: true
      """
    When running "text-run --use-system-tmp=false"
    Then it runs in the local "tmp" directory

  Scenario: running in a local temp directory via API
    When calling:
      """
      command = new textRunner.RunCommand({...config, useSystemTempDirectory: false})
      activityCollector = new ActivityCollector(command)
      await command.execute()
      result = activityCollector.activities()
      """
    Then it executes in the local "tmp" directory

  Scenario: running in a global temp directory via config file
    Given the text-run configuration contains:
      """
      useSystemTempDirectory: true
      """
    When running Text-Runner
    Then it runs in a global temp directory

  Scenario: running in a global temp directory via CLI
    When running "text-run --use-system-tmp=1 *.md"
    Then it runs in a global temp directory

  Scenario: running in a local temp directory via API
    When calling:
      """
      command = new textRunner.RunCommand({...config, useSystemTempDirectory: true})
      activityCollector = new ActivityCollector(command)
      await command.execute()
      result = activityCollector.activities()
      """
    Then it executes in a global temp directory
