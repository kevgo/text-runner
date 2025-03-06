@smoke
Feature: verifying the output of the last console command

  Scenario: verifying the output of a console command
    Given the source code contains a file "verify-output.md" with content:
      """
      <a type="shell/command">

      ```
      echo one
      echo two
      echo three
      ```
      </a>

      <a type="shell/command-output">

      ```
      one
      three
      ```
      </a>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME         | LINE | ACTION               | ACTIVITY                                                    |
      | verify-output.md | 1    | shell/command        | running console command: echo one && echo two && echo three |
      | verify-output.md | 10   | shell/command-output | verifying the output of the last run console command        |
