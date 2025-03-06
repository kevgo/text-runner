@api
Feature: active h4 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H4 tag
    Given the source code contains a file "1.md" with content:
      """
      <h4 type="HelloWorld">hello</h4>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
