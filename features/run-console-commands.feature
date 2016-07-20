Feature: running console commands

  As a tutorial writer
  I want my users to run console commands
  So that they can execute the tool I am describing.

  - to run a console command, wrap the code in an A tag with class "tutorialRunner_consoleCommand"
  - the commands to run are provided in a triple-fenced code block
  - the commands can be preceded by a dollar sign, which is stripped


  Scenario: running console commands with dollar signs
    Given I am in a directory containing a file "running.md" with the content:
      """
      <a class="tutorialRunner_ConsoleCommand">
      ```
      $ ls -1
      $ ls -a
      ```
      </a>
      """
    When running "tut-run"
    Then it prints:
      """
      running.md:1 -- running console commands: ls -1 && ls -a
      running.md
      .
      ..
      running.md
      """
    And the test passes


  Scenario: running console commands without dollar signs
    Given I am in a directory containing a file "running.md" with the content:
      """
      <a class="tutorialRunner_ConsoleCommand">
      ```
      ls -1
      ls -a
      ```
      </a>
      """
    When running "tut-run"
    Then it prints:
      """
      running.md:1 -- running console commands: ls -1 && ls -a
      running.md
      .
      ..
      running.md
      """
    And the test passes


  Scenario: missing console command block
    Given I am in a directory containing a file "running.md" with the content:
      """
      <a class="tutorialRunner_ConsoleCommand">
      foo
      </a>
      """
    When running "tut-run"
    Then the test fails with exit code 1 and the error:
      """
      running.md:1 -- Error: no console commands to run found
      """


  Scenario: empty console command
    Given I am in a directory containing a file "running.md" with the content:
      """
      <a class="tutorialRunner_ConsoleCommand">
      ```
      ```
      </a>
      """
    When running "tut-run"
    Then the test fails with exit code 1 and the error:
      """
      running.md:1 -- Error: the block that defines console commands to run is empty
      """
