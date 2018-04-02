Feature: validating Javascript

  As a documentation writer describing a Javascript tool
  I want my non-executable Javascript snippets to be at least syntactically validated
  So that I have confidence that even my non-executable tutorial is correct.

  - fenced code blocks wrapped in a "validateJavascript" block are parsed
  - syntax errors cause the action to fail


  Scenario: correct Javascript
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="validate-javascript">
      ```
      'working javascript'
      ```
      </a>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md                |
      | LINE     | 5                   |
      | MESSAGE  | validate javascript |


  Scenario: invalid Javascript
    Given my source code contains the file "1.md" with content:
      """
      <a textrun="validate-javascript">
      ```
      'missing quotes at end
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | 1.md                                            |
      | LINE          | 5                                               |
      | ERROR MESSAGE | invalid Javascript: Invalid or unexpected token |
      | EXIT CODE     | 1                                               |
