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
        setTimeout(function() {}, 10000)
      }, 100)
      """
    Given my source code contains the file "verify-output.md" with content:
      """
      <a class="tr_startConsoleCommand">

      ```
      node server.js
      ```
      </a>

      <a class="tr_waitForOutput">
      ```
      three
      ```
      </a>

      <a class="tr_verifyStartConsoleCommandOutput">
      ```
      one
      three
      ```
      </a>

      <a class="tr_stopConsoleCommand">
      Stop the current process by hitting Ctrl-C
      </a>
      """
    And running text-run
    Then it signals:
      | FILENAME | verify-output.md                                 |
      | LINE     | 14-19                                            |
      | MESSAGE  | verifying the output of the last started console command |
