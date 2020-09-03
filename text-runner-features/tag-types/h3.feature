Feature: active h3 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H3 tag
    Given the source code contains a file "1.md" with content:
      """
      <h3 type="HelloWorld">hello</h3>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
