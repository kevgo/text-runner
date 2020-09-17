@api
Feature: active bold tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: bold tag
    Given the source code contains a file "1.md" with content:
      """
      <b type="HelloWorld">hello</b>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
