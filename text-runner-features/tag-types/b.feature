Feature: active bold tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: bold tag
    Given the source code contains a file "1.md" with content:
      """
      <b type="HelloWorld">hello</b>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
