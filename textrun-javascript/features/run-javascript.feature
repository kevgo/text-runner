Feature: running inline blocks of Javascript

  Scenario: missing code block
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="run-javascript">
      </a>
      """
    When trying to run text-run
    Then it signals:
      | FILENAME      | 1.md                 |
      | LINE          | 1                    |
      | ERROR MESSAGE | no code to run found |
      | EXIT CODE     | 1                    |


  Scenario: multiple code blocks
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="run-javascript">

      ```
      console.log('one')
      ```

      ```
      console.log('two')
      ```
      </a>
      """
    When trying to run text-run
    Then it signals:
      | FILENAME      | 1.md                       |
      | LINE          | 1                          |
      | ERROR MESSAGE | too many code blocks found |
      | EXIT CODE     | 1                          |
