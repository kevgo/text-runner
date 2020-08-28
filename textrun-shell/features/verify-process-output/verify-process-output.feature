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
    When running text-run
    Then it signals:
      | FILENAME | verify-output.md                                 |
      | LINE     | 2                                                |
      | MESSAGE  | verifying the output of the long-running process |
