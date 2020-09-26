@api
Feature: active blockquote tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: blockquote tag
    Given the source code contains a file "1.md" with content:
      """
      <blockquote type="HelloWorld">hello</blockquote>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
