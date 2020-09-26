Feature: marking console commands with preceding dollar signs

  Scenario: running console commands with dollar signs
    Given the source code contains a file "running-with-dollar-sign.md" with content:
      """
      <pre type="shell/command">
      $ mkdir one
      $ mkdir two
      </pre>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME                    | LINE | ACTION        | ACTIVITY                                        |
      | running-with-dollar-sign.md | 1    | shell/command | running console command: mkdir one && mkdir two |
    And the test workspace now contains a directory "one"
    And the test workspace now contains a directory "two"
