@smoke
Feature: verifying the output of the last console command

  As a documentation writer
  I want to be able to print the expected output of console commands
  So that my readers can verify that they ran a console command correctly.

  - the "verifyStartConsoleCommandOutput" action matches the output of the last console command
  - the expected output is provided as a fenced code block
  - the actual output can contain more lines in between each line of the expected output


  Scenario: verifying the output of a console command
    Given my workspace contains the file "server.js" with content:
      """
      setTimeout(function() {
        console.log('one');
        console.log('two');
        console.log('three');
        setTimeout(function() {}, 1000)
      }, 100)
      """
    And my source code contains the file "verify-output.md" with content:
      """
      <a textrun="start-process">

      ```
      node server.js
      ```
      </a>

      <a textrun="verify-process-output">
      ```
      one
      three
      ```
      </a>

      <a textrun="stop-process">
      Stop the current process by hitting Ctrl-C
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | verify-output.md                                 |
      | LINE     | 8                                                |
      | MESSAGE  | verifying the output of the long-running process |
