@api
Feature: active strong tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: strong tag
    Given the source code contains a file "1.md" with content:
      """
      <strong type="HelloWorld">foo</strong>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
