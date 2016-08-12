Feature: running console commands

  As a tutorial writer
  I want my users to run console commands
  So that they can execute the tool I am describing.

  - to run a console command, wrap the code in an A tag with class
    "tutorialRunner_consoleCommand"
  - the commands to run are provided in a triple-fenced code block
  - all commands run in a Bash shell, concatenated via " && "


  Scenario: running console commands
    Given my workspace contains the file "running.md" with the content:
      """
      <a class="tutorialRunner_consoleCommand">
      ```
      ls -1
      ```
      </a>
      """
    When executing the tutorial
    Then it runs the console command "ls -1"
    And the test passes


  Scenario: missing console command block
    Given my workspace contains the file "running.md" with the content:
      """
      <a class="tutorialRunner_consoleCommand">
      foo
      </a>
      """
    When executing the tutorial
    Then the test fails with:
      | ERROR MESSAGE | no console commands to run found |
      | FILENAME      | running.md                       |
      | LINE          | 1                                |
      | EXIT CODE     | 1                                |


  Scenario: empty console command
    Given my workspace contains the file "running.md" with the content:
      """
      <a class="tutorialRunner_consoleCommand">
      ```
      ```
      </a>
      """
    When executing the tutorial
    Then the test fails with:
      | ERROR MESSAGE | the block that defines console commands to run is empty |
      | FILENAME      | running.md                                              |
      | LINE          | 2                                                       |
      | EXIT CODE     | 1                                                       |
