Feature: running multiple console commands

  As a documentation writer
  I want my users to be able to run multiple console commands at once
  So that I can document more complex steps efficiently.

  - all commands provided are run in a Bash shell, concatenated via " && "


  Scenario: running multiple console commands
    Given my source code contains the file "running-multiple-commands.md" with content:
      """
      <a textrun="run-console-command">
      ```
      echo "hello"
      echo "world"
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | running-multiple-commands.md                          |
      | LINE     | 6                                                     |
      | MESSAGE  | running console command: echo "hello" && echo "world" |

