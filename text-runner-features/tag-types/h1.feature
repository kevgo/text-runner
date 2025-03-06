@api
Feature: active h1 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H1 tag
    Given the source code contains a file "1.md" with content:
      """
      <h1 type="HelloWorld">hello</h1>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
