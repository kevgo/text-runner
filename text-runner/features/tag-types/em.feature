Feature: active em tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: em tag
    Given the source code contains a file "1.md" with content:
      """
      <em type="HelloWorld">foo</em>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
