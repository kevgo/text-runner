Feature: ignore link patterns

  @api
  Scenario: regex via API
    Given the source code contains a file "1.md" with content:
      """
      a [placeholder link]($PLACEHOLDER)
      a [normal link](1.md)
      """
    When calling:
      """
      command = new textRunner.commands.Run({...config, ignoreLinkTargets: [/^\$/]})
      observer = new MyObserverClass(command)
      await command.execute()
      """
    Then it emits these events:
      | FILENAME | LINE | ACTION     |
      | 1.md     | 2    | check-link |

  @cli
  Scenario: regex via CLI
    Given the source code contains a file "text-runner.jsonc" with content:
      """
      {
        "ignoreLinkTargets": [
          "^\\$"
        ]
      }
      """
    Given the source code contains a file "1.md" with content:
      """
      a [placeholder link]($PLACEHOLDER)
      a [normal link](text-runner.yml)
      """
    When running Text-Runner
    Then it prints:
      """
      1.md:2 -- link to local file text-runner.yml
      """
    And it doesn't print:
      """
      1.md:1
      """
