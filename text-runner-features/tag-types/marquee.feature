Feature: <marquee> tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: hr tag
    Given the source code contains a file "1.md" with content:
      """
      <marquee type="HelloWorld">
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
