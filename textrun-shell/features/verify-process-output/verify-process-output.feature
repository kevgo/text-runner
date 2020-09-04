@smoke
Feature: verifying the output of the last console command

  Scenario: verifying the output of a console command
    Given the source code contains a file "create-server.md" with content:
      """
      Create a file <a type="workspace/new-file">**server.js** with content:

      ```
      setTimeout(function() {
        console.log('one');
        console.log('two');
        console.log('three');
        setTimeout(function() {}, 1000)
      }, 100)
      ```
      </a>
      """
    And the source code contains a file "verify-output.md" with content:
      """
      Start the server by running <code type="shell/server">node server.js</code>.
      You see <a type="shell/server-output">

      ```
      one
      three
      ```
      </a>

      <a type="shell/stop-server">
      Stop the current process by hitting Ctrl-C
      </a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME         | LINE | ACTION              | ACTIVITY                                         |
      | create-server.md | 1    | workspace/new-file  | create file server.js                            |
      | verify-output.md | 1    | shell/server        | starting a server process: node server.js        |
      | verify-output.md | 2    | shell/server-output | verifying the output of the long-running process |
      | verify-output.md | 10   | shell/stop-server   | stopping the long-running process                |
