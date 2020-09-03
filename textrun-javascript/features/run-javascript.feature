Feature: running inline regions of Javascript

  Scenario: missing code block
    Given the source code contains a file "1.md" with content:
      """
      <a type="javascript/runnable">
      </a>
      """
    When trying to call Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION              | STATUS | ERROR TYPE | ERROR MESSAGE            |
      | 1.md     | 1    | javascript/runnable | failed | UserError  | no JavaScript code found |


  Scenario: multiple code blocks
    Given the source code contains a file "1.md" with content:
      """
      <a type="javascript/runnable">

      ```
      let a = 1;
      ```

      ```
      let a = 2;
      ```
      </a>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION              | ACTIVITY       |
      | 1.md     | 1    | javascript/runnable | run JavaScript |
