Feature: empty the workspace

  Background:
    Given the source code contains a file "text-runner/list-dir.js" with content:
      """
      import {promises as fs} from "fs"
      export default async (action) => {
        const items = await fs.readdir(action.configuration.workspace.platformified())
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

  Scenario: default API behavior
    When calling Text-Runner
    Then it runs these actions:
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
    Given the text-runner configuration contains:
      """
      {
        "emptyWorkspace": false
      }
      """
    When running Text-Runner
    Then it prints:
      """
      1.md:1 -- 1 workspace files (hello.md)
      """

  @cli
  Scenario: disable via CLI
    When running "text-runner --no-empty-workspace"
    Then it prints:
      """
      1.md:1 -- 1 workspace files (hello.md)
      """

  @cli
  Scenario: enable via CLI
    Given the text-runner configuration contains:
      """
      {
        "emptyWorkspace": false
      }
      """
    When running "text-runner --empty-workspace"
    Then it prints:
      """
      1.md:1 -- 0 workspace files
      """

  Scenario: disable via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, emptyWorkspace: false})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it runs these actions:
      | FILENAME | LINE | ACTIVITY                     |
      | 1.md     | 1    | 1 workspace files (hello.md) |

  Scenario: enable via API
    When calling:
      """
      command = new textRunner.commands.Run({...config, emptyWorkspace: true})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it runs these actions:
      | FILENAME | LINE | ACTIVITY             |
      | 1.md     | 1    | 0 workspace files () |
