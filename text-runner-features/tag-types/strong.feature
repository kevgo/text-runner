Feature: active strong tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: strong tag
    Given the source code contains a file "1.md" with content:
      """
      <strong type="HelloWorld">foo</strong>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
