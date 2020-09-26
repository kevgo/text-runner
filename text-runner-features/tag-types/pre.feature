@api
Feature: active pre tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: pre tag
    Given the source code contains a file "1.md" with content:
      """
      <pre type="HelloWorld">
      foo
      </pre>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
