Feature: running console commands

  As a documentation writer
  I want my users to run console commands
  So that they can execute the tool I am describing.

  - to run a console command, wrap the code in a tag with attribute
    textrun="runConsoleCommand"
  - the commands to run are provided in a triple-fenced code block
  - all commands run in a Bash shell, concatenated via " && "


  Scenario: running console commands
    Given my source code contains the file "running.md" with content:
      """
      <a textrun="runConsoleCommand">
      ```
      echo hello
      ```
      </a>
      """
    When running text-run
    Then it runs the console command "echo hello"


  Scenario: missing console command block
    Given my source code contains the file "running.md" with content:
      """
      <a textrun="runConsoleCommand">
      foo
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | running.md                                |
      | LINE          | 1                                         |
      | MESSAGE       | run console command                       |
      | ERROR MESSAGE | no 'fence' tag found in this active block |
      | EXIT CODE     | 1                                         |


  Scenario: empty console command
    Given my source code contains the file "running.md" with content:
      """
      <a textrun="runConsoleCommand">
      ```
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | running.md                                              |
      | LINE          | 1-4                                                     |
      | MESSAGE       | run console command                                     |
      | ERROR MESSAGE | the block that defines console commands to run is empty |
      | EXIT CODE     | 1                                                       |
