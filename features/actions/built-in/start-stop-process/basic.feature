@skipWindows @clionly
Feature: long-running processes

  As a documentation writer
  I want my readers to be able to start and stop long-running processes
  So that documentation can work with long-running server processes.

  - use the "startConsoleCommand" action to start a command
  - the command to start is provided as a code block
  - the command is run in a shell
  - if the command exits the test fails
  - use the "stopCommand" action to stop the currently running command
  - use the "waitForOutput" action to wait until the long-running process outputs text


  Scenario: starting and stopping a long-running process
    Given my workspace contains the file "server.js" with content:
      """
      setTimeout(function() {
        console.log('running');
        setTimeout(function() {}, 1000)
      }, 100)
      """
    And my source code contains the file "1.md" with content:
      """
      <a textrun="start-process">

      ```
      node server.js
      ```
      </a>

      <a textrun="verify-process-output">
      ```
      running
      ```
      </a>

      <a textrun="stop-process">
      Stop the current process by hitting Ctrl-C
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                            |
      | LINE     | 6                                               |
      | MESSAGE  | starting a long-running process: node server.js |
    And it signals:
      | FILENAME | 1.md                                             |
      | LINE     | 12                                               |
      | MESSAGE  | verifying the output of the long-running process |
    And it signals:
      | FILENAME | 1.md                              |
      | LINE     | 14                                |
      | MESSAGE  | stopping the long-running process |
    And there are no child processes running


  Scenario: no running process
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="stop-process">
      There is no process running here
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | No running process found |
      | EXIT CODE     | 1                        |
