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
    When calling Text-Runner
    Then it emits these events:
      | FILENAME         | LINE | ACTION              | ACTIVITY                                         |
      | create-server.md | 1    | workspace/new-file  | create file server.js                            |
      | run-server.md    | 1    | shell/server        | starting a server process: node server.js        |
      | run-server.md    | 8    | shell/server-output | verifying the output of the long-running process |
      | run-server.md    | 15   | shell/stop-server   | stopping the long-running process                |
    And there are no child processes running

  Scenario: no running process
    Given the source code contains a file "1.md" with content:
      """
      <a type="shell/stop-server">

      There is no process running here

      </a>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION            | STATUS | ERROR TYPE | ERROR MESSAGE            |
      | 1.md     | 1    | shell/stop-server | failed | UserError  | No running process found |
