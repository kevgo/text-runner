Feature: empty the workspace

  Background:
    Given the source code contains a file "text-run/list-dir.js" with content:
      """
      const fs = require("fs").promises
      module.exports = async function(action) {
        const items = await fs.readdir(action.configuration.workspace)
        action.name(`${items.length} workspace files (${items.join(", ")})`)
      }
      """
    And the source code contains a file "1.md" with content:
      """
      <a type="list-dir"> </a>
      """
    And the workspace contains a file "hello.md" with content:
      """
      Hello!
      """

  @api
  Scenario: default API behavior
    When calling Text-Runner
    Then it emits these events:
      | STATUS  | ACTIVITY             |
      | success | 0 workspace files () |

  @cli
  Scenario: default CLI behavior
    When running Text-Runner
    Then it prints:
      """
      1.md:1 -- 0 workspace files
      """

  @cli
  Scenario: disable via config file
    Given the text-run configuration contains:
      """
      emptyWorkspace: false
      """
    When running Text-Runner
    Then it prints:
      """
      1.md:1 -- 1 workspace files (hello.md)
      """

  @cli
  Scenario: disable via CLI
    When running "text-run --no-empty-workspace"
    Then it prints:
      """
      1.md:1 -- 1 workspace files (hello.md)
      """

  @api
  Scenario: disable via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, emptyWorkspace: false})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTIVITY                     |
      | 1.md     | 1    | 1 workspace files (hello.md) |
