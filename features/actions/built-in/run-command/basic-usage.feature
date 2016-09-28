Feature: running console commands

  As a tutorial writer
  I want my users to run console commands
  So that they can execute the tool I am describing.

  - to run a console command, wrap the code in an A tag with class
    "tutorialRunner_runCommand"
  - the commands to run are provided in a triple-fenced code block
  - all commands run in a Bash shell, concatenated via " && "


  Scenario: running console commands
    Given my workspace contains the file "running.md" with the content:
      """
      <a class="tutorialRunner_runCommand">
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
      <a class="tutorialRunner_runCommand">
      foo
      </a>
      """
    When executing the tutorial
    Then the test fails with:
      | FILENAME      | running.md              |
      | LINE          | 1                       |
      | MESSAGE       | running console command |
      | ERROR MESSAGE | no code blocks found    |
      | EXIT CODE     | 1                       |


  Scenario: empty console command
    Given my workspace contains the file "running.md" with the content:
      """
      <a class="tutorialRunner_runCommand">
      ```
      ```
      </a>
      """
    When executing the tutorial
    Then the test fails with:
      | FILENAME      | running.md                                              |
      | LINE          | 1-4                                                     |
      | MESSAGE       | running console command                                 |
      | ERROR MESSAGE | the block that defines console commands to run is empty |
      | EXIT CODE     | 1                                                       |
