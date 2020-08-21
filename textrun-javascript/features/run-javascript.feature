Feature: running inline regions of Javascript

  Scenario: missing code block
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="javascript/run">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | no JavaScript code found |
      | EXIT CODE     | 1                        |


  Scenario: multiple code blocks
    Given the source code contains a file "1.md" with content:
      """
      <a textrun="javascript/run">

      ```
      console.log('one');
      ```

      ```
      console.log('two');
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md           |
      | LINE     | 1              |
      | MESSAGE  | run JavaScript |
