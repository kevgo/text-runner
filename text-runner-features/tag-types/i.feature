Feature: active i tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: italic tag
    Given the source code contains a file "1.md" with content:
      """
      <i type="HelloWorld">hello</i>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
