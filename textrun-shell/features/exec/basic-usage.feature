Feature: shell/command

  Scenario: no fenced code block
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
    Then it runs this action:
      | FILENAME      | running.md                                                      |
      | LINE          | 1                                                               |
      | ACTION        | shell/command                                                   |
      | ACTIVITY      | run shell command                                               |
      | STATUS        | failed                                                          |
      | ERROR TYPE    | UserError                                                       |
      | ERROR MESSAGE | the <a type="shell/command"> region contains no commands to run |

  Scenario: provide command via attribute
    Given the source code contains a file "running.md" with content:
      """
      <pre type="shell/command" command="mkdir example"></pre>
      """
    When calling Text-Runner
    Then the test workspace now contains a directory "example"
