Feature: waiting for output of long-running processes

  As a documentation writer
  I want my users to wait until a long-running process has finished a certain task
  So that their next actions run inside the proper environment.

  - to wait for output of a long-running process, use the "waitForOutput" action
  - the text to wait for is a code block


  Scenario: waiting for output
    Given my workspace contains the file "server.js" with content:
      """
      setTimeout(function() {
        console.log('one')
        console.log('two')
        console.log('three')
      }, 100)
      """
    And my source code contains the file "long-running.md" with content:
      """
      <a textrun="start-process">
      ```
      $ node server.js
      ```
      </a>
      """
    And my source code contains the file "wait.md" with content:
      """
      <a textrun="verify-process-output">
      ```
      one
      three
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | wait.md                                          |
      | LINE     | 1-6                                              |
      | MESSAGE  | verifying the output of the long-running process |


  Scenario: waiting if no long-running process is executing


  Scenario: waiting for a process that has ended
