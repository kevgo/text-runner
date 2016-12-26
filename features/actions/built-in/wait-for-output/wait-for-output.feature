Feature: waiting for output of long-running processes

  As a documentation writer
  I want my users to wait until a long-running process has finished a certain task
  So that their next actions run inside the proper environment.

  - to wait for output of a long-running process, use the "waitForOutput" action
  - the text to wait for is a code block


  Scenario: waiting for output
    Given my workspace contains the file "long-running.md" with the content:
      """
      http = require('http')
      http.createServer(function(req, res) { res.end('long-running server') })
          .listen(4000, '127.0.0.1', function() { console.log('running at port 4000') })
      """
    And my workspace contains the file "wait.md" with the content:
      """
      <a class="tr_waitForOutput">
      ```
      running at port
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | wait.md                             |
      | LINE     | 1-5                                 |
      | MESSAGE  | waiting for output: running at port |


  Scenario: waiting if no long-running process is executing


  Scenario: waiting for a process that has ended
