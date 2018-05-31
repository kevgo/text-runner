Feature: verifying the output of the last console command

  As a documentation writer
  I want to be able to print the expected output of console commands
  So that my readers can verify that they ran a console command correctly.

  - the "verifyLastRunConsoleCommand" action matches the output of the last console command
  - the expected output is provided as a fenced code block
  - the actual output can contain more lines in between each line of the expected output


  Scenario: verifying the output of a console command
    Given my source code contains the file "verify-output.md" with content:
      """
      <a textrun="run-console-command">
      ```
      echo one
      echo two
      echo three
      ```
      </a>

      <a textrun="verify-console-command-output">
      ```
      one
      three
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | verify-output.md                                     |
      | LINE     | 9                                                    |
      | MESSAGE  | verifying the output of the last run console command |
