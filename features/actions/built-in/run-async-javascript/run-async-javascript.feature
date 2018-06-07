Feature: running inline blocks of asynchronous Javascript

  As a documentation writer describing a Javascript tool
  I want to be able to run pieces of inline asynchronous Javascript code
  So that my documentation can explain how to use that tool.

  - fenced code blocks wrapped in a "runAsyncJavascript" block are executed
  - local variable declarations persist across different code block calls


  Scenario: running asynchronous Javascript
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="run-async-javascript">
      ```
      async function test() {
        console.log('A foo walks into a bar')
      }
      await test()
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                 |
      | LINE     | 1                    |
      | MESSAGE  | run async javascript |
    And it prints:
      """
      A foo walks into a bar
      """


  Scenario: missing code block
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="run-async-javascript">
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
      <a textrun="run-async-javascript">
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
