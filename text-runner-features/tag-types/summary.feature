@api
Feature: active code tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: code tag
    Given the source code contains a file "1.md" with content:
      """
      <summary type="HelloWorld">foo</summary>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
