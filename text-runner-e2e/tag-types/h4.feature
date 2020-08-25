Feature: active h4 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H4 tag
    Given the source code contains a file "1.md" with content:
      """
      <h4 type="HelloWorld">hello</h4>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
