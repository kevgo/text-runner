Feature: separate working directory

  Background:
    Given the source code contains a file "text-runner/print-cwd.js" with content:
      """
      export default (action) => {
        action.log(process.cwd())
      }
      """
    And the source code contains a file "print-cwd.md" with content:
      """
      <a type="printCWD"> </a>
      """


  @api
  Scenario: default configuration
    When calling Text-Runner
    Then it executes in the local "tmp" directory


  @cli
  Scenario: running in the default local temp directory via config file
    Given the text-runner configuration contains:
      """
      systemTmp: false
      """
    When running Text-Runner
    Then it runs in the local "tmp" directory


  @cli
  Scenario: running in a custom local temp directory via config file
    Given the text-runner configuration contains:
      """
      systemTmp: false
      workspace: foo
      """
    When running Text-Runner
    Then it runs in the local "foo" directory


  @cli
  Scenario: running in the default local temp directory via CLI
    Given the text-runner configuration contains:
      """
      systemTmp: true
      """
    When running "text-runner --no-system-tmp"
    Then it runs in the local "tmp" directory


  @cli
  Scenario: running in a custom local temp directory via CLI
    Given the text-runner configuration contains:
      """
      systemTmp: true
      workspace: foo
      """
    When running "text-runner --no-system-tmp --workspace=bar"
    Then it runs in the local "bar" directory


  @api
  Scenario: running in the default local temp directory via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, systemTmp: false})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it executes in the local "tmp" directory


  @api
  Scenario: running in a custom local temp directory via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, systemTmp: false, workspace: "foo"})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it executes in the local "foo" directory


  @cli
  Scenario: running in the default global temp directory via config file
    Given the text-runner configuration contains:
      """
      systemTmp: true
      """
    When running Text-Runner
    Then it runs in a global temp directory


  @cli
  Scenario: running in a custom global temp directory via config file
    Given the text-runner configuration contains:
      """
      systemTmp: true
      workspace: foo
      """
    When running Text-Runner
    Then it runs in the global "foo" temp directory


  @cli
  Scenario: running in the default global temp directory via CLI
    When running "text-runner --system-tmp *.md"
    Then it runs in a global temp directory


  @cli
  Scenario: running in a custom global temp directory via CLI
    When running "text-runner --system-tmp --workspace=foo *.md"
    Then it runs in the global "foo" temp directory


  @api
  Scenario: running in the default global temp directory via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, systemTmp: true})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it executes in a global temp directory


  @api
  Scenario: running in a custom global temp directory via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, systemTmp: true, workspace: "foo"})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it executes in the global "foo" temp directory
