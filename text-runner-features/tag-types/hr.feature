@api
Feature: HR tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: active HR tag
    Given the source code contains a file "1.md" with content:
      """
      <hr type="HelloWorld">
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
