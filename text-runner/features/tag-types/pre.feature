Feature: active pre tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: pre tag
    Given the source code contains a file "1.md" with content:
      """
      <pre textrun="HelloWorld">
      foo
      </pre>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
