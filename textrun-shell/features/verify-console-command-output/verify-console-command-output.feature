@smoke
Feature: verifying the output of the last console command

  Scenario: verifying the output of a console command
    Given the source code contains a file "verify-output.md" with content:
      """
      <a type="shell/command">

      ```
      echo one
      echo two
      echo three
      ```
      </a>

      <a type="shell/command-output">

      ```
      one
      three
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | verify-output.md                                     |
      | LINE     | 10                                                   |
      | MESSAGE  | verifying the output of the last run console command |
