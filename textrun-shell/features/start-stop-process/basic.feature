Feature: long-running processes

  Scenario: starting and stopping a long-running process
    Given the source code contains a file "create-server.md" with content:
      """
      Create a file <a type="workspace/new-file">**server.js** with content:

      ```
      setTimeout(function() {
        console.log('running');
        setTimeout(function() {}, 1000)
      }, 100)
      ```
      """
    And the source code contains a file "run-server.md" with content:
      """
      <a type="shell/server">

      ```
      $ node server.js
      ```
      </a>

      <a type="shell/server-output">

      ```
      running
      ```
      </a>

      <a type="shell/stop-server">

      Stop the current process by hitting Ctrl-C

      </a>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | run-server.md                             |
      | LINE     | 1                                         |
      | MESSAGE  | starting a server process: node server.js |
    And it signals:
      | FILENAME | run-server.md                                    |
      | LINE     | 8                                                |
      | MESSAGE  | verifying the output of the long-running process |
    And it signals:
      | FILENAME | run-server.md                     |
      | LINE     | 15                                |
      | MESSAGE  | stopping the long-running process |
    And there are no child processes running

  Scenario: no running process
    Given the source code contains a file "1.md" with content:
      """
      <a type="shell/stop-server">

      There is no process running here

      </a>
      """
    When trying to run Text-Runner
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | No running process found |
      | EXIT CODE     | 1                        |
