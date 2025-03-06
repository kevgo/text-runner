Feature: shell/command

  Scenario: inside <pre> tags
    Given the source code contains a file "running.md" with content:
      """
      <pre type="shell/command">
      mkdir example
      </pre>
      """
    When calling Text-Runner
    Then the test workspace now contains a directory "example"

  Scenario: with fenced block
    Given the source code contains a file "running.md" with content:
      """
      <a type="shell/command">

      ```
      mkdir example
      ```
      </a>
      """
    When calling Text-Runner
    Then the test workspace now contains a directory "example"

  Scenario: empty console command
    Given the source code contains a file "running.md" with content:
      """
      <a type="shell/command">

      ```
      ```
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME   | LINE | ACTION        | STATUS | ERROR TYPE | ERROR MESSAGE                                                   |
      | running.md | 1    | shell/command | failed | UserError  | the <a type="shell/command"> region contains no commands to run |
