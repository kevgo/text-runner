Feature: active BR tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: bold tag
    Given the source code contains a file "1.md" with content:
      """
      <br type="HelloWorld">
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
