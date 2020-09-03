Feature: active h6 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H6 tag
    Given the source code contains a file "1.md" with content:
      """
      <h6 type="HelloWorld">hello</h6>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
