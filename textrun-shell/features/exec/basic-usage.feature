Feature: shell/exec

  Scenario: with fenced block
    Given my source code contains the file "running.md" with content:
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
    Given my source code contains the file "running.md" with content:
      """
      <pre textrun="shell/exec">
      echo hello
      </pre>
      """
    When running text-run
    Then it runs the console command "echo hello"

  Scenario: empty console command
    Given my source code contains the file "running.md" with content:
      """
      <a textrun="shell/exec">

      ```
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | running.md                                                     |
      | LINE          | 1                                                              |
      | ERROR MESSAGE | the <a textrun="shell/exec"> block contains no commands to run |
      | EXIT CODE     | 1                                                              |
