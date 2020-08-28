Feature: active h1 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H1 tag
    Given the source code contains a file "1.md" with content:
      """
      <h1 type="HelloWorld">hello</h1>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
