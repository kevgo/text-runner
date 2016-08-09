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
    Then it prints:
      """
      running.md:1 -- running console command: ls -1
      """
    And the test passes


  Scenario: missing console command block
    Given my workspace contains the file "running.md" with the content:
      """
      <a class="tutorialRunner_consoleCommand">
      foo
      </a>
      """
    When executing the tutorial
    Then the test fails with exit code 1 and the error:
      """
      running.md:1 -- Error: no console commands to run found
      """


  Scenario: empty console command
    Given my workspace contains the file "running.md" with the content:
      """
      <a class="tutorialRunner_consoleCommand">
      ```
      ```
      </a>
      """
    When executing the tutorial
    Then the test fails with exit code 1 and the error:
      """
      running.md:2 -- Error: the block that defines console commands to run is empty
      """
