Feature: running multiple console commands

  Scenario: running multiple console commands
    Given the source code contains a file "running-multiple-commands.md" with content:
      """
      <a textrun="shell/exec">

      ```
      echo "hello"
      echo "world"
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | running-multiple-commands.md                          |
      | LINE     | 1                                                     |
      | MESSAGE  | running console command: echo "hello" && echo "world" |
