@api
Feature: active h2 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H2 tag
    Given the source code contains a file "1.md" with content:
      """
      <h2 type="HelloWorld">hello</h2>
      """
    When calling Text-Runner
    Then it emits these events:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
