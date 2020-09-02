Feature: running inline regions of Javascript

  Scenario: missing code block
    Given the source code contains a file "1.md" with content:
      """
      <a type="javascript/runnable">
      </a>
      """
    When trying to run Text-Runner
    Then the test fails with:
      | FILENAME      | 1.md                     |
      | LINE          | 1                        |
      | ERROR MESSAGE | no JavaScript code found |
      | EXIT CODE     | 1                        |


  Scenario: multiple code blocks
    Given the source code contains a file "1.md" with content:
      """
      <a type="javascript/runnable">

      ```
      console.log('one');
      ```

      ```
      console.log('two');
      ```
      </a>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md           |
      | LINE     | 1              |
      | MESSAGE  | run JavaScript |
