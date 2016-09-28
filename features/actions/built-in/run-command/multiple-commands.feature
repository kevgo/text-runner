Feature: running multiple console commands

  As a tutorial writer
  I want my users to be able to run multiple console commands at once
  So that they can follow more complex tutorial steps efficiently.

  - all commands provided are run in a Bash shell, concatenated via " && "


  Scenario: running multiple console commands
    Given my workspace contains the file "running-multiple-commands.md" with the content:
      """
      <a class="tutorialRunner_runCommand">
      ```
      ls -a
      ls -a
      ```
      </a>
      """
    When executing the tutorial
    Then it signals:
      | FILENAME | running-multiple-commands.md            |
      | LINE     | 1-6                                     |
      | MESSAGE  | running console command: ls -a && ls -a |
    And the test passes
