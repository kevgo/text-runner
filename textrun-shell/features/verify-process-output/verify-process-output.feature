@smoke
Feature: verifying the output of the last console command

  Scenario: verifying the output of a console command
    Given the workspace contains a file "server.js" with content:
      """
      setTimeout(function() {
        console.log('one');
        console.log('two');
        console.log('three');
        setTimeout(function() {}, 1000)
      }, 100)
      """
    And the source code contains a file "verify-output.md" with content:
      """
      <a textrun="shell/start">

      ```
      node server.js
      ```
      </a>

      <a textrun="shell/start-output">

      ```
      one
      three
      ```
      </a>

      <a textrun="shell/stop">
      Stop the current process by hitting Ctrl-C
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | verify-output.md                                 |
      | LINE     | 8                                                |
      | MESSAGE  | verifying the output of the long-running process |
