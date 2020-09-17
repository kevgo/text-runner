@api
Feature: active em tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: em tag
    Given the source code contains a file "1.md" with content:
      """
      <em type="HelloWorld">foo</em>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
