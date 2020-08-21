Feature: shell/exec

  Scenario: with fenced block
    Given the source code contains a file "running.md" with content:
      """
      <a textrun="shell/exec">

      ```
      echo hello
      ```
      </a>
      """
    When running text-run
    Then it runs the console command "echo hello"

  Scenario: inside <pre> tags
    Given the source code contains a file "running.md" with content:
      """
      <pre textrun="shell/exec">
      echo hello
      </pre>
      """
    When running text-run
    Then it runs the console command "echo hello"

  Scenario: empty console command
    Given the source code contains a file "running.md" with content:
      """
      <a textrun="shell/exec">

      ```
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | running.md                                                      |
      | LINE          | 1                                                               |
      | ERROR MESSAGE | the <a textrun="shell/exec"> region contains no commands to run |
      | EXIT CODE     | 1                                                               |
