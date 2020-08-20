Feature: active blockquote tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: blockquote tag
    Given the source code contains a file "1.md" with content:
      """
      <blockquote textrun="HelloWorld">hello</blockquote>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
