Feature: active blockquote tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: blockquote tag
    Given the source code contains a file "1.md" with content:
      """
      <blockquote type="HelloWorld">hello</blockquote>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
