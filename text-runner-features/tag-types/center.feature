@api
Feature: active CENTER tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: active CENTER tag
    Given the source code contains a file "1.md" with content:
      """
      <center type="HelloWorld">foo</center>
      """
    When calling Text-Runner
    Then it runs these actions:
      | FILENAME | LINE | ACTION      |
      | 1.md     | 1    | hello-world |
