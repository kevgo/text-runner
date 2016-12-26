@skipWindows
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
    Given my workspace contains the file "server.js" with the content:
      """
      http = require('http')
      http.createServer(function(req, res) { res.end('long-running server') })
          .listen(4000, '127.0.0.1', function() { console.log('running at port 4000') })
      """
    And my workspace contains the file "1.md" with the content:
      """
      <a class="textRunner_startConsoleCommand">

      ```
      node server.js
      ```
      </a>

      <a class="textRunner_waitForOutput">
      ```
      running at port 4000
      ```
      </a>

      <a class="textRunner_stopConsoleCommand">
      Stop the current process by hitting Ctrl-C
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                                            |
      | LINE     | 1-6                                             |
      | MESSAGE  | starting a long-running process: node server.js |
    And it signals:
      | FILENAME | 1.md                                     |
      | LINE     | 8-12                                     |
      | MESSAGE  | waiting for output: running at port 4000 |
    And it signals:
      | FILENAME | 1.md                              |
      | LINE     | 14                                |
      | MESSAGE  | stopping the long-running process |
