Feature: running inline blocks of Javascript

  Scenario: missing code block
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="javascript/run">
      </a>
      """
    When trying to run text-run
    Then it signals:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | no JavaScript code found |
      | EXIT CODE     | 1                        |


  Scenario: multiple code blocks
    Given my source code contains the file "1.md" with content:
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
