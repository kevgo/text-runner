Feature: running multiple console commands

  As a tutorial writer
  I want my users to be able to run multiple console commands at once
  So that they can follow more complex tutorial steps efficiently.

  - all commands provided are run in a Bash shell, concatenated via " && "


  @verbose
  Scenario: running multiple console commands
    Given my workspace contains the file "running-multiple-commands.md" with the content:
      """
      <a class="tutorialRunner_consoleCommand">
      ```
      ls -a
      ls -a
      ```
      </a>
      """
    When running "tut-run"
    Then it prints:
      """
      running-multiple-commands.md:1 -- running console command: ls -a && ls -a
      .
      ..
      .
      ..
      """
    And the test passes
