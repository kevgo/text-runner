@clionly
Feature: running inline blocks of Javascript

  As a documentation writer describing a Javascript tool
  I want to be able to run pieces of inline Javascript code
  So that my documentation can explain how to use that tool.

  - fenced code blocks wrapped in a "runJavascript" block are executed
  - local variable declarations persist across different code block calls


  Scenario: running synchronous Javascript
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="run-javascript">
      ```
      console.log('A foo walks into a bar')
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md           |
      | LINE     | 5              |
      | MESSAGE  | run javascript |
    And it prints:
      """
      A foo walks into a bar
      """


  Scenario: running asynchronous Javascript using the "// ..." keyword
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="run-javascript">
      ```
      setTimeout(function() {
        console.log('A foo walks into a bar')
        // ...
      }, 1)
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md           |
      | LINE     | 8              |
      | MESSAGE  | run javascript |
    And it prints:
      """
      A foo walks into a bar
      """


  Scenario: running asynchronous Javascript using the "<CALLBACK>" keyword
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="run-javascript">
      ```
      setTimeout(<CALLBACK>, 1)
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md           |
      | LINE     | 5              |
      | MESSAGE  | run javascript |


  Scenario: persisting variables across blocks
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="run-javascript">
      ```
      const foo = 'bar'
      ```
      </a>

      <a textrun="run-javascript">
      ```
      console.log('A foo walks into a ' + foo)
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md           |
      | LINE     | 5              |
      | MESSAGE  | run javascript |
    And it signals:
      | FILENAME | 1.md           |
      | LINE     | 11             |
      | MESSAGE  | run javascript |
    Then it prints:
      """
      A foo walks into a bar
      """


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
      | MESSAGE       | run javascript       |
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
      | LINE          | 9                          |
      | MESSAGE       | run javascript             |
      | ERROR MESSAGE | too many code blocks found |
      | EXIT CODE     | 1                          |
