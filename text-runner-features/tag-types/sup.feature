Feature: active SUP tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: active tag
    Given the source code contains a file "1.md" with content:
      """
      <sup type="HelloWorld">foo</sup>
      """
    When calling Text-Runner
    Then it executes these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
