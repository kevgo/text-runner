@api
Feature: active link tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: link tag
    Given the source code contains a file "1.md" with content:
      """
      <a type="HelloWorld" href=".">
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
      | 1.md     | 1    | check-link  |
