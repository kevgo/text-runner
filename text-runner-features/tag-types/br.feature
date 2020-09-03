Feature: active BR tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: bold tag
    Given the source code contains a file "1.md" with content:
      """
      <br type="HelloWorld">
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
