Feature: running multiple console commands

  As a documentation writer
  I want my users to be able to run multiple console commands at once
  So that they can follow more complex steps efficiently.

  - all commands provided are run in a Bash shell, concatenated via " && "


  Scenario: running multiple console commands
    Given my workspace contains the file "running-multiple-commands.md" with the content:
      """
      <a class="tr_runConsoleCommand">
      ```
      echo "hello"
      echo "world"
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | running-multiple-commands.md                          |
      | LINE     | 1-6                                                   |
      | MESSAGE  | running console command: echo "hello" && echo "world" |

