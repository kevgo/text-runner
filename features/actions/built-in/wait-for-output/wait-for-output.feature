Feature: waiting for output of long-running processes

  As a tutorial writer
  I want my users to wait until a long-running process has finished a certain task
  So that their next actions run inside the proper environment.

  - to wait for output of a long-running process, use the "waitForOutput" action
  - the text to wait for is a code block


  Scenario: waiting for output
    Given my tutorial is starting the "long-running" example
    And my workspace contains the file "wait.md" with the content:
      """
      <a class="tutorialRunner_waitForOutput">
      ```
      running at port
      ```
      </a>
      """
    When running tut-run
    Then it signals:
      | FILENAME | wait.md                             |
      | LINE     | 1-5                                 |
      | MESSAGE  | waiting for output: running at port |


  Scenario: waiting if no long-running process is executing


  Scenario: waiting for a process that has ended
