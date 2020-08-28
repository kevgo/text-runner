Feature: active link tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: link tag
    Given the source code contains a file "1.md" with content:
      """
      <a type="HelloWorld" href=".">
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
