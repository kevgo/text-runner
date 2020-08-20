Feature: active h6 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H6 tag
    Given the source code contains a file "1.md" with content:
      """
      <h6 textrun="HelloWorld">hello</h6>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
