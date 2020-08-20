Feature: active i tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: italic tag
    Given the source code contains a file "1.md" with content:
      """
      <i textrun="HelloWorld">hello</i>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
