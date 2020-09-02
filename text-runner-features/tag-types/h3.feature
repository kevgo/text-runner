Feature: active h3 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H3 tag
    Given the source code contains a file "1.md" with content:
      """
      <h3 type="HelloWorld">hello</h3>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
