Feature: running multiple console commands

  Scenario: running multiple console commands
    Given the source code contains a file "running-multiple-commands.md" with content:
      """
      <pre type="shell/command">
      mkdir one
      mkdir two
      </pre>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME                     | LINE | ACTION        | ACTIVITY                                        |
      | running-multiple-commands.md | 1    | shell/command | running console command: mkdir one && mkdir two |
